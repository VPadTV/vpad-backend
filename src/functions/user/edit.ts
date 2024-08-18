import { Errors } from '@plugins/http'
import { emailRegex, usernameRegex, passwordRegex, nicknameRegex } from '@plugins/regex'
import { DatabaseClient } from '@infra/gateways/database'
import { ImageType, Storage } from '@infra/gateways/storage'
import { FileRawUpload } from '@infra/middlewares'
import { MediaType } from '@prisma/client'
import bcrypt from 'bcrypt'
import { UserHttpReq } from '@plugins/requestBody'

export type UserEditRequest = {
    id: string
    username?: string
    nickname?: string
    email?: string
    password?: string
    about?: string
    profilePhoto?: FileRawUpload
}

export type UserEditResponse = {}

export async function userEdit(req: UserHttpReq<UserEditRequest>, db: DatabaseClient, storage: Storage): Promise<UserEditResponse> {
    if (req.username != null && !usernameRegex().test(req.username))
        throw Errors.INVALID_USERNAME()
    if (req.nickname != null && !nicknameRegex().test(req.nickname))
        throw Errors.INVALID_NICKNAME()
    if (req.email != null && !emailRegex().test(req.email))
        throw Errors.INVALID_EMAIL()
    if (req.password != null && !passwordRegex().test(req.password))
        throw Errors.INVALID_PASSWORD()

    let profilePhotoData = await storage.getFileData(req.profilePhoto, ImageType.THUMBNAIL)
    if (profilePhotoData?.type === MediaType.VIDEO) throw Errors.INVALID_FILE()

    if (req.username) {
        const found = await db.user.findFirst({ where: { username: req.username } })
        if (found && found.id !== req.id) throw Errors.USERNAME_ALREADY_EXISTS()
    }

    await db.user.update({
        where: { id: req.id },
        data: {
            username: req.username,
            nickname: req.nickname,
            email: req.email,
            password: req.password && await bcrypt.hash(req.password, 10),
            about: req.about,
            profilePhotoUrl: profilePhotoData?.url
        }
    })

    await storage.upload(profilePhotoData)

    return {}
}