import { createLogger, LoggerConfigOptions, LoggerInstance } from "@repo/logger";

export interface ParsedToken {
    random1: string;       // Số ngẫu nhiên đầu tiên (2 ký tự)
    timestamp: string;     // Thời gian tạo token (dưới dạng chuỗi số)
    random2: string;       // Số ngẫu nhiên thứ hai (2 ký tự hoặc ký tự mã hóa)
    endpoint: string;      // API endpoint (ví dụ: V1/SECURITY/LOG-VIOLATION)
    date: Date;            // Timestamp chuyển thành Date
}

export interface ValidateToken {
    token: string;
    date: Date;
    random1: string;
    random2: string;
    endpoint: string;
}

export class DecodeUaService {
    private readonly logger: LoggerInstance;
    constructor(logger?: LoggerInstance) {
        const loggerConfig: LoggerConfigOptions = {
            serviceName: 'secure-endpoints',
            enableConsole: true,
            enableLoki: true,
        };

        
        this.logger = logger || createLogger(loggerConfig);
    }

    decodeToken(token: string): string {
        const decoded = atob(token);
        const Te = decoded.charCodeAt(0) - 32; // Lấy giá trị Te (0-31)
        const arr: number[] = [];

        for (let i = 1; i < decoded.length; i++) {
            arr.push(decoded.charCodeAt(i));
        }

        // ======= Khôi phục hàm ec() và rk() =========
        function sc(): number[] {
            return [
                58, 43, 197, 133, 4, 165, 110, 3, 44, 202, 186, 28, 118, 177, 32, 94,
                219, 6, 199, 27, 101, 191, 66, 115, 234, 120, 10, 236, 104, 108, 74,
                247, 68, 198, 62, 203, 17, 102, 185, 42,
            ]
                .slice(-36)
                .slice(0, 32);
        }

        function rk(re: number): number[] {
            const base = sc();
            const step = (re % 3) + 1;
            return Array.from(
                { length: 10 },
                (_, i) => base[(re + i * step) % base.length]
            );
        }

        function ec(input: number[], seed: number): number[] {
            const key = rk(seed).reverse();
            let extendedKey: number[] = [];
            while (extendedKey.length < input.length) {
                extendedKey = [...extendedKey, ...key];
            }
            return input.map((val, i) => val ^ extendedKey[i]);
        }

        const original = ec(arr, Te);
        return String.fromCharCode(...original);
    }

    parseDecodedToken(decoded: string): ParsedToken {
        const random1 = decoded.slice(0, 2);

        // Cắt chuỗi 13 chữ số giữa (timestamp)
        const timestampMatch = decoded.slice(2).match(/\d{13}/);
        if (!timestampMatch) throw new Error("Invalid token: cannot extract timestamp");

        const timestamp = timestampMatch[0];
        const tsEndIndex = 2 + timestamp.length;
        const random2 = decoded.slice(tsEndIndex, tsEndIndex + 2);
        const endpoint = decoded.slice(tsEndIndex + 2);
        // convert timestamp to date with timezone ASIA/HANOI
        const date = new Date(Number(timestamp));

        return { random1, timestamp, random2, endpoint, date };
    }

    transpileEndpoint(endpoint: string): string {
        // replace /api/v1/~ to V1/~
        return endpoint.replace('/api/', '').toUpperCase();
    }

    validateToken(validateToken: ValidateToken): boolean {
        const decoded = this.decodeToken(validateToken.token);
        const parsed = this.parseDecodedToken(decoded);
        const parsedDate = new Date(parsed.date.getTime());
        // convert current date to date with timezone ASIA/HANOI
        const currentDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
        console.log('parsed', parsedDate);
        console.log('new Date()', currentDate);
        console.log('parsed.date', parsedDate);
        console.log('parsed.date.getTime()', parsedDate.getTime());
        console.log('currentDate.getTime()', currentDate.getTime());

        if (parsedDate.getTime() > currentDate.getTime()) {
            console.log('parsed.date > new Date()');
            this.logger.error('INVALID_TOKEN', {
                token: validateToken.token,
            });
            throw new Error('INVALID_TOKEN');
        }

        if (parsed.random1 !== validateToken.random1
            || parsed.random2 !== validateToken.random2
            || parsedDate.getTime() !== validateToken.date.getTime()
        ) {
            console.log('parsed.random1 !== validateToken.random1', parsed.random1, validateToken.random1);
            console.log('parsed.random2 !== validateToken.random2', parsed.random2, validateToken.random2);
            console.log('parsed.date.getTime() !== validateToken.date.getTime()', parsedDate.getTime(), validateToken.date.getTime());
            this.logger.error('INVALID_TOKEN', {
                token: validateToken.token,
                date: validateToken.date.getTime(),
            });
            throw new Error('INVALID_TOKEN');
        }

        // transpile endpoint
        const transpileEndpoint = this.transpileEndpoint(parsed.endpoint);
        console.log('transpileEndpoint', transpileEndpoint);
        console.log('validateToken.endpoint', validateToken.endpoint);
        if (transpileEndpoint !== parsed.endpoint) {
            console.log('transpileEndpoint !== parsed.endpoint');
            this.logger.error('INVALID_TOKEN', {
                token: validateToken.token,
            });
            throw new Error('INVALID_TOKEN');
        }

        return true;
    }
}
