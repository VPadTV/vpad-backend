import {  User } from "@prisma/client";
import bcrypt from 'bcrypt'
import { SimpleUser } from '@plugins/user';
import { IUserRepository } from "@domain/interfaces/user/IUserRepository";

import { Storage } from '@plugins/storage';
import { PrismaUseCase } from "@domain/use-cases/PrismaUseCase";


export class UserRepository implements Partial<IUserRepository>{
    constructor(private readonly db: PrismaUseCase, private readonly storage: Storage) { }

    async create(req: Partial<any>): Promise<any> {
        return await this.db.user.create({
            data: {
                username: req.username,
                nickname: req.nickname?.length ? req.nickname : req.username,
                email: req.email,
                about: req.about ? req.about : undefined,
                password: await bcrypt.hash(req.password, 10)
            }
        })
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.db.user.findUnique({ where: { email } })
    }

    async userIsBanned(user: User) {
        if (user.banned) {
            if (!user.banTimeout || user.banTimeout.valueOf() < Date.now())
                return { banned: true }
            await this.db.user.update({
                where: { id: user.id },
                data: { banned: false, banTimeout: null }
            })
        }
        return { banned: false }
    }

    async getAll(req: any): Promise<any> {
        
        const users = await this.db.user.findMany({
            where: {
                username: req.usernameSearch ? {
                    search: req.usernameSearch,
                } : undefined,
                nickname: req.nicknameSearch ? {
                    search: req.nicknameSearch,
                } : undefined,
                banned: req.banned,
            },
            select: {
                ...SimpleUser.selector,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        return { users }
    }
    async getById(request: any): Promise<User> {
        const user = await this.db.user.findUnique({ where: { id: request.id } })
        return user
    }

    async update(request: any): Promise<any> {

        const result = this.db.user.update({
            where: { id: request.id },
            data: {
                username: request.username,
                nickname: request.nickname,
                email: request.email,
                password: request.password,
                about: request.about,
                profilePhotoUrl: request.profilePhotoData?.url
            }
        })

        await this.storage.upload(request.profilePhotoData)

        return result
    }
    async delete(request: any): Promise<any> {
        return this.db.user.delete({ where: { id : request.id } })
    }
}