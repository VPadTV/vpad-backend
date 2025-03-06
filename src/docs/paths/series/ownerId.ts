import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const seriesOwnerId = {
    get: makeRoute({
        tag: 'Series',
        summary: 'Gets many series from owner id',
        path: {
            ownerId: exId
        },
        success: {
            data: [{
                id: exId,
                name: 'some name',
            }]
        },
        404: 'No series found',
    })
}