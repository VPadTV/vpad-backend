import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const subCreatorId = {
    get: makeRoute({
        tag: 'Subscription',
        summary: 'Gets a subscription from user id and creator id, must be logged in',
        path: { creatorId: exId },
        success: {
            id: exId,
            tier: {
                id: exId,
                name: 'tier name',
                price: 1299,
            },
        },
        400: 'Missing ID',
    }),
}