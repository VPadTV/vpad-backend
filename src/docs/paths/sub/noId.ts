import { makeRoute } from "@docs/helpers";
import { exId } from "@docs/schemas/id";

export const subNoId = {
    post: makeRoute({
        tag: "Subscription",
        summary: "Creates subscription, must be logged in",
        bodyRequired: ['creatorId'],
        body: {
            creatorId: exId,
            tierId: exId
        },
        400: "Missing ID",
    })
}