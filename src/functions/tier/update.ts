import { Errors } from '@plugins/http'
import { validString } from '@plugins/validString'
import { DatabaseClient } from '@infra/gateways/database'
import { UserHttpReq } from '@plugins/requestBody'

export type TierUpdateRequest = {
    id: string
    name: string
}

export type TierUpdateResponse = {}

export async function tierUpdate(req: UserHttpReq<TierUpdateRequest>, db: DatabaseClient): Promise<TierUpdateResponse> {
    if (!validString(req.id))
        throw Errors.MISSING_ID()
    if (!validString(req.name))
        throw Errors.MISSING_NAME()

    await db.subscriptionTier.update({
        where: { id: req.id, creatorId: req.user.id },
        data: { name: req.name },
        select: { id: true }
    })

    return {}
}
