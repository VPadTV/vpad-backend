import { makeRoute } from "@docs/helpers";
import { simpleUser } from "@docs/schemas/simpleUser";

export const adminNoId = {
    get: makeRoute({
        tag: "Admin",
        summary: "Returns all admins",
        security: false,
        path: { id: "string" },
        success: {
            users: [simpleUser]
        },
        404: "No admins found",
    }),
}