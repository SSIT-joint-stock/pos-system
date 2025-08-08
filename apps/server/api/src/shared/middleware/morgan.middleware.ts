import morgan, { TokenIndexer } from 'morgan';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { createContextLogger } from '@shared/utils/logger';

// Custom types for morgan's extended Request and Response
interface Request extends ExpressRequest {
    _startAt?: [number, number];
}

interface Response extends ExpressResponse {
    _startAt?: [number, number];
}

// Create a dedicated HTTP logger instance
const httpLogger = createContextLogger('http');

// Custom token for response time in milliseconds
morgan.token('response-time', (req: Request, res: Response) => {
    if (!res._startAt || !req._startAt) return '';
    const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
        (res._startAt[1] - req._startAt[1]) * 1e-6;
    return ms.toFixed(3);
});

// Skip function for filtering unnecessary requests
const skip = (req: Request, res: Response): boolean => {
    // Skip health check endpoints
    if (req.url.includes('/health')) return true;
    
    // Skip OPTIONS requests
    if (req.method === 'OPTIONS') return true;
    
    // Skip successful static file requests
    if (req.url.startsWith('/static') && res.statusCode === 200) return true;
    
    return false;
};

export const morganMiddleware = morgan((tokens: TokenIndexer, req: Request, res: Response) => {
    // Skip processing if the request matches skip conditions
    if (skip(req, res)) return null;

    // Build structured log data
    const logData = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: parseInt(tokens.status(req, res) || '500'),
        responseTime: parseFloat(tokens['response-time'](req, res) || '0'),
        userAgent: tokens['user-agent'](req, res),
        remoteAddr: tokens['remote-addr'](req, res)
    };

    // Build log message
    const message = [
        logData.method,
        logData.url,
        logData.status,
        `${logData.responseTime}ms`
    ].join(' ');

    // Log with appropriate level based on status code
    if (logData.status >= 500) {
        httpLogger.error(message, { http: logData });
    } else if (logData.status >= 400) {
        httpLogger.warn(message, { http: logData });
    } else if (logData.status >= 300) {
        httpLogger.info(message, { http: logData });
    } else {
        httpLogger.info(message, { http: logData });
    }

    return null;
}, {
    // Immediate logging (before response is sent)
    immediate: false,
    // Skip based on our custom function
    skip: skip
});

// Export default middleware
export default morganMiddleware; 