import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const subId = {
    delete: makeRoute({
        tag: 'Subscription',
        summary: 'Deletes a subscription from id, must be logged in',
        path: { id: exId },
        400: 'Missing ID',
    }),
}