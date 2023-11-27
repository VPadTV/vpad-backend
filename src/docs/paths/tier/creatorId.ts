import { makeRoute } from "@docs/helpers";

export const tierCreatorId = {
    get: makeRoute({
        tag: "Subscription Tier",
        summary: "Gets subscription tiers from creator",
        bodyRequired: ['creatorId'],
        path: { creatorId: "clpeceq9h000078m210txowen" },
        400: "Missing creator ID",
    }),
}