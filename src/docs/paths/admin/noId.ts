import { makeRoute } from "@docs/helpers.js";
import { simpleUser } from "@docs/schemas/simpleUser.js";

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