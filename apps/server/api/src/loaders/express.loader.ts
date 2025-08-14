/**
 * @fileOverview This file defines the Express server setup for the application.
 * It configures the Express app with middleware, routes, and error handling.
 */

import express from 'express';
import { ServeStaticOptions } from 'serve-static';
import bodyParser from "body-parser";
import helmet from 'helmet';
import hpp from 'hpp';
import cors, { CorsOptions } from 'cors';
import cookieParser from "cookie-parser";
import * as SocketIo from 'socket.io';
import { Server, createServer } from 'http';
import { engine } from 'express-handlebars';
import path from 'path/posix';

// shared config
import config from "@shared/config/app.config";
import logger from "@shared/utils/logger";

// shared middleware
import errorHandler from "@shared/middleware/error-handle.middleware";
import routeNotFound from '@shared/middleware/route-not-found.middleware';
import morganMiddleware from "@shared/middleware/morgan.middleware";

// shared helpers
import { helpers } from '@shared/helpers/views';

// modules routes
import { openapiRoutes } from '@modules/swagger';
import { healthRoutes } from '@modules/health';
import { authRoutes } from '@modules/auth';


/**
 * @class ExpressServer
 * @classdesc Configures and starts the Express server, including middleware, routes, and error handling.
 */
class ExpressServer {
    /**
     * @static
     * @readonly
     * @type {number}
     * @description The default port number for the Express server.
     */
    public static readonly PORT: number = 8080;

    private _app!: express.Express;
    private _server!: Server;
    private _port!: number;

    private origin: string[] = ['http://localhost:3000', 'http://localhost:8080', 'https://tuyensinh.ssit.company', 'https://leloi.ssit.company'];
    private methods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'];
    private allowedHeaders: string[] = [
        'Content-Type',
        'Authorization',
        'Referer',
        'Accept',
        'X-Requested-With',
        'X-CSRF-Token',
        'X-HTTP-Method-Override',
        'X-API-Key',
        'X-API-Secret',
        'X-API-Token',
        'X-Tenant-Id',
        'Path',
        'P',
        'RN',
        'Timestamp',
        'UA',
        'User-Agent',
        'Accept-Language',
        'Accept-Encoding',
        'Connection',
        'Cache-Control',
        'Pragma',
        'Expires',
    ];
    private credentials: boolean = true;
    private staticOptions: ServeStaticOptions = {
        dotfiles: 'ignore',
        index: false,
        fallthrough: false,
        setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        }
    };

    /**
     * @constructor
     * @description Initializes the Express server and starts listening for incoming requests.
     */
    public constructor() {
        this.listen();
    }

    /**
     * @private
     * @function listen
     * @description Configures the Express app with middleware, routes, and error handling, then starts the server.
     */
    private listen(): void {

        // initialize express instances 
        this._app = express();
        this._app.set('trust proxy', 1)
        this._app.use(helmet({
            hidePoweredBy: true,
            noSniff: true,
            referrerPolicy: { policy: 'no-referrer-when-downgrade' },
        }));

        // Enable Cross-Origin Resource Sharing (CORS)
        const corsOptions: CorsOptions = {
            origin: this.origin,
            methods: this.methods,
            allowedHeaders: this.allowedHeaders,
            credentials: this.credentials,
        };
        this._app.use(cors(corsOptions));
        this._app.options('*', cors(corsOptions));
        // Parse Cookie headers
        this._app.use(cookieParser());

        // Apply Morgan middleware for logging HTTP requests
        this._app.use(morganMiddleware);
        this._app.engine('hbs', engine({
            defaultLayout: 'main',
            layoutsDir: path.join(process.cwd(), 'src/views/layouts'),
            partialsDir: path.join(process.cwd(), 'src/views/partials'),
            helpers: helpers
        }));
        this._app.set('view engine', 'hbs');
        this._app.set('views', path.join(process.cwd(), 'src/views'));

        // static for ssr
        this._app.use('/statics/script', cors(corsOptions), express.static(path.join(process.cwd(), 'src/views/scripts'), this.staticOptions));
        this._app.use('/statics/style', cors(corsOptions), express.static(path.join(process.cwd(), 'src/views/styles'), this.staticOptions));
        // Serve static files from the 'statics' directory
        this._app.use('/statics', cors(corsOptions), express.static('statics', this.staticOptions));
        // Serve static files from the 'storage' directory
        this._app.use('/storage', cors(corsOptions), express.static('storage', {
            ...this.staticOptions,
            dotfiles: 'ignore',
            fallthrough: false, // Ngăn truy cập file không tồn tại
            extensions: ['jpg', 'png', 'pdf', 'docx'],
        }));

        // Parse incoming request bodies in different formats
        this._app.use(bodyParser.text());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(hpp());
        this._app.use(bodyParser.json({
            strict: true,
            limit: '1mb' // limit body size to 1mb
        }));

        // Mount API and page routes
        this._app.use('/api/v1/auth', authRoutes);
        // this._app.use('/', route.pageRoutes);
        this._app.use('/health', healthRoutes);
        // Handle undefined routes (404)
        this._app.use('*', routeNotFound);

        // Setup Swagger documentation
        this._app.use('/docs', openapiRoutes);

        // Apply global error handling middleware
        this._app.use(errorHandler);

        // start nodejs server
        this._port = config.SERVER_PORT || ExpressServer.PORT;
        this._server = createServer(this._app);
        this._server.listen(this._port, () => {
            logger.info(`Running Express Server on port ${this._port}`);
        })
    }

    /**
     * @function close
     * @description Closes the Express server.
     */
    public close(): void {
        this._server.close((err) => {
            if (err) throw Error();

            logger.info('[ExpressServer]: Stopped');
        });
    }

    /**
     * @function initSocket
     * @description Initializes the Socket.IO server and attaches it to the Express app.
     * @param {SocketIo.Server} socket - The Socket.IO server instance.
     */
    public initSocket(socket: SocketIo.Server): void {
        this._app.set('socket', socket);
    }

    /**
     * @getter server
     * @returns {Server} The underlying HTTP server instance.
     */
    get server(): Server { return this._server; }
}

export default ExpressServer;