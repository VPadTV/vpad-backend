import { makeRoute } from "@docs/helpers";

export const adminId = {
    post: makeRoute({
        tag: "Admin",
        summary: "Manages admins",
        security: false,
        path: { id: "clpeceq9h000078m210txowen" },
        required: ["admin"],
        body: {
            admin: true,
        },
        success: {
            id: "clpeceq9h000078m210txowen",
            admin: true
        },
        400: "`admin` must be `true` or `false`",
    }),
}