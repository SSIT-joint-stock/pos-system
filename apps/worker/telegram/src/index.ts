
import { TelegramWorker } from './worker';
import { createLogger } from '@repo/logger';
import { createWorkerConfig, loggerConfig } from './config';

// Initialize logger with detailed configuration
const logger = createLogger(loggerConfig);

console.log(loggerConfig);


process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', {
        reason: reason instanceof Error ? reason.message : 'Unknown reason',
        stack: reason instanceof Error ? reason.stack : undefined
    });
    process.exit(1);
});

async function main() {
    console.log('Starting Telegram Worker...');
    logger.info('Starting Telegram Worker...');

    try {
        const workerConfig = createWorkerConfig();

        logger.info('Worker configuration loaded', {
            redisHost: workerConfig.redis.host,
            redisPort: workerConfig.redis.port,
            hasAdminChat: !!workerConfig.adminChatId
        });

        const worker = new TelegramWorker(workerConfig);

        // Handle shutdown signals
        const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
        signals.forEach(signal => {
            process.on(signal, async () => {
                logger.info(`Received ${signal}, initiating graceful shutdown...`);
                try {
                    await worker.stop();
                    logger.info('Worker stopped successfully');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown', {
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                    process.exit(1);
                }
            });
        });

        await worker.start();
        logger.info('Telegram Worker started successfully', {
            env: process.env.NODE_ENV,
            nodeVersion: process.version
        });

    } catch (error) {
        logger.error('Failed to start worker', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        process.exit(1);
    }
}

// Add error handler for the main function
main().catch(error => {
    logger.error('Unhandled error in main', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1); 
});