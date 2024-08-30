import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { UserReq } from '@plugins/requestBody'

export type SubGetRequest = {
    creatorId: string
}

export type SubGetResponse = {
    id: string;
    tier: {
        id: string;
        name: string;
        price: number;
    } | null
} | {}

export async function subGet(req: UserReq<SubGetRequest>, db: DatabaseClient): Promise<SubGetResponse> {
    if (typeof req.user.id !== 'string' || typeof req.creatorId !== 'string')
        throw Errors.MISSING_ID()

    const sub = await db.subscription.findFirst({
        where: {
            userId: req.user.id,
            tier: {
                creatorId: req.creatorId
            }
        },
        select: {
            id: true,
            tier: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                }
            }
        }
    })

    if (!sub) throw Errors.NOT_FOUND()

    return {
        id: sub.id,
        tier: sub.tier ? {
            id: sub.tier.id,
            name: sub.tier.name,
            price: sub.tier.price.toNumber()
        } : null
    } ?? {}
}
