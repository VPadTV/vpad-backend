import { makeRoute } from "@docs/helpers";
import { dateExample } from "@docs/schemas/dateExample"

export const adminBanId = {
    post: makeRoute({
        tag: "Admin",
        summary: "Manages a user ban",
        security: false,
        path: { id: "clpeceq9h000078m210txowen" },
        bodyRequired: ["banned"],
        body: {
            banned: true,
            banTimeout: dateExample
        },
        success: {
            id: "clpeceq9h000078m210txowen",
            banned: true,
            banTimeout: dateExample
        },
        400: "`banned` must be `true` or `false`",
    }),
}