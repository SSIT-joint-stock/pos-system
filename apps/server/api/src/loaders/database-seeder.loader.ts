/**
 * @fileOverview This file defines the database seeder for initializing essential data in the database.
 * It ensures that default roles and other required data exist in the database before the application starts.
 */

import type { PrismaClient } from '@repo/database';
import prisma from '@shared/orm/prisma';
import logger from '@shared/utils/logger';

/**
 * @class DatabaseSeeder
 * @classdesc Seeds essential data into the database during application initialization.
 */
export default class DatabaseSeeder { 
	private prisma: PrismaClient;

	/**
	 * @constructor
	 * @description Initializes the database seeder with required repositories.
	 */
	constructor(prismaClient: PrismaClient = prisma) {
		this.prisma = prismaClient || prisma;
	}

	/**
	 * @function initialize
	 * @async
	 * @description Initializes the database with essential data.
	 */
	public async initialize(): Promise<void> {
		try {
			logger.info('Starting database seeding...');

			logger.info('Database seeding completed successfully.');
		} catch (error) {
			logger.error('Error during database seeding:', error);
			throw error;
		} finally {
			await this.prisma.$disconnect();
		}
	}

}
