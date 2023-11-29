import { Errors } from "@domain/helpers"
import { validString } from "@domain/helpers/validString"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type TierUpdateRequest = {
    user: User
    id: string
    name: string
}

export type TierUpdateResponse = {}

export async function tierUpdate(req: TierUpdateRequest, db: DatabaseClient): Promise<TierUpdateResponse> {
    if (typeof req.id !== 'string')
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
