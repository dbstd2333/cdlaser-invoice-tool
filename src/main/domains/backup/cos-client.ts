import COS from 'cos-nodejs-sdk-v5';
import type { CosConfig } from './backup-service';
import log from 'electron-log/main';

/**
 * 腾讯云 COS 客户端封装。
 */

/** 创建 COS 客户端。 */
export function createCosClient(config: CosConfig): COS {
  return new COS({
    SecretId: config.secretId,
    SecretKey: config.secretKey,
    SecurityToken: config.securityToken,
  });
}

/** 测试 COS 存储桶连接。 */
export async function testCosConnection(config: CosConfig): Promise<{ success: boolean; message: string }> {
  try {
    await createCosClient(config).headBucket({
      Bucket: config.bucket,
      Region: config.region,
    });
    return { success: true, message: 'COS Bucket 连接成功' };
  } catch (err) {
    const message = getErrorMessage(err);
    log.warn('[cos] 连接测试失败:', sanitizeErrorMessage(message));
    return { success: false, message: sanitizeErrorMessage(message) };
  }
}

/** 从 COS SDK 异常中提取不含请求明细的可读信息。 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (!error || typeof error !== 'object') return String(error);

  const detail = error as { code?: unknown; message?: unknown; statusCode?: unknown };
  const parts = [detail.code, detail.message, detail.statusCode]
    .filter((value) => typeof value === 'string' || typeof value === 'number')
    .map(String);
  return parts.join(' · ') || 'COS 请求失败';
}

/** 清理错误消息中的敏感信息。 */
function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/AKID[A-Za-z0-9]+/g, '***')
    .replace(/secret[_-]?id[^,}]*/gi, '***')
    .replace(/secret[_-]?key[^,}]*/gi, '***');
}

/** 构造备份对象键。 */
export function buildObjectKey(prefix: string | undefined, installId: string): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const ts =
    `${yyyy}${mm}` +
    `${String(now.getUTCDate()).padStart(2, '0')}` +
    `-` +
    `${String(now.getUTCHours()).padStart(2, '0')}` +
    `${String(now.getUTCMinutes()).padStart(2, '0')}` +
    `${String(now.getUTCSeconds()).padStart(2, '0')}Z`;
  const prefixPart = prefix ? prefix.replace(/^\/+|\/+$/g, '') : '';
  return [prefixPart, installId, yyyy, mm, `invoice-backup-${ts}.cdbak`]
    .filter(Boolean)
    .join('/');
}

/** 上传备份文件到 COS。 */
export async function uploadBackup(
  config: CosConfig,
  objectKey: string,
  data: Buffer,
  manifest: { appVersion: string; schemaVersion: string; backupType: string; createdAt: string },
): Promise<void> {
  await createCosClient(config).putObject({
    Bucket: config.bucket,
    Region: config.region,
    Key: objectKey,
    Body: data,
    ContentLength: data.length,
    ContentType: 'application/octet-stream',
    'x-cos-meta-app-version': manifest.appVersion,
    'x-cos-meta-schema-version': manifest.schemaVersion,
    'x-cos-meta-backup-type': manifest.backupType,
    'x-cos-meta-created-at': manifest.createdAt,
  });
}

/** 列出 COS 中的备份对象。 */
export async function listBackupObjects(config: CosConfig, prefix: string): Promise<Array<{ key: string; size: number; lastModified: Date | undefined }>> {
  const prefixPart = prefix ? prefix.replace(/^\/+|\/+$/g, '') + '/' : '';
  const client = createCosClient(config);
  const contents: COS.CosObject[] = [];
  let marker: string | undefined;

  do {
    const response = await client.getBucket({
      Bucket: config.bucket,
      Region: config.region,
      Prefix: prefixPart,
      Marker: marker,
      MaxKeys: 1000,
    });
    contents.push(...(response.Contents || []));
    marker = response.IsTruncated === 'true' ? response.NextMarker : undefined;
  } while (marker);

  return contents
    .filter((object) => object.Key.endsWith('.cdbak'))
    .map((obj) => ({
      key: obj.Key,
      size: Number(obj.Size) || 0,
      lastModified: obj.LastModified ? new Date(obj.LastModified) : undefined,
    }));
}

/** 从 COS 下载备份对象。 */
export async function downloadBackupObject(config: CosConfig, objectKey: string): Promise<Buffer> {
  const response = await createCosClient(config).getObject({
    Bucket: config.bucket,
    Region: config.region,
    Key: objectKey,
  });
  return response.Body;
}

/** 批量删除 COS 中的过期备份。 */
export async function deleteOldBackups(config: CosConfig, keysToDelete: string[]): Promise<void> {
  if (keysToDelete.length === 0) return;
  await createCosClient(config).deleteMultipleObject({
    Bucket: config.bucket,
    Region: config.region,
    Objects: keysToDelete.map((key) => ({ Key: key })),
    Quiet: true,
  });
}
