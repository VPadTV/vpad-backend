import { Errors } from '@plugins/http'
import { numify } from '@plugins/numify'
import { validString } from '@plugins/validString'
import { DatabaseClient } from '@infra/gateways/database'
import { Decimal } from '@prisma/client/runtime/library'
import { UserReq } from '@plugins/requestBody'

export type TierCreateRequest = {
    name: string
    price: string
}

export type TierCreateResponse = {
    id: string
}

export async function tierCreate(req: UserReq<TierCreateRequest>, db: DatabaseClient): Promise<TierCreateResponse> {
    if (typeof req.user.id !== 'string')
        throw Errors.MISSING_ID()
    if (!validString(req.name))
        throw Errors.MISSING_NAME()
    const price = numify(req.price)
    if (price === undefined)
        throw Errors.MISSING_PRICE()

    const tier = await db.subscriptionTier.create({
        data: {
            creatorId: req.user.id,
            name: req.name!,
            price: new Decimal(price),
        },
        select: { id: true }
    })

    return { id: tier.id }
}
