import { DatabaseClient } from '@infra/gateways/database'
import { Errors } from '@plugins/http'
import { Req } from '@plugins/requestBody'
import { User } from '@prisma/client'

export type UserIsBannedRequest = {
    user: User
}

export type UserIsBannedResponse = {
    banned: boolean
}

export async function userIsBanned({ user }: Req<UserIsBannedRequest>, db: DatabaseClient): Promise<UserIsBannedResponse> {
    if (!user) throw Errors.BAD_REQUEST()
    if (user.banned) {
        if (!user.banTimeout || user.banTimeout.valueOf() < Date.now())
            return { banned: true }
        await db.user.update({
            where: { id: user.id },
            data: { banned: false, banTimeout: null }
        })
    }
    return { banned: false }
}