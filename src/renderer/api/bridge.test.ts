import { describe, expect, it } from 'vitest';
import { isProxy, reactive } from 'vue';
import { normalizeIpcArguments, wrapIpcApi } from './bridge';

describe('IPC bridge', () => {
  it('在调用 API 前移除 Vue reactive Proxy', () => {
    let received: unknown;
    const rawApi = Object.freeze({
      customers: Object.freeze({
        list(input: unknown) {
          received = input;
          return input;
        },
      }),
    });
    const api = wrapIpcApi(rawApi);
    const query = reactive({ keyword: '', paging: { page: 1, pageSize: 50 } });

    const result = api.customers.list(query);

    expect(result).toEqual({ keyword: '', paging: { page: 1, pageSize: 50 } });
    expect(isProxy(received)).toBe(false);
    expect(isProxy((received as { paging: object }).paging)).toBe(false);
  });

  it('保留无参数调用和多个基础类型参数', () => {
    expect(normalizeIpcArguments([])).toEqual([]);
    expect(normalizeIpcArguments(['id', 1, true])).toEqual(['id', 1, true]);
  });
});
