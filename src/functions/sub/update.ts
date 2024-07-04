import { Errors } from 'src/plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'

export type SubUpdateRequest = {
    user: User
    id: string
    tierId: string
}

export type SubUpdateResponse = {}

export async function subUpdate(req: SubUpdateRequest, db: DatabaseClient): Promise<SubUpdateResponse> {
    if (typeof req.id !== 'string' || typeof req.tierId !== 'string')
        throw Errors.MISSING_ID()

    const tier = await db.subscriptionTier.findFirst({
        where: { id: req.tierId },
        select: { price: true, creatorId: true }
    })

    if (!tier) throw Errors.BAD_REQUEST()

    // TODO: check payment stuff

    const creatorId = tier.creatorId

    await db.subscription.update({
        where: { id: req.id, userId: req.user.id, creatorId },
        data: { tierId: req.tierId }
    })

    return {}
}
