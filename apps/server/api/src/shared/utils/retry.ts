import logger from "./logger";

export class RetryUtils {
    private maxRetry = 3;
    private retryWait = 1000;
    /**
     * Executes a function with retry logic
     * @param fn - The function to execute
     * @param name - The name of the function
     * @param options - The options for the retry
     * @returns The result of the function
     */
    public async execute<ResponseType>(
        fn: () => Promise<ResponseType>,
        name: string,
        options: {
            maxRetry?: number;
            retryWait?: number;
            condition?: (result: ResponseType) => boolean;
            failAction?: () => void;
            fallbackAction?: () => void;
        }
    ): Promise<ResponseType | null> {
        const maxRetry = options.maxRetry || this.maxRetry;
        const retryWait = options.retryWait || this.retryWait;
        
        return this.retryWrapper(fn, name, {
            retryIndex: 0,
            maxRetry: maxRetry,
            retryWait: retryWait,
            condition: options.condition,
            failAction: options.failAction,
            fallbackAction: options.fallbackAction
        });
    }

    /**
     * Internal retry wrapper implementation
     * @param fn - The function to execute
     * @param name - The name of the function
     * @param retryOpt - The options for the retry
     * @returns The result of the function
     */
    public async retryWrapper<ResponseType>(
        fn: () => Promise<ResponseType>,
        name: string,
        retryOpt: {
            retryIndex: number;
            maxRetry: number;
            retryWait: number;
            condition?: (result: ResponseType) => boolean;
            failAction?: () => void;
            fallbackAction?: () => void;
        }
    ): Promise<ResponseType | null> {
        const { retryIndex, maxRetry, retryWait, condition, fallbackAction, failAction } = retryOpt;
        try {
            const result = await fn();
            if (condition && !condition(result)) {
                throw new Error('Condition not met');
            }
            return result;
        } catch (error) {
            if (retryIndex < maxRetry) {
                if (failAction) {
                    failAction();
                }
                logger.alert(`[${name}] Attempt ${retryIndex + 1} failed. Retrying in ${(retryWait / 1000)} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, retryWait));
                return this.retryWrapper(fn, name, { ...retryOpt, retryIndex: retryIndex + 1 });
            }
            logger.alert(`[${name}] Failed after ${maxRetry} attempts:`, { error: error.message });
            if (fallbackAction) {
                fallbackAction();
            }
            return null;
        }
    }
}

export default new RetryUtils();