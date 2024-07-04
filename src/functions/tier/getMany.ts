import { Errors } from 'src/plugins/http'
import { DatabaseClient } from '@infra/gateways/database'

export type TierGetManyRequest = {
    creatorId: string
}

export type TierGetManyResponse = {
    tiers: {
        name: string
        price: number
    }[]
}

export async function tierGetMany(req: TierGetManyRequest, db: DatabaseClient): Promise<TierGetManyResponse> {
    if (typeof req.creatorId !== 'string')
        throw Errors.MISSING_ID()

    const tiers = await db.subscriptionTier.findMany({
        where: { creatorId: req.creatorId },
        select: {
            name: true,
            price: true,
        }
    })

    return {
        tiers: tiers.map(tier => ({
            name: tier.name,
            price: tier.price.toNumber()
        }))
    }
}
