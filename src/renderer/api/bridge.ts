const wrappedApiCache = new WeakMap<object, object>();

/** 将 IPC 参数转换为不含 Vue Proxy 的纯 JSON 数据。 */
export function normalizeIpcArguments(args: unknown[]): unknown[] {
  if (args.length === 0) return args;
  return JSON.parse(JSON.stringify(args)) as unknown[];
}

/**
 * 创建 preload API 的普通对象门面，在参数穿过 contextBridge 前完成序列化。
 * 返回值保持原始 API 类型，调用方不需要逐处处理 reactive 对象。
 */
export function wrapIpcApi<T extends object>(target: T): T {
  const cached = wrappedApiCache.get(target);
  if (cached) return cached as T;

  const wrapped: Record<PropertyKey, unknown> = {};
  wrappedApiCache.set(target, wrapped);

  Reflect.ownKeys(target).forEach((property) => {
    const value = Reflect.get(target, property);

    if (typeof value === 'function') {
      Reflect.set(wrapped, property, (...args: unknown[]) => {
        return Reflect.apply(value, undefined, normalizeIpcArguments(args));
      });
      return;
    }

    if (value !== null && typeof value === 'object') {
      Reflect.set(wrapped, property, wrapIpcApi(value));
      return;
    }

    Reflect.set(wrapped, property, value);
  });

  return wrapped as T;
}
