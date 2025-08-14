import type { Express, Request } from 'express';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test';
			HOST: string;
			DATABASE_URL: string;
			PORT?: string;
			SESSION_SECRET: string;
		}
	}
	namespace Express {
		export interface Request {
			file?: Express.Multer.File;
			image?: Express.Multer.File;
			deviceId?: string;
			user?: {
				id: string;
			};
		}
	}
}
export {};