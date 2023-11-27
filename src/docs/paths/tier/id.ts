import { makeRoute } from "@docs/helpers";

export const tierId = {
    put: makeRoute({
        tag: "Subscription Tier",
        summary: "Updates subscription tier from id, must be logged in",
        required: ['id', 'name'],
        path: { id: "clpeceq9h000078m210txowen" },
        body: {
            name: "some tier name"
        },
        400: "Missing ID, Missing name",
    }),
    delete: makeRoute({
        tag: "Subscription Tier",
        summary: "Deletes subscription tier from id, must be logged in",
        required: ['id'],
        path: { id: "clpeceq9h000078m210txowen" },
        400: "Missing ID",
    })
}