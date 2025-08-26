import { PickStockMovementFields } from "./stockMovement.interface"
import { InventoryResult, PickInventoryFields } from "./inventory.interface";
import { StockMovementEnity } from "@/shared/repositories/stockMovement.repository";
import { InventoryEnity } from "@/shared/repositories/inventory.repository";

export interface AdjustStockDTO {
    tenantId: string,
    productId: string,
    quantity: number,
    unitId: string,
    performedBy: string,

    reason?: string,
    notes?: string,
    referenceId?: string,
}

export interface ReserveStockDTO {
    tenantId: string,
    productId: string,
    quantity: number,
    unitId: string,
    performedBy: string,

    reason?: string,
    notes?: string,
    referenceId?: string,
}

export interface ReleaseStockDTO {
    tenantId: string,
    productId: string,
    quantity: number,
    unitId: string,
    performedBy: string,

    reason?: string,
    notes?: string,
    referenceId?: string,
}

export interface CommitSaleStockDTO {
    tenantId: string,
    productId: string,
    quantity: number,
    unitId: string,
    performedBy: string,

    reason?: string,
    notes?: string,
    referenceId?: string,
}

export interface PurchaseStockDTO {
    tenantId: string,
    productId: string,
    quantity: number,
    unitId: string,
    performedBy: string,

    reason?: string,
    notes?: string,
    referenceId?: string,
}

export type StockResult = {
    inventory: Pick<InventoryEnity, (typeof PickInventoryFields)[number]>;
    stockMovement: Pick<StockMovementEnity, (typeof PickStockMovementFields)[number]>;
};


export interface IStockService {
    adjustStock(data: AdjustStockDTO): Promise<StockResult>
    reserve(data: ReserveStockDTO): Promise<InventoryResult>
    release(data: ReleaseStockDTO): Promise<InventoryResult>
    commitSale(data: AdjustStockDTO): Promise<StockResult>
    purchase(data: PurchaseStockDTO): Promise<StockResult>
}