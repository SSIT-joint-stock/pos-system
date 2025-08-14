// Add type declaration for custom matcher
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidToken(): R;
        }
    }
}

import { UaGenerate } from '../generator';

describe('UaGenerate', () => {
    let generator: UaGenerate;

    beforeEach(() => {
        generator = new UaGenerate(null);
    });

    describe('isapi', () => {
        it('should convert API URL to endpoint format', () => {
            const url = 'https://example.com/api/v1/auth/login';
            const result = generator.isapi(url);
            expect(result).toBe('V1/AUTH/LOGIN');
        });

        it('should handle URLs without /api/', () => {
            const url = 'v1/auth/login';
            const result = generator.isapi(url);
            expect(result).toBe('');
        });

        it('should handle empty or null URLs', () => {
            expect(generator.isapi('')).toBe('');
            expect(generator.isapi(null as unknown as string)).toBe('');
        });
    });

    describe('genToken', () => {
        it('should generate valid token with fixed values', () => {
            const endpoint = 'V1/AUTH/LOGIN';
            const date = new Date('2024-03-20T00:00:00Z');
            const random1 = 11;
            const random2 = 22;

            const token = generator.genToken(endpoint, date, random1, random2);
            
            // Token should be base64
            expect(token).toBeValidToken();

            // Decode and verify
            const decoded = atob(token);
            expect(decoded.length).toBeGreaterThan(1);
            
            // First char should be control char (Te + 32)
            const controlChar = decoded.charCodeAt(0);
            expect(controlChar).toBeGreaterThanOrEqual(32);
            expect(controlChar).toBeLessThanOrEqual(63);
        });

        it('should generate different tokens for different endpoints', () => {
            const date = new Date();
            const random1 = 11;
            const random2 = 22;

            const token1 = generator.genToken('V1/AUTH/LOGIN', date, random1, random2);
            const token2 = generator.genToken('V1/AUTH/LOGOUT', date, random1, random2);

            expect(token1).not.toBe(token2);
        });

        it('should generate random values when not provided', () => {
            const endpoint = 'V1/AUTH/LOGIN';
            const date = new Date();

            const token1 = generator.genToken(endpoint, date);
            const token2 = generator.genToken(endpoint, date);

            expect(token1).not.toBe(token2);
        });
    });

    describe('genTokenFromURL', () => {
        it('should generate token from URL', () => {
            const url = 'https://example.com/api/v1/auth/login';
            const date = new Date('2024-03-20T00:00:00Z');
            const random1 = 11;
            const random2 = 22;

            const token = generator.genTokenFromURL(url, date, random1, random2);
            expect(token).toBeValidToken();
        });

        it('should handle invalid URLs', () => {
            const invalidUrl = 'invalid-url';
            const date = new Date();
            const token = generator.genTokenFromURL(invalidUrl, date);
            
            expect(token).toBeValidToken();
            // Token should be generated with empty endpoint
            const decoded = atob(token);
            expect(decoded).not.toContain('invalid-url');
        });
    });
}); 