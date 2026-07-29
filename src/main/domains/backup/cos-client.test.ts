import { describe, expect, it } from 'vitest';
import { cosConfigSchema } from '@shared/schemas/index';
import { buildObjectKey } from './cos-client';

describe('COS 备份对象键', () => {
  it('无前缀时不生成开头斜杠', () => {
    const key = buildObjectKey(undefined, 'install-1');

    expect(key).toMatch(/^install-1\/\d{4}\/\d{2}\/invoice-backup-\d{8}-\d{6}Z\.cdbak$/);
  });

  it('规范化用户填写的前缀', () => {
    const key = buildObjectKey('/invoice-backups/', 'install-1');

    expect(key).toMatch(/^invoice-backups\/install-1\//);
  });
});

describe('COS 配置校验', () => {
  it('接受包含 APPID 的完整 Bucket 名称', () => {
    const result = cosConfigSchema.safeParse({
      region: 'ap-guangzhou',
      bucket: 'invoice-backup-1250000000',
    });

    expect(result.success).toBe(true);
  });

  it('拒绝不含 APPID 的 Bucket 名称', () => {
    const result = cosConfigSchema.safeParse({
      region: 'ap-guangzhou',
      bucket: 'invoice-backup',
    });

    expect(result.success).toBe(false);
  });
});
