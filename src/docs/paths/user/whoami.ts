import { makeRoute } from '@docs/helpers';

export const userWhoAmI = {
    get: makeRoute({
        tag: 'User',
        summary: 'Returns user data from Bearer token, must be logged in',
        success: {
            username: 'some_username',
            nickname: 'some_nickname',
            email: 'email@domain.com',
            profilePhotoUrl: 'https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/ieopqwieqpop.jpg',
            about: 'some about me, or nothing',
            contact: 'some contact info',
            admin: false,
        },
    }),
}
