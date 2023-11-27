import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type SubGetRequest = {
    user: User
    creatorId: string
}

export type SubGetResponse = {
    id: string;
    tier: {
        id: string;
        name: string;
    } | null
} | {}

export async function subGet(req: SubGetRequest, db: DatabaseClient): Promise<SubGetResponse> {
    if (!req.user.id)
        throw Errors.MISSING_ID()
    if (!req.creatorId)
        throw Errors.MISSING_ID()

    const sub = await db.subscription.findFirst({
        where: {
            userId: req.user.id,
            creatorId: req.creatorId,
        },
        select: {
            id: true,
            tier: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    })

    return sub ?? {}
}
