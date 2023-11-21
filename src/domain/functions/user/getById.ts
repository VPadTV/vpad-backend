import { Errors } from "@domain/helpers"
import { Database } from "@infra/gateways/database"

export type UserGetByIdRequest = {
    id: string
}

export type UserGetByIdResponse = {
    username: string
    nickname: string
    email: string
    profilePhotoUrl: string
    about?: string
    contact?: string
    admin: boolean
}

export async function userFindById(req: UserGetByIdRequest): Promise<UserGetByIdResponse> {
    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: req.id } })
    if (!user) {
        throw Errors.NOT_FOUND()
    }
    return {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        profilePhotoUrl: user.profilePhotoUrl,
        about: user.about,
        contact: user.contact,
        admin: user.admin
    }
}