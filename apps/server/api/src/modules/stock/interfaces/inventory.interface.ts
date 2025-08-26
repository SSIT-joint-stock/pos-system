import { InventoryEnity } from "@/shared/repositories/inventory.repository";

export interface InventoryResult {
    inventory: Pick<InventoryEnity, (typeof PickInventoryFields)[number]>
}

export const PickInventoryFields = [
    "id",
    "tenantId",
    "productId",
    "quantity",
    "reservedQuantity",
    "reorderLevel",
    "reorderQuantity",
    "lastStockUpdate",
    "updatedAt",
    "createdAt",
] as const;
