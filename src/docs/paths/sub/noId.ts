import { makeRoute } from "@docs/helpers";

export const subNoId = {
    post: makeRoute({
        tag: "Subscription",
        summary: "Creates subscription, must be logged in",
        bodyRequired: ['creatorId'],
        body: {
            creatorId: "clpeceq9h000078m210txowen",
            tierId: "clpeceq9h000078m210txowen"
        },
        400: "Missing ID",
    })
}