import { makeRoute } from '@docs/helpers';
import { simpleUser } from '@docs/schemas/simpleUser';

export const userNoId = {
    get: makeRoute({
        tag: 'User',
        summary: 'Returns multiple users',
        query: {
            search: 'search',
            page: 1,
            size: 10,
            sortBy: 'nickname | createdAt',
            sortDirection: 'oldest | latest',
        },
        success: {
            users: simpleUser
        },
    }),
}
