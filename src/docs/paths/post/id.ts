import { BodyFile, ContentType, makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';
import { simpleUser } from '@docs/schemas/simpleUser';

export const postId = {
    get: makeRoute({
        tag: 'Post',
        summary: 'Returns post data from id',
        security: false,
        path: {
            id: exId
        },
        success: {
            text: 'some text',
            mediaUrl: `https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/sdklawejwap.mp4`,
            thumbUrl: `https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/jerkejrlkej.jpg`,
            meta: {
                author: simpleUser,
                credits: [{
                    user: simpleUser,
                    description: 'some description'
                }],
                likes: 10,
                dislikes: 20,
                views: 40,
                myVote: 1,
            },
        },
        404: 'Provided ID didnt resolve to any post',
    }),
    put: makeRoute({
        tag: 'Post',
        summary: 'Updates post from id, must be logged in',
        path: { id: exId },
        contentType: ContentType.MULTIPART,
        body: {
            text: 'some text',
            media: BodyFile,
            thumb: BodyFile,
        },
        404: 'Provided ID didnt resolve to any post',
    }),
    delete: makeRoute({
        tag: 'Post',
        summary: 'Deletes a post from id, must be logged in',
        path: { id: exId },
        success: {},
        404: 'Provided ID didnt resolve to any post',
    })
}