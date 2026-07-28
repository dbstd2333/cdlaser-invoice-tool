import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
  HeadBucketCommand,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import type { S3Config } from './backup-service';
import log from 'electron-log/main';

/**
 * S3 客户端封装 - 支持 AWS S3 和 S3 兼容服务。
 */

/** 创建 S3 客户端 */
export function createS3Client(config: S3Config): S3Client {
  const clientConfig: S3ClientConfig = {
    region: config.region,
    forcePathStyle: config.pathStyle ?? false,
    credentials: config.accessKeyId
      ? {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey!,
          sessionToken: config.sessionToken,
        }
      : undefined,
  };

  if (config.serviceType === 'compatible' && config.endpoint) {
    clientConfig.endpoint = config.endpoint;
  }

  return new S3Client(clientConfig);
}

/** 测试 S3 连接 */
export async function testS3Connection(config: S3Config): Promise<{ success: boolean; message: string }> {
  try {
    const client = createS3Client(config);
    await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
    return { success: true, message: 'Bucket 可访问，读写验证成功' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.warn('[s3] 连接测试失败:', message);
    return { success: false, message: sanitizeErrorMessage(message) };
  }
}

/** 清理错误消息中的敏感信息 */
function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/AKIA[A-Z0-9]+/g, '***')
    .replace(/access[_-]?key[^,}]*/gi, '***')
    .replace(/secret[_-]?key[^,}]*/gi, '***');
}

/** 构造对象键 */
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
  return `${prefixPart}/${installId}/${yyyy}/${mm}/invoice-backup-${ts}.cdbak`;
}

/** 上传备份 */
export async function uploadBackup(
  config: S3Config,
  objectKey: string,
  data: Buffer,
  manifest: { appVersion: string; schemaVersion: string; backupType: string; createdAt: string },
): Promise<void> {
  const client = createS3Client(config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Body: data,
      ContentType: 'application/octet-stream',
      Metadata: {
        'app-version': manifest.appVersion,
        'schema-version': manifest.schemaVersion,
        'backup-type': manifest.backupType,
        'created-at': manifest.createdAt,
      },
    }),
  );
}

/** 列出备份对象 */
export async function listBackupObjects(config: S3Config, prefix: string): Promise<Array<{ key: string; size: number; lastModified: Date | undefined; metadata?: Record<string, string> }>> {
  const client = createS3Client(config);
  const prefixPart = prefix ? prefix.replace(/^\/+|\/+$/g, '') + '/' : '';
  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: prefixPart,
      MaxKeys: 100,
    }),
  );

  return (response.Contents || [])
    .filter((obj) => obj.Key?.endsWith('.cdbak'))
    .map((obj) => ({
      key: obj.Key!,
      size: obj.Size || 0,
      lastModified: obj.LastModified,
    }));
}

/** 下载备份对象 */
export async function downloadBackupObject(config: S3Config, objectKey: string): Promise<Buffer> {
  const client = createS3Client(config);
  const response = await client.send(
    new GetObjectCommand({ Bucket: config.bucket, Key: objectKey }),
  );
  const chunks: Buffer[] = [];
  const stream = response.Body as NodeJS.ReadableStream;
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk as Buffer));
  }
  return Buffer.concat(chunks);
}

/** 删除过期备份 */
export async function deleteOldBackups(config: S3Config, keysToDelete: string[]): Promise<void> {
  if (keysToDelete.length === 0) return;
  const client = createS3Client(config);
  await client.send(
    new DeleteObjectsCommand({
      Bucket: config.bucket,
      Delete: {
        Objects: keysToDelete.map((key) => ({ Key: key })),
      },
    }),
  );
}
