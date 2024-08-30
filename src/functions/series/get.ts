import { DatabaseClient } from '@infra/gateways/database'
import { Errors } from '@plugins/http'
import { Req } from '@plugins/requestBody'
import { validString } from '@plugins/validString'

export type SeriesGetRequest = {
    ownerId: string
}

export type SeriesGetResponse = {
    id: string
    name: string
}[]

export async function seriesGet(req: Req<SeriesGetRequest>, db: DatabaseClient): Promise<SeriesGetResponse> {
    if (!validString(req.ownerId)) {
        throw Errors.INVALID_ID()
    }

    const series = await db.series.findMany({
        where: {
            ownerId: req.ownerId,
        },
        select: {
            id: true,
            name: true,
        }
    })

    return series
}
