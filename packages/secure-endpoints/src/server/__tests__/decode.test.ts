import { DecodeUaService } from '../decode';
import { UaGenerate } from '../../client/generator';

describe('DecodeUaService', () => {
    let decodeService: DecodeUaService;
    let generator: UaGenerate;

    beforeEach(() => {
        decodeService = new DecodeUaService();
        generator = new UaGenerate(null);
    });

    describe('decodeToken', () => {
        it('should decode a valid token', () => {
            // Tạo token thật từ generator
            const date = new Date();
            const token = generator.genToken('V1/TEST/ENDPOINT', date, 11, 22);
            
            const decoded = decodeService.decodeToken(token);
            expect(decoded).toContain('11'); // random1
            expect(decoded).toContain('22'); // random2
            expect(decoded).toContain('V1/TEST/ENDPOINT');
        });

        it('should throw error for invalid base64 token', () => {
            const invalidToken = 'not-base64!@#';
            expect(() => decodeService.decodeToken(invalidToken)).toThrow();
        });
    });

    describe('parseDecodedToken', () => {
        it('should parse a valid decoded token', () => {
            const date = new Date();
            const token = generator.genToken('V1/TEST/ENDPOINT', date, 11, 22);
            const decoded = decodeService.decodeToken(token);
            const result = decodeService.parseDecodedToken(decoded);

            expect(result).toMatchObject({
                random1: '11',
                random2: '22',
                endpoint: 'V1/TEST/ENDPOINT'
            });
            expect(result.date).toBeInstanceOf(Date);
            expect(result.date.getTime()).toBe(date.getTime());
        });

        it('should throw error for invalid token format', () => {
            const invalidDecoded = 'invalid-format';
            expect(() => decodeService.parseDecodedToken(invalidDecoded))
                .toThrow('Invalid token: cannot extract timestamp');
        });
    });

    describe('validateToken', () => {
        it('should validate a correct token', () => {
            const now = new Date();
            const endpoint = 'V1/TEST/ENDPOINT';
            const random1 = '11';
            const random2 = '22';
            
            const token = generator.genToken(endpoint, now, 
                parseInt(random1), parseInt(random2));

            const validateData = {
                token,
                date: now,
                random1,
                random2,
                endpoint
            };

            expect(() => decodeService.validateToken(validateData)).not.toThrow();
        });

        it('should throw error for future date', () => {
            const futureDate = new Date(Date.now() + 1000000);
            const endpoint = 'V1/TEST/ENDPOINT';
            const random1 = '11';
            const random2 = '22';
            
            const token = generator.genToken(endpoint, futureDate, 
                parseInt(random1), parseInt(random2));

            const validateData = {
                token,
                date: futureDate,
                random1,
                random2,
                endpoint
            };

            expect(() => decodeService.validateToken(validateData))
                .toThrow('INVALID_TOKEN');
        });

        it('should throw error for mismatched random strings', () => {
            const now = new Date();
            const endpoint = 'V1/TEST/ENDPOINT';
            const token = generator.genToken(endpoint, now, 11, 22);

            const validateData = {
                token,
                date: now,
                random1: '99', // Mismatched
                random2: '22',
                endpoint
            };

            expect(() => decodeService.validateToken(validateData))
                .toThrow('INVALID_TOKEN');
        });
    });

    describe('transpileEndpoint', () => {
        it('should convert API path to endpoint format', () => {
            const apiPath = '/api/v1/test/endpoint';
            const result = decodeService.transpileEndpoint(apiPath);
            expect(result).toBe('V1/TEST/ENDPOINT');
        });

        it('should handle paths without /api/ prefix', () => {
            const path = 'v1/test/endpoint';
            const result = decodeService.transpileEndpoint(path);
            expect(result).toBe('V1/TEST/ENDPOINT');
        });
    });
}); 