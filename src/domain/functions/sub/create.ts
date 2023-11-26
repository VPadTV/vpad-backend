import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"

export type SubCreateRequest = {
    id: string
    creatorId: string
    tierId?: string
}

export type SubCreateResponse = {}

export async function subCreate(req: SubCreateRequest, db: DatabaseClient): Promise<SubCreateResponse> {
    if (!req.id)
        throw Errors.MISSING_ID()
    if (!req.creatorId)
        throw Errors.MISSING_ID()

    db.subscription.create({
        data: {
            userId: req.id,
            tierId: req.tierId
        }
    })
    return {}
}
