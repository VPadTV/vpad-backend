import { Errors } from "@domain/helpers"
import { JwtGateway } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"

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
        throw Errors.MUST_INCLUDE_EMAIL_OR_USERNAME()
    
    if (!user)
        throw Errors.NOT_FOUND()

    if (user.banned) {
        if (!user.banTimeout || user.banTimeout.valueOf() < Date.now())
            throw Errors.BANNED()
        db.user.update({
            where: { id: user.id },
            data: { banned: false, banTimeout: null }
        })
    }
    
    if (!await bcrypt.compare(req.password, user.password))
        throw Errors.INCORRECT_PASSWORD()

    const token = JwtGateway.newToken(user)

    return { id: user.id, token }
}