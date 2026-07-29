import { app, dialog, BrowserWindow } from 'electron';
import { resolve } from 'node:path';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import { selectFileSchema } from '@shared/schemas/index';
import type { SelectFileInput } from '@shared/schemas/index';
import { getInitStatus } from '../domains/audit/settings-service';
import { checkIntegrity, getRawDb } from '../db/connection';
import { consistencyCheck } from '../domains/inventory/ledger-service';
import { statfsSync } from 'node:fs';
import log from 'electron-log/main';

/**
 * 系统 IPC 处理器 - 版本、初始化状态、数据库健康、磁盘空间、诊断包导出。
 */

/** 脱敏：移除完整税号、银行账号、密钥等敏感信息 */
function sanitizeText(text: string): string {
  return text
    // 脱敏税号（保留前 4 后 4）
    .replace(/纳税(人)?(识别号|税号)[：:\s]*([0-9A-Za-z]{4})[0-9A-Za-z]+([0-9A-Za-z]{4})/g, '$1$2: $3****$4')
    // 脱敏银行账号（保留后 4 位）
    .replace(/银行账号[：:\s]*\d+(\d{4})/g, '银行账号: ****$1')
    .replace(/bank_account[：:\s]*\d+(\d{4})/g, 'bank_account: ****$1')
    // 脱敏腾讯云 COS 密钥
    .replace(/AKID[A-Za-z0-9]+/g, 'AKID****')
    .replace(/secret[_-]?id[":\s]+["']?[^"',}\s]+/gi, 'secret_id: ***')
    .replace(/secret[_-]?key[":\s]+["']?[^"',}\s]+/gi, 'secret_key: ***')
    .replace(/security[_-]?token[":\s]+["']?[^"',}\s]+/gi, 'security_token: ***')
    // 脱敏恢复密码
    .replace(/restore[_-]?password[":\s]+["']?[^"',}\s]+/gi, 'restore_password: ***');
}

/** 读取最近日志文件（脱敏后） */
function collectSanitizedLogs(): string {
  const logDir = resolve(app.getPath('userData'), 'logs');
  if (!existsSync(logDir)) return '(无日志目录)';
  try {
    const files = readdirSync(logDir).filter((f) => f.endsWith('.log')).sort().reverse().slice(0, 3);
    const parts: string[] = [];
    for (const file of files) {
      const filePath = resolve(logDir, file);
      const content = readFileSync(filePath, 'utf-8');
      parts.push(`=== ${file} ===\n${sanitizeText(content)}`);
    }
    return parts.join('\n\n') || '(无日志文件)';
  } catch {
    return '(读取日志失败)';
  }
}

/** 收集数据库健康信息 */
function collectDbHealth(): string {
  try {
    const raw = getRawDb();
    const integrityResult = raw.pragma('integrity_check') as Array<{ integrity_check: string }>;
    const integrityOk = integrityResult.length === 1 && integrityResult[0].integrity_check === 'ok';
    const { consistent, mismatches } = consistencyCheck();
    const tables = ['customers', 'products', 'price_versions', 'outbound_batches', 'outbound_lines', 'inbound_batches', 'inbound_lines', 'inventory_ledger', 'audit_events'];
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const row = raw.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get() as { cnt: number };
      counts[table] = row.cnt;
    }
    return JSON.stringify({
      integrityOk,
      ledgerConsistent: consistent,
      mismatchCount: mismatches.length,
      recordCounts: counts,
    }, null, 2);
  } catch (err) {
    return `数据库健康检查失败: ${(err as Error).message}`;
  }
}

export function registerSystemIpc(): void {
  registerHandler(IPC_CHANNELS.system.getVersion, null, () => {
    return { version: app.getVersion(), electron: process.versions.electron };
  });

  registerHandler(IPC_CHANNELS.system.getInitStatus, null, () => {
    return getInitStatus();
  });

  /** 文件选择对话框 - sandbox 模式下渲染进程无法获取 File.path，统一由主进程弹出原生对话框 */
  registerHandler(IPC_CHANNELS.system.selectFile, selectFileSchema, (input: SelectFileInput, sender) => {
    const parentWindow = BrowserWindow.fromWebContents(sender);
    const options: Electron.OpenDialogOptions = {
      title: input.title ?? '选择文件',
      properties: ['openFile'],
      filters: [{ name: 'Excel 文件', extensions: input.extensions }],
    };
    const task = parentWindow
      ? dialog.showOpenDialog(parentWindow, options)
      : dialog.showOpenDialog(options);
    return task.then((result) => {
      if (result.canceled || result.filePaths.length === 0) {
        return { canceled: true, filePath: null };
      }
      return { canceled: false, filePath: result.filePaths[0] };
    });
  });

  registerHandler(IPC_CHANNELS.system.getDbHealth, null, () => {
    try {
      const raw = getRawDb();
      const integrityOk = checkIntegrity(raw);
      const { consistent, mismatches } = consistencyCheck();
      return { integrityOk, consistent, mismatchCount: mismatches.length };
    } catch (err) {
      return { integrityOk: false, consistent: false, mismatchCount: 0, error: (err as Error).message };
    }
  });

  registerHandler(IPC_CHANNELS.system.getDiskSpace, null, () => {
    try {
      const dataPath = resolve(app.getPath('userData'), 'data');
      const stats = statfsSync(dataPath);
      return { available: stats.bavail * stats.bsize, total: stats.blocks * stats.bsize };
    } catch {
      return { available: null, total: null };
    }
  });

  /** 导出诊断包：只包含脱敏日志、版本和数据库健康结果 */
  registerHandler(IPC_CHANNELS.system.exportDiagnostics, null, async () => {
    const saveResult = await dialog.showSaveDialog({
      title: '导出诊断包',
      defaultPath: `诊断包-${new Date().toISOString().split('T')[0]}.txt`,
      filters: [{ name: '文本文件', extensions: ['txt'] }],
    });
    if (saveResult.canceled || !saveResult.filePath) return { saved: false };

    const report = [
      '========================================',
      '成都莱盛发票库存管理工具 - 诊断包',
      '========================================',
      '',
      `生成时间: ${new Date().toISOString()}`,
      `应用版本: ${app.getVersion()}`,
      `Electron 版本: ${process.versions.electron}`,
      `Node.js 版本: ${process.versions.node}`,
      `平台: ${process.platform} ${process.arch}`,
      '',
      '--- 初始化状态 ---',
      JSON.stringify(getInitStatus(), null, 2),
      '',
      '--- 数据库健康 ---',
      collectDbHealth(),
      '',
      '--- 日志（已脱敏） ---',
      collectSanitizedLogs(),
      '',
      '========================================',
      '诊断包结束',
      '========================================',
    ].join('\n');

    writeFileSync(saveResult.filePath, report, 'utf-8');
    log.info(`[system] 诊断包已导出到: ${saveResult.filePath}`);
    return { saved: true, path: saveResult.filePath };
  });
}
