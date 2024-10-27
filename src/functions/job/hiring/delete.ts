import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { UserReq } from "@plugins/requestBody"
import { validString } from "@plugins/validString"

export type JobDeleteReq = {
    id: string
}

export type JobDeleteRes = {}

export async function jobDelete(req: UserReq<JobDeleteReq>, db: DatabaseClient): Promise<JobDeleteRes> {
    const id = req.id
    if (!validString(id))
        throw Errors.INVALID_ID()

    const job = await db.job.delete({
        where: {
            id,
            ownerId: req.user.id,
        }
    })

    if (!job) {
        throw Errors.NOT_FOUND()
    }

    return {}
}
