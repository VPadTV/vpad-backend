import { makeRoute } from 'src/old/docs/helpers';
import { simpleUser } from 'src/old/docs/schemas/simpleUser';

export const adminNoId = {
    get: makeRoute({
        tag: 'Admin',
        summary: 'Returns all admins',
        security: false,
        success: {
            users: [simpleUser]
        },
        404: 'No admins found',
    }),
}