import { makeRoute } from '@docs/helpers';
import { dateExample } from '@docs/schemas/dateExample';
import { simpleUser } from '@docs/schemas/simpleUser';
import { exId } from '@docs/schemas/id';

export const commentNoId = {
    get: makeRoute({
        tag: 'Comment',
        summary: 'Returns many comments',
        security: false,
        query: {
            postId: exId,
            parentId: exId,
            sortBy: 'latest | oldest',
            page: 1,
            size: 30,
        },
        success: {
            total: 100,
            to: 30,
            from: 0,
            currentPage: 1,
            lastPage: 4,
            data: {
                id: exId,
                text: 'some text',
                childrenCount: 10,
                meta: {
                    user: simpleUser,
                    createdAt: dateExample,
                    updatedAt: dateExample,
                }
            }
        },
        404: 'No comments found',
    }),
    post: makeRoute({
        tag: 'Comment',
        summary: 'Creates a new comment',
        bodyRequired: ['postid', 'text'],
        body: {
            postId: exId,
            parentId: exId,
            text: 'some text',
        },
        success: {
            id: exId
        }
    })
}