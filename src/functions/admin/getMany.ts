import { Errors } from '@plugins/http'
import { SimpleUser } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'
import { HttpReq } from '@plugins/requestBody'

export type AdminGetManyRequest = {}

export type AdminGetManyResponse = { users: SimpleUser[] }

export async function adminGetMany(_req: HttpReq<AdminGetManyRequest>, db: DatabaseClient): Promise<AdminGetManyResponse> {
    const users = await db.user.findMany({
        where: {
            admin: true
        },
        select: {
            ...SimpleUser.selector,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (!users || users.length === 0) throw Errors.NOT_FOUND()

    return { users }
}