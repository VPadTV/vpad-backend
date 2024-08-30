import { DatabaseClient } from '@infra/gateways/database'
import { Errors } from '@plugins/http'
import { UserReq } from '@plugins/requestBody'

export type SeriesDeleteRequest = {
    id: string
}

export async function seriesDelete(req: UserReq<SeriesDeleteRequest>, db: DatabaseClient): Promise<{}> {
    if (!req.id) throw Errors.MISSING_ID()

    await db.series.delete({
        where: { id: req.id, ownerId: req.user.id }
    })


    return {}
}
