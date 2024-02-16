import { makeRoute } from '@docs/helpers';
import { dateExample } from '@docs/schemas/dateExample';
import { simpleUser } from '@docs/schemas/simpleUser';
import { exId } from '@docs/schemas/id';

export const commentId = {
    get: makeRoute({
        tag: 'Comment',
        summary: 'Returns comment data from id',
        security: false,
        path: { id: exId },
        success: {
            text: 'some text',
            childrenCount: 10,
            meta: {
                user: simpleUser,
                createdAt: dateExample,
                updatedAt: dateExample,
            },
        },
        404: 'Provided ID didnt resolve to any comment',
    }),
    put: makeRoute({
        tag: 'Comment',
        summary: 'Updates comment from id, must be logged in',
        path: { id: exId },
        body: {
            text: 'some text'
        },
        404: 'Provided ID didnt resolve to any comment',
    }),
    delete: makeRoute({
        tag: 'Comment',
        summary: 'Deletes a comment from id, must be logged in',
        path: { id: exId },
        404: 'Provided ID didnt resolve to any comment',
    })
}