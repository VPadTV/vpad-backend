import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const donate = {
    post: makeRoute({
        tag: 'Pay',
        summary: 'Starts a payment donation session',
        body: {
            donation: 10,
            destinationUserId: 'abcd',
        },
        bodyRequired: ['donation', 'destinationUserId'],
        success: {
            id: exId
        }
    })
}