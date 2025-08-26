import prisma, { DbClient, StockMovement, StockMovementType } from "@shared/orm/prisma";

export type StockMovementEnity = StockMovement

export class StockMovementRepository {
    constructor(private db: DbClient) { }

    async create(
        stockMovement:
            Omit<StockMovementEnity,
                | "id"
                | "createdAt"
            >
    ): Promise<StockMovementEnity> {
        return await this.db.stockMovement.create({
            data: {
                ...stockMovement,
                type: StockMovementType.ADJUSTMENT
            }
        });
    }

    async listByProduct(tenantId: string,
        productId: string,
        take = 50,
        skip = 0
    ): Promise<StockMovementEnity[]> {
        return await this.db.stockMovement.findMany({
            where: { tenantId, productId },
            orderBy: { createdAt: "desc" },
            take,
            skip,
        });
    }
}