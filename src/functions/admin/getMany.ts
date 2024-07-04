import { Errors } from '@plugins/http'
import { SimpleUser } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'

export type AdminGetManyRequest = {}

export type AdminGetManyResponse = { users: SimpleUser[] }

export async function adminGetMany(_req: AdminGetManyRequest, db: DatabaseClient): Promise<AdminGetManyResponse> {
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