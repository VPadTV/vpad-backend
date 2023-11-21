import { Errors } from "@domain/helpers"
import { emailRegex, passwordRegex } from "@domain/helpers/regex"
import { Database } from "@infra/gateways/database"
import bcrypt from "bcrypt"

export type UserEditRequest = {
    id: number
    username?: string
    nickname?: string
    email?: string
    password?: string
    profilePhotoBase64?: string
}

export type UserEditResponse = {
    id: number
}

export async function userEdit(req: UserEditRequest): Promise<UserEditResponse> {
    const db = Database.get()
    if (req.email) {
        if (!emailRegex().test(req.email)) {
            throw Errors.INVALID_EMAIL()
        }
    }
    if (req.password) {
        if (!passwordRegex().test(req.password)) {
            throw Errors.INVALID_PASSWORD()
        }
    }
    let profilePhotoUrl: string | null
    if (req.profilePhotoBase64) {
        profilePhotoUrl = "profilePhotoTestUrl"
    }

    const user = await db.user.update(
        {
            where: { id: +req.id },
            data: {
                username: req.username,
                nickname: req.nickname,
                email: req.email,
                password: req.password && await bcrypt.hash(req.password, 10),
                profilePhotoUrl
            }
        },)
    return { id: user.id }
}