import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import { ledgerQuerySchema, inventoryAdjustSchema } from '@shared/schemas/index';
import { queryLedger, consistencyCheck } from '../domains/inventory/ledger-service';
import { adjustInventory } from '../domains/inventory/adjust-service';

/**
 * 库存 IPC 处理器 - 流水查询、人工调整、一致性检查。
 */
export function registerInventoryIpc(): void {
  registerHandler(IPC_CHANNELS.inventory.ledger, ledgerQuerySchema, (input) => {
    return queryLedger({
      productId: input.productId,
      page: input.page,
      pageSize: input.pageSize,
    });
  });

  registerHandler(IPC_CHANNELS.inventory.adjust, inventoryAdjustSchema, (input) => {
    return adjustInventory(input);
  });

  registerHandler(IPC_CHANNELS.inventory.consistencyCheck, null, () => {
    return consistencyCheck();
  });
}
