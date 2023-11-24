import { makeRoute } from "@docs/helpers.ts";

export const adminId = {
  post: makeRoute({
    tag: "Admin",
    summary: "Manages admins",
    security: false,
    path: { id: "string" },
    body: {
      id: "string",
      admin: true,
    },
    success: {
      id: "string",
      admin: true
    },
    400: "`admin` must be `true` or `false`",
  }),
}