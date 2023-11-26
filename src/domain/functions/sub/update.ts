import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"

export type SubUpdateRequest = {
    id: string
    tierId: string
}

export type SubUpdateResponse = {}

export async function subUpdate(req: SubUpdateRequest, db: DatabaseClient): Promise<SubUpdateResponse> {
    if (!req.id)
        throw Errors.MISSING_ID()
    if (!req.tierId)
        throw Errors.MISSING_ID()

    // TODO: check payment stuff

    db.subscription.update({
        where: { id: req.id },
        data: { tierId: req.tierId }
    })
    return {}
}
