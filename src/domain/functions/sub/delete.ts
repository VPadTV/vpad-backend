import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"

export type SubDeleteRequest = {
    id: string
}

export type SubDeleteResponse = {}

export async function subDelete(req: SubDeleteRequest, db: DatabaseClient): Promise<SubDeleteResponse> {
    if (!req.id)
        throw Errors.MISSING_ID()

    db.subscription.delete({
        where: { id: req.id }
    })
    return {}
}
