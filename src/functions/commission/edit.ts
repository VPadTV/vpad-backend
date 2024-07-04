import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { validString } from "@plugins/validString"
import { User } from "@prisma/client"

export type CommissionEditRequest = {
    user: User
    commId: string
    title: string
    details: string
}

export type CommissionEditResponse = {}

export async function commCreate(req: CommissionEditRequest, db: DatabaseClient): Promise<CommissionEditResponse> {
    if (!validString(req.commId)) throw Errors.MISSING_ID()
    if (!validString(req.title)) throw Errors.MISSING_TITLE()
    if (!validString(req.details)) throw Errors.MISSING_DETAILS()

    await db.commission.update({
        where: {
            id: req.commId,
            userId: req.user.id
        },
        data: {
            title: req.title,
            details: req.details,
        }
    })


    return {}

}
