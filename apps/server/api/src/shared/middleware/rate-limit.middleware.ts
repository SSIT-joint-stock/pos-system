import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'services/cache/redis.service';
import { createContextLogger } from 'shared/utils/logger';
import appConfig from 'config/app.config';
import TooManyRequests from 'responses/client-errors/too-many-requests';
import { delay } from 'shared/utils/delay';
import { randomInteger } from 'shared/utils/chance';


const logger = createContextLogger('RateLimitMiddleware');

interface RateLimitOptions {
    customResponse?: (req: Request, res: Response, next: NextFunction) => void;
    // Number of requests allowed within the window
    max: number;
    // Time window in seconds
    windowSizeInSeconds: number;
    // Optional key prefix for Redis
    keyPrefix?: string;
    // Optional message when limit is exceeded
    message?: string;
    // Optional function to get custom identifier (default is IP)
    identifierFn?: (req: Request) => string;
}

const defaultOptions: Required<Pick<RateLimitOptions, 'keyPrefix' | 'message' | 'identifierFn'>> = {
    keyPrefix: 'rate-limit:',
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
    identifierFn: (req: Request): string => req.ip || 'unknown' // get ip address
};

export class RateLimitMiddleware {
    private redisService: RedisService;
    private options: Required<RateLimitOptions>;

    constructor(options: RateLimitOptions) {
        this.options = { ...defaultOptions, ...options } as Required<RateLimitOptions>;
        this.redisService = new RedisService({
            host: appConfig.redisHost,
            port: appConfig.redisPort,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        }, this.options.keyPrefix);
    }

    private getKey(identifier: string): string {
        return `${identifier}`;
    }

    public middleware = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const identifier = this.options.identifierFn(req);
            const key = this.getKey(identifier);

            // Get current count
            const currentCount = await this.redisService.get<number>(key) || 0;

            if (currentCount >= this.options.max) {
                // Get TTL of the key
                const ttl = await this.redisService.getTtl(key);
                
                logger.warn('Rate limit exceeded', {
                    identifier,
                    currentCount,
                    max: this.options.max,
                    remainingTime: ttl
                });

                await delay(randomInteger(1000, 3000)); // Simulate some processing time
                if (this.options.customResponse) {
                    this.options.customResponse(req, res, next);
                } else {
                    throw new TooManyRequests(
                        'RATE_LIMIT_EXCEEDED',
                        this.options.message,
                        'Quá nhiều yêu cầu, vui lòng thử lại sau.',
                    );
                }
            }

            // Increment counter
            if (currentCount === 0) {
                // First request in window, set with expiry
                await this.redisService.set(key, 1, this.options.windowSizeInSeconds);
            } else {
                // Increment existing counter
                await this.redisService.increment(key);
            }

            // Add rate limit info to response headers
            res.setHeader('X-RateLimit-Limit', this.options.max);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, this.options.max - (currentCount + 1)));
            res.setHeader('X-RateLimit-Reset', await this.redisService.getTtl(key));

            next();
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create middleware with specific options for a route
     */
    public static create(options: RateLimitOptions) {
        const middleware = new RateLimitMiddleware(options);
        return middleware.middleware;
    }

    /**
     * Create default rate limit for API endpoints
     */
    public static createDefault() {
        return RateLimitMiddleware.create({
            max: 100,              // 100 requests
            windowSizeInSeconds: 60, // per minute
            keyPrefix: 'api-rate-limit:'
        });
    }

    /**
     * Create strict rate limit for auth endpoints
     */
    public static createAuthLimit() {
        return RateLimitMiddleware.create({
            max: 20,                // 20 attempts
            windowSizeInSeconds: 300, // per 5 minutes
            keyPrefix: 'auth-rate-limit:',
            message: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 5 phút.'
        }); // - 20 attempts per 5 minutes  
    }
}

export const rateLimitAuthMiddleware = RateLimitMiddleware.createAuthLimit();
export const rateLimitDefaultMiddleware = RateLimitMiddleware.createDefault();
export const rateLimitRegisterMiddleware = RateLimitMiddleware.create({
    max: 10,
    windowSizeInSeconds: 60,
    keyPrefix: 'register-rate-limit:',
    message: 'Quá nhiều lần đăng ký, vui lòng thử lại sau 1 phút.'
}); // - 10 attempts per 1 minute

export const rateLimitEmailVerificationMiddleware = RateLimitMiddleware.create({
    max: 10,
    windowSizeInSeconds: 3600,
    keyPrefix: 'email-verification-rate-limit:',
    message: 'Quá nhiều lần gửi email xác thực, vui lòng thử lại sau 1 giờ.',
    customResponse: (req, res, next) => {
        res.status(429).send('Quá nhiều lần gửi email xác thực, vui lòng thử lại sau 1 giờ.');
    }
}); // - 10 attempts per hour

export const rateLimitFeedbackMiddleware = RateLimitMiddleware.create({
    max: 100,
    windowSizeInSeconds: 3600,
    keyPrefix: 'feedback-rate-limit:',
    message: 'Quá nhiều lần gửi phản hồi, vui lòng thử lại sau 1 giờ.'
}); // - 100 attempts per hour

export const rateLimitOpenEnrollmentMiddleware = RateLimitMiddleware.create({
    max: 10,
    windowSizeInSeconds: 86400, // 1 day
    keyPrefix: 'open-enrollment-rate-limit:',
    message: 'Quá nhiều lần mở khóa hồ sơ tuyển sinh, vui lòng thử lại sau 1 ngày.'
}); // - 10 attempts per day

