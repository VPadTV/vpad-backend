import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type SubCreateRequest = {
    user: User
    creatorId: string
    tierId: '' | string
}

export type SubCreateResponse = {}

export async function subCreate(req: SubCreateRequest, db: DatabaseClient): Promise<SubCreateResponse> {
    if (!req.user.id)
        throw Errors.MISSING_ID()
    if (!req.creatorId)
        throw Errors.MISSING_ID()

    // TODO: check payment stuff

    await db.subscription.create({
        data: {
            userId: req.user.id,
            creatorId: req.creatorId,
            tierId: req.tierId?.length === 0 ? null : req.tierId
        }
    })

    return {}
}
