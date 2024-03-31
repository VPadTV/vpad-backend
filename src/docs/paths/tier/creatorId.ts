import { makeRoute } from 'src/old/docs/helpers';
import { exId } from 'src/old/docs/schemas/id';

export const tierCreatorId = {
    get: makeRoute({
        tag: 'Subscription Tier',
        summary: 'Gets subscription tiers from creator',
        bodyRequired: ['creatorId'],
        path: { creatorId: exId },
        success: {
            tiers: [{
                name: 'name',
                price: 1.99
            }]
        },
        400: 'Missing creator ID',
    }),
}