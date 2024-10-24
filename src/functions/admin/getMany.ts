import { Errors } from '@plugins/http'
import { SimpleUserMapper } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'
import { Req } from '@plugins/requestBody'

export type AdminGetManyRequest = {}

export type AdminGetManyResponse = { users: SimpleUserMapper[] }

export async function adminGetMany(_req: Req<AdminGetManyRequest>, db: DatabaseClient): Promise<AdminGetManyResponse> {
    const users = await db.user.findMany({
        where: {
            admin: true
        },
        select: {
            ...SimpleUserMapper.selector,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (!users || users.length === 0) throw Errors.NOT_FOUND()

    return { users }
}