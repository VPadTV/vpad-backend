import { Errors } from '@plugins/http'
import { JWT } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { userIsBanned } from './isBanned'
import { HttpReq } from '@plugins/requestBody'
import { IncomingHttpHeaders } from 'http'

export type UserLoginRequest = {
    headers: IncomingHttpHeaders
    emailOrUsername: string
    password: string
}

export type UserLoginResponse = {
    id: string
    token: string
}

export async function userLogin(req: HttpReq<UserLoginRequest>, db: DatabaseClient): Promise<UserLoginResponse> {
    let user: User | null
    if (req.emailOrUsername)
        user = await db.user.findFirst({
            where: {
                OR: [
                    { email: req.emailOrUsername },
                    { username: req.emailOrUsername },
                ]
            }
        })
    else
        throw Errors.MISSING_EMAIL_OR_USERNAME()

    if (!req.password)
        throw Errors.MISSING_PASSWORD()

    if (!user)
        throw Errors.NOT_FOUND()

    if ((await userIsBanned({ user }, db)).banned)
        throw Errors.BANNED()

    if (!await bcrypt.compare(req.password, user.password))
        throw Errors.INCORRECT_PASSWORD()

    const token = JWT.newToken(user, req.headers!)

    return { id: user.id, token }
}