import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { HttpReq } from '@plugins/requestBody'

export type UserGetRequest = {
    id: string
}

export type UserGetResponse = {
    username: string
    nickname: string
    email: string
    profilePhotoUrl: string | null
    about: string | null
    contact: string | null
    admin: boolean
    id: string
}

export async function userGet(req: HttpReq<UserGetRequest>, db: DatabaseClient): Promise<UserGetResponse> {
    if (typeof req.id !== 'string') throw Errors.INVALID_ID()
    const user = await db.user.findFirst({ where: { id: req.id } })
    if (!user) {
        throw Errors.NOT_FOUND()
    }
    return {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        profilePhotoUrl: user.profilePhotoUrl ?? null,
        about: user.about ?? null,
        contact: user.contact ?? null,
        admin: user.admin
    }
}
