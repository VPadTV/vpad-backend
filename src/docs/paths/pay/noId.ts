import { makeRoute } from 'src/old/docs/helpers';
import { exId } from 'src/old/docs/schemas/id';

export const payNoId = {
    post: makeRoute({
        tag: 'Pay',
        summary: 'Starts a payment session',
        success: {
            id: exId
        }
    })
}