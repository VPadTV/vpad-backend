import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { HttpReq } from '@plugins/requestBody'

export type TierGetManyRequest = {
    creatorId: string
}

export type TierGetManyResponse = {
    tiers: {
        id: string
        name: string
        price: number
    }[]
}

export async function tierGetMany(req: HttpReq<TierGetManyRequest>, db: DatabaseClient): Promise<TierGetManyResponse> {
    if (typeof req.creatorId !== 'string')
        throw Errors.MISSING_ID()

    const tiers = await db.subscriptionTier.findMany({
        where: { creatorId: req.creatorId },
        select: {
            id: true,
            name: true,
            price: true,
        }
    })

    return {
        tiers: tiers.map(tier => ({
            id: tier.id,
            name: tier.name,
            price: tier.price.toNumber()
        }))
    }
}
