import { PrismaClient } from "@repo/database";

export * from '@repo/database';

const prismaClientSingleton = (): PrismaClient => {
	return new PrismaClient({
		...(process.env.NODE_ENV === "development" && {
			log: ['query', 'info', 'warn', 'error'],
		})
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
	interface BigInt {
		toJSON(): string;
	}
}

BigInt.prototype.toJSON = function (): string {
	return this.toString();
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

prisma.$use(async (params, next) => {
	const before = Date.now();

	const result = await next(params) as unknown;

	const after = Date.now();

	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

	return result;
})


export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;