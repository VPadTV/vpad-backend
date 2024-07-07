import { makeRoute } from '@docs/helpers';
import { exDate } from '@docs/schemas/dateExample'
import { exId } from '@docs/schemas/id';

export const adminBanId = {
    put: makeRoute({
        tag: 'Admin',
        summary: 'Manages a user ban',
        security: false,
        path: { id: exId },
        bodyRequired: ['banned'],
        body: {
            banned: true,
            banTimeout: exDate
        },
        success: {
            id: exId,
            banned: true,
            banTimeout: exDate
        },
        400: '`banned` must be `true` or `false`',
    }),
}