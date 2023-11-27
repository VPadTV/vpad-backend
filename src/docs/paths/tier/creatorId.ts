import { makeRoute } from "@docs/helpers";

export const tierCreatorId = {
    post: makeRoute({
        tag: "Subscription Tier",
        summary: "Gets subscription tiers from creator",
        required: ['creatorId'],
        path: { creatorId: "clpeceq9h000078m210txowen" },
        400: "Missing creator ID",
    }),
}