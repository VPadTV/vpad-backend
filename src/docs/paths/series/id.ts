import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const seriesId = {
    put: makeRoute({
        tag: 'Series',
        summary: 'Updates series from id, must be logged in',
        path: { id: exId },
        body: {
            name: 'some text',
        },
        404: 'Provided ID didnt resolve to any series',
    }),
    delete: makeRoute({
        tag: 'Series',
        summary: 'Deletes a series from id, must be logged in',
        path: { id: exId },
        success: {},
        404: 'Provided ID didnt resolve to any series',
    })
}