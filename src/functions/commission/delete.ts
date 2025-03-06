import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { UserHttpReq } from "@plugins/requestBody"
import { validString } from "@plugins/validString"

export type CommissionDeleteRequest = {
    commId: string
}

export type CommissionDeleteResponse = {}

export async function commDelete(req: UserHttpReq<CommissionDeleteRequest>, db: DatabaseClient): Promise<CommissionDeleteResponse> {
    if (!validString(req.commId)) throw Errors.MISSING_ID()

    const comm = await db.commission.findUnique({
        where: { id: req.commId }
    })
    
    if (!comm) throw Errors.NOT_FOUND() 

    if (req.user.id === comm.userId) {
        // requester is deleting
    } else if (req.user.id === comm.creatorId) {
        // creator is deleting
    } else {
        return {}
    }

    await db.commission.delete({
        where: { id: req.commId }
    })

    return {}
}
