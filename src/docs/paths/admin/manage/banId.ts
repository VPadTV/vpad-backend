import { makeRoute } from 'src/old/docs/helpers';
import { dateExample } from 'src/old/docs/schemas/dateExample'
import { exId } from 'src/old/docs/schemas/id';

export const adminBanId = {
    put: makeRoute({
        tag: 'Admin',
        summary: 'Manages a user ban',
        security: false,
        path: { id: exId },
        bodyRequired: ['banned'],
        body: {
            banned: true,
            banTimeout: dateExample
        },
        success: {
            id: exId,
            banned: true,
            banTimeout: dateExample
        },
        400: '`banned` must be `true` or `false`',
    }),
}