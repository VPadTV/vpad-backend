import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'

export type SubCreateRequest = {
    user: User
    tierId: string
}

export type SubCreateResponse = {}

export async function subCreate(req: SubCreateRequest, db: DatabaseClient): Promise<SubCreateResponse> {
    if (typeof req.user.id !== 'string')
        throw Errors.MISSING_ID()

    const foundSubscription = await db.subscription.findFirst({
        where: {
            userId: req.user.id, tier: {
                creator: {
                    tiers: { some: { id: req.tierId } }
                }
            }
        }
    })


    if (foundSubscription) {
        // TODO: check payment stuff
        await db.subscription.update({
            where: {
                id: foundSubscription.id
            },
            data: {
                tierId: req.tierId
            }
        })
    } else {
        // TODO: check payment stuff
        await db.subscription.create({
            data: {
                userId: req.user.id,
                tierId: req.tierId?.length === 0 ? null : req.tierId
            }
        })
    }


    return {}
}
