export class DelayUtils {
    /**
     * This function delays the execution of the function for a given number of milliseconds
     * @param ms - The number of milliseconds to delay
     * @returns A promise that resolves after the given number of milliseconds
     */
    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * This function delays the execution of the function for a given number of milliseconds
     * @param fn - The function to execute
     * @param ms - The number of milliseconds to delay
     * @returns A promise that resolves after the given number of milliseconds
     */
    public delayFn<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
        return async (...args: Parameters<T>) => {
            await this.delay(ms);
            return fn(...args) as ReturnType<T>;
        }
    }
}

export default new DelayUtils();