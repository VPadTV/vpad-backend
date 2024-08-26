import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const postNoId = {
    post: makeRoute({
        tag: 'Series',
        summary: 'Creates a new series',
        bodyRequired: ['name'],
        body: {
            name: 'some name',
        },
        success: {
            id: exId
        }
    }),
    get: makeRoute({
        tag: 'Series',
        summary: 'Gets many series from owner id',
        path: {
            ownerId: exId
        },
        success: {
            id: exId,
            name: 'some name',
        },
        404: 'No series found',
    })
}