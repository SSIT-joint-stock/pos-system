import { createLogger, LoggerConfigOptions } from "@repo/logger";
import { env } from "@repo/config-env";

const loggerConfig: LoggerConfigOptions = {
    serviceName: 'secure-endpoints',
    enableConsole: true,
    enableLoki: false,
    logLevel: 'error',
    env: env.NODE_ENV || 'development',
    enableFile: false,
    filePath: '',
    defaultMeta: {},
}

export const logger = createLogger(loggerConfig);