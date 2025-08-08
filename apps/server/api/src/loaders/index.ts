/**
 * @fileOverview This file is the main entry point for loading and initializing the application's core components.
 * It sets up the Express server, Redis server, Socket.IO server, MongoDB connection, and registers process event listeners for graceful shutdown.
 */

// loaders
import ExpressServer from '@loaders/express.loader';
import SocketServer from '@loaders/websocket.loader';
import DatabaseSeeder from '@loaders/database-seeder.loader';

// shared
import logger from '@shared/utils/logger';

/**
 * @function
 * @async
 * @description Initializes and starts the core components of the application.
 * This includes:
 *  - Starting the Express server.
 *  - Initializing and connecting to the Redis server.
 *  - Starting the Socket.IO server and integrating it with Express and Redis.
 *  - Creating indexes for ProductSearch and RegionSearch services.
 *  - Registering event listeners for process exit signals to ensure graceful shutdown.
 */
export default async () => {
    // Initialize database with essential data
    try {
        const databaseSeeder = new DatabaseSeeder();
        await databaseSeeder.initialize();
        logger.info('Database seeding completed successfully');
    } catch (error) {
        logger.error('Error during database seeding:', error);
    }

    // start express
    const expressServer = new ExpressServer();
    const expressInstance = expressServer.server;

    // start socket 
    const socketServer = new SocketServer(expressInstance);
    const socketInstance = socketServer.instance;
    expressServer.initSocket(socketInstance);

    // const cronjob = new CronJob(socketServer, redisServer);
    // cronjob.initialize();

    // await ProductSearch.createIndex();
    // await RegionSearch.createIndexing();

    /**
     * @description Registers event listeners for 'exit' and 'SIGINT' signals to handle graceful shutdown.
     * On receiving either of these signals, the application will close the Express server,
     * Socket.IO server, connection before exiting.
     */
    process.on('exit', () => {
        expressServer.close();
        socketServer.close();
    }).on('SIGINT', () => {
        expressServer.close();
        socketServer.close();
    });
}