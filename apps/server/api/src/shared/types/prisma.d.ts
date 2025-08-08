import { PrismaClient, Prisma } from '@prisma/client';

type Transaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, Prisma.DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;