import { DatabaseClient } from '@infra/gateways/database'
import { Errors } from '@plugins/http'
import { UserReq } from '@plugins/requestBody'
import { validString } from '@plugins/validString'

export type SeriesCreateRequest = {
    name: string
}

export type SeriesCreateResponse = {
    id: string
}

export async function seriesCreate(req: UserReq<SeriesCreateRequest>, db: DatabaseClient): Promise<SeriesCreateResponse> {
    if (!validString(req.name)) {
        throw Errors.INVALID_NAME()
    }

    const series = await db.series.create({
        data: {
            ownerId: req.user.id,
            name: req.name!,
        }
    })

    return { id: series.id }
}
