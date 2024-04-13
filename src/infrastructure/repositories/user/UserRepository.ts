import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SimpleUser } from '@plugins/user';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';

export class UserRepository {
    constructor(
        private readonly db: PrismaUseCase,
    ) { }

    async create(req: Partial<any>) {
        return await this.db.user.create({
            data: {
                username: req.username,
                nickname: req.nickname?.length ? req.nickname : req.username,
                email: req.email,
                about: req.about ? req.about : undefined,
                password: await bcrypt.hash(req.password, 10),
            },
        });
    }

    async getByEmail(email: string) {
        return await this.db.user.findUnique({ where: { email } });
    }

    async userIsBanned(user: User) {
        if (user.banned) {
            if (!user.banTimeout || user.banTimeout.valueOf() < Date.now())
                return { banned: true };
            await this.db.user.update({
                where: { id: user.id },
                data: { banned: false, banTimeout: null },
            });
        }
        return { banned: false };
    }

    async getAll(req) {
        const users = await this.db.user.findMany({
            where: {
                username: req.usernameSearch
                    ? {
                        search: req.usernameSearch,
                    }
                    : undefined,
                nickname: req.nicknameSearch
                    ? {
                        search: req.nicknameSearch,
                    }
                    : undefined,
                banned: req.banned,
            },
            select: {
                ...SimpleUser.selector,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return [{ users }];
    }
    async getById(req) {
        const user = await this.db.user.findUnique({ where: { id: req.id } });
        return user;
    }

    async update(req) {
        const result = await this.db.user.update({
            where: { id: req.id },
            data: {
                username: req.username,
                nickname: req.nickname,
                email: req.email,
                password: req.password,
                about: req.about,
                profilePhotoUrl: req.profilePhotoData?.url,
            },
        });


        return { id: result.id };
    }
    async delete(req) {
        return this.db.user.delete({ where: { id: req.id } });
    }
}
