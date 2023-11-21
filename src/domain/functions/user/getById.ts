import { Errors } from "@domain/helpers"
import { Database } from "@infra/gateways/database"

export type UserGetByIdRequest = {
    id: number
}

export type UserGetByIdResponse = {
    username: string
    nickname: string
    email: string
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
    }
}