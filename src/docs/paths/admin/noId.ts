import { makeRoute } from "@docs/helpers.ts";
import { simpleUser } from "@docs/schemas/simpleUser.ts";

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