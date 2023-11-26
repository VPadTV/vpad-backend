import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"

export type TierUpdateRequest = {
    id: string
    name: string
}

export type TierUpdateResponse = {}

export async function tierUpdate(req: TierUpdateRequest, db: DatabaseClient): Promise<TierUpdateResponse> {
    if (!req.id)
        throw Errors.MISSING_ID()
    if (!req.name)
        throw Errors.MISSING_NAME()

    await db.subscriptionTier.update({
        where: { id: req.id },
        data: { name: req.name },
        select: { id: true }
    })

    return {}
}
