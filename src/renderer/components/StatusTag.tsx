import { Tag } from 'antd';

export function StatusTag({
  valid,
  validText = '有效',
  invalidText = '已作废',
}: {
  valid: boolean;
  validText?: string;
  invalidText?: string;
}) {
  return (
    <Tag color={valid ? 'success' : 'error'}>
      {valid ? validText : invalidText}
    </Tag>
  );
}
