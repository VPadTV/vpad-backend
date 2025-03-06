import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const seriesNoId = {
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
    })
}