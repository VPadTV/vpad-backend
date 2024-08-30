import { DatabaseClient } from '@infra/gateways/database'
import { Errors } from '@plugins/http'
import { UserReq } from '@plugins/requestBody'
import { validString } from '@plugins/validString'

export type SeriesEditRequest = {
    id: string
    name: string
}

export type SeriesEditResponse = {}

export async function seriesEdit(req: UserReq<SeriesEditRequest>, db: DatabaseClient): Promise<SeriesEditResponse> {
    if (!validString(req.id)) {
        throw Errors.INVALID_ID()
    }
    if (!validString(req.name)) {
        throw Errors.INVALID_NAME()
    }

    await db.series.update({
        where: {
            id: req.id!,
            ownerId: req.user.id,
        },
        data: {
            name: req.name!,
        }
    })

    return {}
}
