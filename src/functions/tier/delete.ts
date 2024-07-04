import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'

export type TierDeleteRequest = {
    user: User
    id: string
}

export type TierDeleteResponse = {}

export async function tierDelete(req: TierDeleteRequest, db: DatabaseClient): Promise<TierDeleteResponse> {
    if (typeof req.id !== 'string')
        throw Errors.MISSING_ID()

    await db.subscriptionTier.delete({
        where: { id: req.id, creatorId: req.user.id }
    })

    return {}
}
