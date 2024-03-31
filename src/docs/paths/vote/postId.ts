import { makeRoute } from 'src/old/docs/helpers';
import { exId } from 'src/old/docs/schemas/id';

export const votePostId = {
    put: makeRoute({
        tag: 'Vote',
        summary: 'Sets a post vote',
        path: {
            postId: exId
        },
        query: {
            vote: 1
        },
        404: 'Provided ID didnt resolve to any post',
    }),
}