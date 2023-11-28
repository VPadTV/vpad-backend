import { Errors } from "@domain/helpers"
import { emailRegex, nameRegex, passwordRegex } from "@domain/helpers/regex"
import { JWT } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import bcrypt from "bcrypt"

export type UserRegisterRequest = {
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

export async function userRegister(req: UserRegisterRequest, db: DatabaseClient): Promise<UserRegisterResponse> {
    if (!req.username)
        throw Errors.MISSING_USERNAME()
    if (!req.email)
        throw Errors.MISSING_EMAIL()
    if (!req.password)
        throw Errors.MISSING_PASSWORD()

    if (!nameRegex().test(req.username))
        throw Errors.INVALID_USERNAME()
    if (req.nickname?.length && !nameRegex().test(req.nickname))
        throw Errors.INVALID_NICKNAME()
    if (!emailRegex().test(req.email))
        throw Errors.INVALID_EMAIL()
    if (!passwordRegex().test(req.password))
        throw Errors.INVALID_PASSWORD()

    const user = await db.user.create({
        data: {
            username: req.username,
            nickname: req.nickname?.length ? req.nickname : req.username,
            email: req.email,
            about: req.about ? req.about : undefined,
            password: await bcrypt.hash(req.password, 10)
        }
    })

    const token = JWT.newToken(user)

    return { id: user.id, token }
}