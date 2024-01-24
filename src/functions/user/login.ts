import { Errors } from '@helpers/http'
import { JWT } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { userIsBanned } from './isBanned'

export type UserLoginRequest = {
    email?: string
    username?: string
    password: string
}

export type UserLoginResponse = {
    id: string
    token: string
}

export async function userLogin(req: UserLoginRequest, db: DatabaseClient): Promise<UserLoginResponse> {
    let user: User | null
    if (req.email)
        user = await db.user.findFirst({
            where: { email: req.email }
        })
    else if (req.username)
        user = await db.user.findFirst({
            where: { username: req.username }
        })
    else
        throw Errors.MISSING_EMAIL_OR_USERNAME()

    if (!user)
        throw Errors.NOT_FOUND()

    if ((await userIsBanned({ user }, db)).banned)
        throw Errors.BANNED()

    if (!await bcrypt.compare(req.password, user.password))
        throw Errors.INCORRECT_PASSWORD()

    const token = JWT.newToken(user)

    return { id: user.id, token }
}