import { headerValidate } from '../validate';

describe('Header Validation Schema', () => {
    it('should validate correct headers', () => {
        const validHeaders = {
            ua: 'validToken123',
            rn: 'abcd',  // Must be exactly 4 characters
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        };

        const result = headerValidate.safeParse(validHeaders);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(validHeaders);
        }
    });

    it('should reject missing headers', () => {
        const invalidHeaders = {
            ua: 'validToken123',
            // missing rn
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        };

        const result = headerValidate.safeParse(invalidHeaders);
        expect(result.success).toBe(false);
        if (!result.success) {
            const rnError = result.error.issues.find(i => i.path[0] === 'rn');
            expect(rnError?.code).toBe('invalid_type');
        }
    });

    it('should reject invalid types', () => {
        const invalidHeaders = {
            ua: 123, // should be string
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        };

        const result = headerValidate.safeParse(invalidHeaders);
        expect(result.success).toBe(false);
        if (!result.success) {
            const uaError = result.error.issues.find(i => i.path[0] === 'ua');
            expect(uaError?.code).toBe('invalid_type');
        }
    });

    it('should validate rn length', () => {
        // Test too short
        const tooShort = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abc',  // 3 chars, should be 4
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(tooShort.success).toBe(false);
        if (!tooShort.success) {
            const error = tooShort.error.issues[0];
            expect(error.path[0]).toBe('rn');
            expect(error.message).toBe('Random number must be exactly 4 characters');
        }

        // Test too long
        const tooLong = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcde',  // 5 chars, should be 4
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(tooLong.success).toBe(false);
        if (!tooLong.success) {
            const error = tooLong.error.issues[0];
            expect(error.path[0]).toBe('rn');
            expect(error.message).toBe('Random number must be exactly 4 characters');
        }

        // Test exact length
        const exactLength = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcd',  // Exactly 4 chars
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(exactLength.success).toBe(true);
    });

    it('should validate timestamp format', () => {
        // Test invalid timestamp format
        const invalidTimestamp = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcd',
            timestamp: 'not-a-timestamp',
            path: '/api/v1/test'
        });
        expect(invalidTimestamp.success).toBe(false);
        if (!invalidTimestamp.success) {
            const error = invalidTimestamp.error.issues.find(i => i.path[0] === 'timestamp');
            expect(error?.message).toBe('Timestamp must be a valid number');
        }

        // Test empty timestamp
        const emptyTimestamp = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcd',
            timestamp: '',
            path: '/api/v1/test'
        });
        expect(emptyTimestamp.success).toBe(false);
        if (!emptyTimestamp.success) {
            const error = emptyTimestamp.error.issues.find(i => i.path[0] === 'timestamp');
            expect(error?.message).toBe('Timestamp cannot be empty');
        }

        // Test valid timestamp
        const validTimestamp = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(validTimestamp.success).toBe(true);
    });

    it('should validate path format', () => {
        // Test empty path
        const emptyPath = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: ''
        });
        expect(emptyPath.success).toBe(false);
        if (!emptyPath.success) {
            const error = emptyPath.error.issues.find(i => i.path[0] === 'path');
            expect(error?.message).toBe('Path cannot be empty');
        }

        // Test invalid path prefix
        const invalidPrefix = headerValidate.safeParse({
            ua: 'validToken123',
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: '/v1/test'  // Missing /api/ prefix
        });
        expect(invalidPrefix.success).toBe(false);
        if (!invalidPrefix.success) {
            const error = invalidPrefix.error.issues.find(i => i.path[0] === 'path');
            expect(error?.message).toBe('Path must start with /api/');
        }

        // Test valid paths
        const validPaths = [
            '/api/v1/test',
            '/api/v2/auth/login',
            '/api/v1/users/123'
        ];

        validPaths.forEach(path => {
            const result = headerValidate.safeParse({
                ua: 'validToken123',
                rn: 'abcd',
                timestamp: Date.now().toString(),
                path
            });
            expect(result.success).toBe(true);
        });
    });

    it('should validate ua token format', () => {
        // Test empty ua token
        const emptyToken = headerValidate.safeParse({
            ua: '',
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(emptyToken.success).toBe(false);
        if (!emptyToken.success) {
            const error = emptyToken.error.issues.find(i => i.path[0] === 'ua');
            expect(error?.message).toBe('UA token cannot be empty');
        }

        // Test invalid characters
        const invalidChars = headerValidate.safeParse({
            ua: 'token with spaces!@#',
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(invalidChars.success).toBe(false);
        if (!invalidChars.success) {
            const error = invalidChars.error.issues.find(i => i.path[0] === 'ua');
            expect(error?.message).toBe('UA token must only contain base64-compatible characters');
        }

        // Test valid base64 characters
        const validChars = headerValidate.safeParse({
            ua: 'validToken123+/=',
            rn: 'abcd',
            timestamp: Date.now().toString(),
            path: '/api/v1/test'
        });
        expect(validChars.success).toBe(true);
    });
}); 