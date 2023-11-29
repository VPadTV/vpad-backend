import { Errors } from "@domain/helpers"
import { SimpleUser } from "@domain/helpers/mappers/user"
import { boolify } from "@domain/helpers/boolify"
import { DatabaseClient } from "@infra/gateways/database"

export type UserGetManyRequest = {
    usernameSearch?: string
    nicknameSearch?: string
    banned?: boolean
}

export type UserGetManyResponse = { users: SimpleUser[] }

export async function userGetMany(req: UserGetManyRequest, db: DatabaseClient): Promise<UserGetManyResponse> {
    req.banned = boolify(req.banned)
    const users = await db.user.findMany({
        where: {
            username: req.usernameSearch ? {
                search: req.usernameSearch,
            } : undefined,
            nickname: req.nicknameSearch ? {
                search: req.nicknameSearch,
            } : undefined,
            banned: req.banned,
        },
        select: {
            ...SimpleUser.selector,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    if (!users || users.length === 0) throw Errors.NOT_FOUND()

    return { users }
}