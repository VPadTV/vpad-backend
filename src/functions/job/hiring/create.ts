import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { UserReq } from "@plugins/requestBody"
import { validString } from "@plugins/validString"

export type JobCreateReq = {
    description: string
}

export type JobCreateRes = {
    id: string
}

export async function jobCreate(req: UserReq<JobCreateReq>, db: DatabaseClient): Promise<JobCreateRes> {
    const description = req.description
    if (!validString(description))
        throw Errors.INVALID_DESCRIPTION()

    const job = await db.job.create({
        data: {
            ownerId: req.user.id,
            description: req.description!,
        }
    })

    return { id: job.id }
}