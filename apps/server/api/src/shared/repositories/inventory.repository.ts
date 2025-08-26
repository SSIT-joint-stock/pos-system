import prisma, { DbClient, Inventory } from "@shared/orm/prisma";

export type InventoryEnity = Inventory

export class InventoryRepository {
    constructor(private db: DbClient) { }

    async upsertZero
        (productId: string, tenantId: string)
        : Promise<InventoryEnity> {
        return await prisma.inventory.upsert({
            where: { productId },
            create: { tenantId, productId, quantity: 0, reservedQuantity: 0 },
            update: {},
        });
    }


    async get
        (productId: string, tenantId: string)
        : Promise<InventoryEnity | null> {
        return await prisma.inventory.findFirst({ where: { tenantId, productId } });
    }


    async setQuantities
        (productId: string, quantities: { quantity?: number; reservedQuantity?: number })
        : Promise<InventoryEnity> {
        return await prisma.inventory.update({ where: { productId }, data: { ...quantities, lastStockUpdate: new Date() } });
    }

    async delete
        (productId: string)
        : Promise<void> {
        await prisma.inventory.delete({ where: { productId } });
    }
}