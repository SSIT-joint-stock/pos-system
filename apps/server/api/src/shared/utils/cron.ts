export type TimeInterval = string;

export class CronUtils {

    /**
     * Converts a time interval string into a cron expression
     * @param interval The time interval to convert
     * @returns The corresponding cron expression
     * @throws Error if the interval format is invalid
     */
    public convert(interval: TimeInterval): string {
        const intervalRegex = /^(\d+)(s|m|h|d|w|M)$/;
        if (!intervalRegex.test(interval)) {
            throw new Error(`Invalid interval: ${interval}`);
        }
        const value = parseInt(interval, 10);
        const unit = interval.slice(-1);

        switch (unit) {
            case 's':
                return `*/${value} * * * * *`; // Every value seconds
            case 'm':
                return `${0} */${value} * * * *`; // At minute 0 past every value minutes
            case 'h':
                return `${0} 0 */${value} * * *`; // At minute 0 past every value hours
            case 'd':
                return `0 0 */${value} * *`;   // At 00:00 on every value days
            case 'w':
                return `0 0 * * ${value} *`;    // At 00:00 on value day-of-week (0 - 7) (Sunday=0 or 7)
            case 'M':
                return `0 0 1 */${value} * *`;   // At 00:00 on day-of-month 1 in every value month(s)
            default:
                throw new Error(`Invalid interval: ${interval}`);
        }
    }
}

export default new CronUtils();