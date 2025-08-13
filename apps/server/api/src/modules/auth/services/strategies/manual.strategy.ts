import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@repo/config-env';
import { type LoginCredentials, type AuthResult, type ManualAuthStrategy } from '../../interfaces/auth.interface';
import { UserRepository } from '@shared/repositories/user.repository';

export class ManualStrategy implements ManualAuthStrategy {
    public readonly name = 'manual' as const;
    private readonly users = new UserRepository();
    
    canHandle(): boolean { return true; }

    async login(credentials: LoginCredentials): Promise<AuthResult> {
        const user = await this.users.findByEmailOrUsername(credentials.usernameOrEmail);
        if (!user || !user.passwordHash) {
            throw new Error('INVALID_CREDENTIALS');
        }
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok || !user.isActive) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const accessToken = jwt.sign({ sub: user.id }, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_ACCESS_EXPIRY,
            issuer: env.JWT_ISSUER,
            audience: env.JWT_AUDIENCE,
        });

        const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
            expiresIn: env.JWT_REFRESH_EXPIRY,
            issuer: env.JWT_ISSUER,
            audience: env.JWT_AUDIENCE,
        });

        return { userId: user.id, accessToken, refreshToken };
    }
}


