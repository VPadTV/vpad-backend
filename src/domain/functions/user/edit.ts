import { Errors } from "@domain/helpers"
import { emailRegex, nameRegex, passwordRegex } from "@domain/helpers/regex"
import { DatabaseClient } from "@infra/gateways/database"
import { Storage } from "@infra/gateways/storage"
import bcrypt from "bcrypt"

export type UserEditRequest = {
    id: string
    username?: string
    nickname?: string
    email?: string
    password?: string
    profilePhotoBase64?: string
}

export type UserEditResponse = {
    id: string
}

export async function userEdit(req: UserEditRequest, db: DatabaseClient, storage: Storage): Promise<UserEditResponse> {
    if (req.username && !nameRegex().test(req.username)) {
        throw Errors.INVALID_NAME()
    }
    if (req.nickname && !nameRegex().test(req.nickname)) {
        throw Errors.INVALID_NAME()
    }
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
    let profilePhotoData = req.profilePhotoBase64 ? storage.getFileData(req.profilePhotoBase64) : undefined

    const user = await db.user.update(
        {
            where: { id: req.id },
            data: {
                username: req.username,
                nickname: req.nickname,
                email: req.email,
                password: req.password && await bcrypt.hash(req.password, 10),
                profilePhotoUrl: profilePhotoData?.url
            }
        })

    await storage.upload(profilePhotoData)
    return { id: user.id }
}