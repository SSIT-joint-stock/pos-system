import { BadRequestError, NotFoundError } from "@repo/types/response";
import { PickStockMovementFields } from "../interfaces/stockMovement.interface";
import prisma, { Prisma, StockMovementType } from "@shared/orm/prisma";
import { ProductRepository } from "@/shared/repositories/product.repository";
import { InventoryRepository } from "@/shared/repositories/inventory.repository";
import { StockMovementRepository } from "@/shared/repositories/stockMovement.repository";
import _ from "lodash";
import { AdjustStockDTO, CommitSaleStockDTO, IStockService, PurchaseStockDTO, ReleaseStockDTO, ReserveStockDTO, StockResult } from "../interfaces/stock.interface";
import { InventoryResult, PickInventoryFields } from "../interfaces/inventory.interface";

export class StockService implements IStockService {
    private products = new ProductRepository(prisma)

    async adjustStock(data: AdjustStockDTO): Promise<StockResult> {
        return prisma.$transaction(async (tx) => {
            const productRepo = new ProductRepository(tx);
            const inventoryRepo = new InventoryRepository(tx);
            const stockMovementRepo = new StockMovementRepository(tx)
            const inv = await inventoryRepo.get(data.productId, data.tenantId);
            if (!inv) throw new NotFoundError("Inventory chưa tồn tại cho sản phẩm này");

            const newQty = inv.quantity + data.quantity;
            if (newQty < 0) throw new BadRequestError("Số lượng tồn không đủ");

            const updatedInventory = await inventoryRepo.setQuantities(data.tenantId, { quantity: newQty, reservedQuantity: 0 });

            const newStockMovement = await stockMovementRepo.create({
                ...data,
                type: StockMovementType.ADJUSTMENT,
                reason: data.reason ?? null,
                notes: data.notes ?? null,
                referenceId: data.referenceId ?? null
            });
            return {
                inventory: _.pick(updatedInventory, PickInventoryFields),
                stockMovement: _.pick(newStockMovement, PickStockMovementFields)
            }
        })
    }

    async reserve(data: ReserveStockDTO): Promise<InventoryResult> {
        return prisma.$transaction(async (tx) => {
            const productRepo = new ProductRepository(tx);
            const inventoryRepo = new InventoryRepository(tx);
            const stockMovementRepo = new StockMovementRepository(tx)

            const inv = await inventoryRepo.get(data.productId, data.tenantId);
            if (!inv) throw new NotFoundError("Inventory chưa tồn tại cho sản phẩm này");


            if (inv.quantity - inv.reservedQuantity < data.quantity) {
                throw new BadRequestError("Không đủ tồn kho để reserve");
            }

            const updatedInventory = await inventoryRepo.setQuantities(
                data.tenantId,
                {
                    reservedQuantity: inv.reservedQuantity + data.quantity
                }
            )
            return {
                inventory: _.pick(updatedInventory, PickInventoryFields)
            };
        });
    }

    async release(data: ReleaseStockDTO): Promise<InventoryResult> {
        return prisma.$transaction(async (tx) => {
            const productRepo = new ProductRepository(tx);
            const inventoryRepo = new InventoryRepository(tx);
            const stockMovementRepo = new StockMovementRepository(tx)

            const inv = await inventoryRepo.get(data.productId, data.tenantId);
            if (!inv) throw new NotFoundError("Inventory chưa tồn tại cho sản phẩm này");


            if (inv.reservedQuantity < data.quantity) {
                throw new BadRequestError("Reserved không đủ để release");
            }

            const updatedInventory = await inventoryRepo.setQuantities(
                data.tenantId,
                {
                    reservedQuantity: inv.reservedQuantity - data.quantity
                }
            )
            return {
                inventory: _.pick(updatedInventory, PickInventoryFields)
            };
        });
    }

    async commitSale(data: CommitSaleStockDTO): Promise<StockResult> {
        return prisma.$transaction(async (tx) => {
            const productRepo = new ProductRepository(tx);
            const inventoryRepo = new InventoryRepository(tx);
            const stockMovementRepo = new StockMovementRepository(tx)

            const inv = await inventoryRepo.get(data.productId, data.tenantId);
            if (!inv) throw new NotFoundError("Inventory chưa tồn tại cho sản phẩm này");

            if (inv.reservedQuantity < data.quantity) throw new BadRequestError("Reserved không đủ để commit");

            // reduce reserved and on-hand
            const newReserved = inv.reservedQuantity - data.quantity;
            const newQty = inv.quantity - data.quantity;
            if (newQty < 0) throw new BadRequestError("Số lượng tồn không đủ");

            const updatedInventory = await inventoryRepo.setQuantities(
                data.tenantId,
                {
                    quantity: newQty,
                    reservedQuantity: newReserved,
                }
            )

            const newStockMovement = await stockMovementRepo.create({
                ...data,
                type: StockMovementType.SALE,
                reason: data.reason ?? null,
                notes: data.notes ?? null,
                referenceId: data.referenceId ?? null
            });


            return {
                inventory: _.pick(updatedInventory, PickInventoryFields),
                stockMovement: _.pick(newStockMovement, PickStockMovementFields)
            }
        });
    }
    purchase(data: PurchaseStockDTO): Promise<StockResult> {
        // add this later
        throw new Error("Method not implemented.");
    }
}