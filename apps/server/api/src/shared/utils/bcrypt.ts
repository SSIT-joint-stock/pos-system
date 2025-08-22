import bcrypt from 'bcryptjs';

export class BcryptError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BcryptError';
    }
}

export class BcryptUtils {
    constructor(private readonly saltRounds: number = 10) { }

    // hash password
    async hash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            throw new BcryptError('Failed to hash password');
        }
    }

    // compare password
    async compare(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            throw new BcryptError('Failed to compare password');
        }
    }
}