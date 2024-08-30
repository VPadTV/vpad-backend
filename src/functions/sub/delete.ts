import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { UserReq } from '@plugins/requestBody'

export type SubDeleteRequest = {
    id: string
}

export type SubDeleteResponse = {}

export async function subDelete(req: UserReq<SubDeleteRequest>, db: DatabaseClient): Promise<SubDeleteResponse> {
    if (typeof req.id !== 'string')
        throw Errors.MISSING_ID()

    // TODO: check payment stuff

    await db.subscription.delete({
        where: { id: req.id, userId: req.user.id }
    })

    return {}
}
