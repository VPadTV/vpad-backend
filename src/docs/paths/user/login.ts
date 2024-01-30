import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const userLogin = {
    post: makeRoute({
        tag: 'User',
        summary: 'Logins as a user using email or username and a password',
        security: false,
        bodyRequired: ['password'],
        body: {
            emailOrUsername: 'some_username',
            password: 'somepass',
        },
        success: {
            id: exId,
            token: 'string',
        },
        400: 'Must include email or username, incorrect password',
        403: 'Banned',
        404: 'Not found',
    })
}