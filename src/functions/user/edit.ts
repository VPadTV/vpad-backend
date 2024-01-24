import { Errors } from '@helpers/http'
import { emailRegex, nameRegex, passwordRegex } from '@helpers/regex'
import { DatabaseClient } from '@infra/gateways/database'
import { Storage } from '@infra/gateways/storage'
import { FileRawUpload } from '@infra/middlewares'
import { MediaType } from '@prisma/client'
import bcrypt from 'bcrypt'

export type UserEditRequest = {
    id: string
    username?: string
    nickname?: string
    email?: string
    password?: string
    profilePhoto?: FileRawUpload
}

export type UserEditResponse = {}

export async function userEdit(req: UserEditRequest, db: DatabaseClient, storage: Storage): Promise<UserEditResponse> {
    if (req.username && !nameRegex().test(req.username))
        throw Errors.INVALID_USERNAME()
    if (req.nickname && !nameRegex().test(req.nickname))
        throw Errors.INVALID_USERNAME()
    if (req.email && !emailRegex().test(req.email))
        throw Errors.INVALID_EMAIL()
    if (req.password && !passwordRegex().test(req.password))
        throw Errors.INVALID_PASSWORD()

    let profilePhotoData = storage.getFileData(req.profilePhoto)
    if (profilePhotoData?.type === MediaType.VIDEO) throw Errors.INVALID_FILE()

    await db.user.update({
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

    return {}
}