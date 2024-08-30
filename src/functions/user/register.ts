import { Errors } from '@plugins/http'
import { emailRegex, usernameRegex, passwordRegex, nicknameRegex } from '@plugins/regex'
import { JWT } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import bcrypt from 'bcrypt'
import { Payment } from '@infra/gateways/payment'
import { HttpReq } from '@plugins/requestBody'
import { IncomingHttpHeaders } from 'http'

export type UserRegisterRequest = {
    headers: IncomingHttpHeaders
    username: string
    nickname?: string
    email: string
    password: string
    about?: string
}

export type UserRegisterResponse = {
    id: string
    token: string
}

export async function userRegister(req: HttpReq<UserRegisterRequest>, db: DatabaseClient, pay: Payment): Promise<UserRegisterResponse> {
    if (!req.username)
        throw Errors.MISSING_USERNAME()
    if (!req.email)
        throw Errors.MISSING_EMAIL()
    if (!req.password)
        throw Errors.MISSING_PASSWORD()

    if (!usernameRegex().test(req.username))
        throw Errors.INVALID_USERNAME()
    if (req.nickname?.length && !nicknameRegex().test(req.nickname))
        throw Errors.INVALID_NICKNAME()
    if (!emailRegex().test(req.email))
        throw Errors.INVALID_EMAIL()
    if (!passwordRegex().test(req.password))
        throw Errors.INVALID_PASSWORD()

    const stripeAccountId = await pay.createAccount(req.email)

    const user = await db.user.create({
        data: {
            username: req.username,
            nickname: req.nickname?.length ? req.nickname : req.username,
            email: req.email,
            about: req.about ? req.about : undefined,
            password: await bcrypt.hash(req.password, 10),
            stripeAccountId
        }
    })

    const token = JWT.newToken(user, req.headers!)

    return { id: user.id, token }
}