import { ipcMain, type BrowserWindow, type WebContents } from 'electron';
import { ZodError, type ZodSchema } from 'zod';
import log from 'electron-log/main';

/**
 * IPC 安全工具 - 校验每个 IPC 请求的频道、参数和窗口来源。
 * 所有 IPC 使用 invoke/handle 请求响应模型，入参出参均经 Zod 校验。
 */

/** 校验失败错误 */
export class IpcValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Array<{ path: string; message: string }>,
  ) {
    super(message);
    this.name = 'IpcValidationError';
  }
}

/** 已注册的允许调用窗口集合 */
const allowedWindows = new Set<number>();

/** 注册允许调用 IPC 的窗口 */
export function registerAllowedWindow(window: BrowserWindow): void {
  allowedWindows.add(window.webContents.id);
  window.on('closed', () => {
    allowedWindows.delete(window.webContents.id);
  });
}

/** 校验调用方是否为已授权窗口 */
function validateSender(sender: WebContents): void {
  if (!allowedWindows.has(sender.id)) {
    log.error(`[ipc-security] 拒绝未授权窗口的 IPC 调用: senderId=${sender.id}`);
    throw new Error('未授权的调用来源');
  }
}

/** Zod 错误转字段错误数组 */
function formatZodError(error: ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((e: { path: PropertyKey[]; message: string }) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
}

/**
 * 注册一个带校验的 IPC handler。
 * 自动校验窗口来源和入参 Schema，捕获异常并返回标准错误结构。
 */
export function registerHandler<TInput, TOutput>(
  channel: string,
  inputSchema: ZodSchema<TInput> | null,
  handler: (input: TInput, sender: WebContents) => Promise<TOutput> | TOutput,
): void {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      validateSender(event.sender);

      let input: TInput;
      if (inputSchema) {
        const parseResult = inputSchema.safeParse(args[0]);
        if (!parseResult.success) {
          throw new IpcValidationError('参数校验失败', formatZodError(parseResult.error));
        }
        input = parseResult.data;
      } else {
        input = args[0] as TInput;
      }

      const result = await handler(input, event.sender);
      // JSON 序列化确保返回值是纯对象，避免 structured clone 失败
      const safe = JSON.parse(JSON.stringify(result));
      return { ok: true, data: safe };
    } catch (err) {
      if (err instanceof IpcValidationError) {
        log.warn(`[ipc] 校验失败 ${channel}:`, err.message);
        return { ok: false, error: err.message, fieldErrors: err.fieldErrors };
      }
      const message = err instanceof Error ? err.message : String(err);
      log.error(`[ipc] 处理失败 ${channel}:`, message);
      return { ok: false, error: message };
    }
  });
}

/** IPC 响应类型 */
export type IpcResponse<T> = { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Array<{ path: string; message: string }> };
