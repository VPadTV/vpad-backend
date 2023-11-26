import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"

export type TierDeleteRequest = {
    id: string
}

export type TierDeleteResponse = {}

export async function tierDelete(req: TierDeleteRequest, db: DatabaseClient): Promise<TierDeleteResponse> {
    if (!req.id)
        throw Errors.MISSING_ID()

    await db.subscriptionTier.delete({
        where: { id: req.id }
    })

    return {}
}
