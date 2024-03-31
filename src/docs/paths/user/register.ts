import { makeRoute } from 'src/old/docs/helpers';
import { exId } from 'src/old/docs/schemas/id';

export const userRegister = {
    post: makeRoute({
        tag: 'User',
        summary: 'Registers a new user',
        security: false,
        bodyRequired: ['username', 'email', 'password'],
        body: {
            username: 'some_username',
            nickname: 'some_nickname',
            email: 'email@domain.com',
            password: 'somepass',
            about: 'some about section',
        },
        success: {
            id: exId,
            token: 'string',
        },
        400: 'Invalid name, email or password'
    })
}