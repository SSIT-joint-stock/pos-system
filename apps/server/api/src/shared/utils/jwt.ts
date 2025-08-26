import jwt, { SignOptions } from 'jsonwebtoken';
import { TimeInterval } from './cron';

export class JwtUtils<T extends object> {

    constructor(private readonly secret: string, private readonly expiresIn: TimeInterval) { }

    // generate token
    generateToken(payload: T, options: SignOptions): string {
        return jwt.sign(payload, this.secret, { ...options, algorithm: 'HS256', expiresIn: this.expiresIn }) as string;
    }

    // verify token
    verifyToken(token: string): T {
        return jwt.verify(token, this.secret, { algorithms: ['HS256'] }) as T;
    }
}
