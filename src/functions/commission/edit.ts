import { DatabaseClient } from "@infra/gateways";
import { Errors } from "@plugins/http";
import { validString } from "@plugins/validString";
import { UserHttpReq } from "@plugins/requestBody";

export type CommissionEditRequest = {
    commId: string;

    title?: string;
    details?: string;

    confirm?: boolean;
    complete?: boolean;
};

export type CommissionEditResponse = {};

type CommWhere = {} | { creatorId: string } | { userId: string };
type CommData = {} | { confirmed: true } | { complete: true };

export async function commCreate(
    req: UserHttpReq<CommissionEditRequest>,
    db: DatabaseClient
): Promise<CommissionEditResponse> {
    if (!validString(req.commId)) throw Errors.MISSING_ID();

    if (!req.confirm && !req.complete) throw Errors.BAD_REQUEST();

    let where: CommWhere = {};
    let data: CommData = {};
    if (req.confirm) {
        where = { creatorId: req.user.id };
        data = { confirmed: true };
    } else if (req.complete) {
        where = { userId: req.user.id };
        data = { complete: true };
    }

    try {
        await db.commission.update({
            where: {
                id: req.commId,
                ...where,
            },
            data: {
                title: req.title,
                details: req.details,
                ...data,
            },
        });
    } catch (e) {
        throw Errors.FAILED_TO_UPDATE();
    }

    return {};
}
