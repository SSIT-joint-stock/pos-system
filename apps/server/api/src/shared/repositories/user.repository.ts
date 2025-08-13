import prisma, { User } from '@shared/orm/prisma';
import { nanoid, customAlphabet } from 'nanoid';

export type UserEntity = User;

export class UserRepository {

    static readonly excludedFields = ['passwordHash'];

    // find user by email or username
    async findByEmailOrUsername(identifier: string): Promise<UserEntity | null> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ],
            },
        });
        return user;
    }

    // check if user is active
    async isActive(id: string): Promise<boolean> {
        const user = await this.findById(id);
        return user?.isActive ?? false;
    }

    // email verification
    async verifyEmail(id: string): Promise<void> {
        await this.update(id, { emailVerified: true });
    }

    // activate user
    async activate(id: string): Promise<void> {
        await this.update(id, { isActive: true });
    }

    // deactivate user
    async deactivate(id: string): Promise<void> {
        await this.update(id, { isActive: false });
    }

    // create user
    async create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'passwordChangedAt' | 'emailVerified' | 'isActive'>): Promise<UserEntity> {
        const newUser = await prisma.user.create({
            data: user,
        });
        return newUser as unknown as UserEntity;
    }

    // update user
    async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: user,
        });
        return updatedUser as unknown as UserEntity;
    }

    // delete user
    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    // find user by id
    async findById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user as unknown as UserEntity;
    }

    // find user by email
    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user as unknown as UserEntity;
    }

    // find user by username
    async findByUsername(username: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { username },
        });
        return user as unknown as UserEntity;
    }

    // generate username from email
    async generateUsername(email: string): Promise<string> {
        // name with meaning from email with nanoid
        const username = email.split('@')[0];
        const user = await this.findByUsername(username);
        if (user) {
            const randomSuffix = nanoid(4);
            return `${username}_${randomSuffix}`;
        }
        return username;
    }
}


