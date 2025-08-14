// Extend Jest matchers
expect.extend({
    toBeValidToken(received: string) {
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        const pass = base64Regex.test(received);
        return {
            message: () => `expected ${received} to be a valid base64 token`,
            pass
        };
    }
});

// Mock logger
jest.mock('@repo/logger', () => ({
    createLogger: jest.fn().mockReturnValue({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
    }),
    LoggerInstance: jest.fn()
}));

// Global test timeout
jest.setTimeout(10000); 