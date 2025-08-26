import { StockMovementEnity } from "@/shared/repositories/stockMovement.repository";

export interface StockMovementResult {
    stockMovement: Pick<StockMovementEnity, (typeof PickStockMovementFields)[number]>
}

export const PickStockMovementFields = [
    "id",
    "tenantId",
    "productId",
    "type",
    "quantity",
    "unitId",
    "reason",
    "notes",
    "referenceId",
    "performedBy",
    "createdAt",
] as const;
