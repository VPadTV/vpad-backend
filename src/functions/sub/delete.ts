import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'

export type SubDeleteRequest = {
    user: User
    id: string
}

export type SubDeleteResponse = {}

export async function subDelete(req: SubDeleteRequest, db: DatabaseClient): Promise<SubDeleteResponse> {
    if (typeof req.id !== 'string')
        throw Errors.MISSING_ID()

    // TODO: check payment stuff

    await db.subscription.delete({
        where: { id: req.id, userId: req.user.id }
    })

    return {}
}
