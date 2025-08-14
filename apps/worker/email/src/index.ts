import { EmailWorker } from './worker';
import { createWorkerConfig, logger } from './config';

async function main() {
    const workerConfig = createWorkerConfig();
    const emailWorker = new EmailWorker(workerConfig);

    try {
        await emailWorker.start();
        logger.info('Email Worker service started successfully.');

        // Graceful shutdown handling
        const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        signals.forEach((signal) => {
            process.on(signal, async () => {
                logger.info(`Received ${signal}, shutting down Email Worker...`);
                await emailWorker.stop();
                logger.info('Email Worker shutdown complete.');
                process.exit(0);
            });
        });

    } catch (error: any) {
        logger.error('Failed to start Email Worker service', {
            error: error.message,
            stack: error.stack,
        });
        // Attempt to stop the worker even if start failed partially
        try {
            await emailWorker.stop();
        } catch (stopError: any) {
            logger.error('Failed to stop worker during error handling:', {
                error: stopError.message,
                stack: stopError.stack,
            });
        }
        process.exit(1);
    }
}

// Start the service if this script is run directly
if (require.main === module) {
    main().catch(err => {
        // Fallback logger if worker logger isn't available or failed early
        logger.error('Unhandled error in main execution:', err);
        process.exit(1);
    });
}

export { EmailWorker, createWorkerConfig }; 