import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { UserHttpReq } from "@plugins/requestBody"
import { validString } from "@plugins/validString"

export type CommissionCreateRequest = {
    title: string
    details: string
    creatorId: string
    price: number
}

export type CommissionCreateResponse = {
    commId: string
}

export async function commCreate(req: UserHttpReq<CommissionCreateRequest>, db: DatabaseClient): Promise<CommissionCreateResponse> {
    if (!validString(req.title)) throw Errors.MISSING_TITLE()
    if (!validString(req.details)) throw Errors.MISSING_DETAILS()
    if (!validString(req.creatorId)) throw Errors.MISSING_CREATOR()
    if (!validString(req.price)) throw Errors.MISSING_PRICE()

    const comm = await db.commission.create({
        data: {
            title: req.title!,
            details: req.details!,
            creator: {
                connect: { id: req.creatorId }
            },
            user: {
                connect: { id: req.user.id },
            },
            price: req.price!
        }
    })

    return { commId: comm.id }

}
