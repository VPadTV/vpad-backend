import { makeRoute } from "@docs/helpers";

export const subCreatorId = {
    get: makeRoute({
        tag: "Subscription",
        summary: "Gets a subscription from user id and creator id, must be logged in",
        path: { creatorId: "clpeceq9h000078m210txowen" },
        400: "Missing ID",
    }),
}