import { makeRoute } from "@docs/helpers";
import { exId } from "@docs/schemas/id";

export const commId = {
    put: makeRoute({
        tag: 'Commission',
        summary: 'Updates a commission',
        path: {
            id: exId
        },
        body: {
            title: 'funny commission',
            details: 'i want this and this and that',
            creatorId: exId,
            price: 1200
        },
        bodyRequired: ['title', 'details', 'creatorId', 'price']
    }),
}
