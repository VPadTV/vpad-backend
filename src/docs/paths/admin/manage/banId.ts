import { makeRoute } from "@docs/helpers.js";
import { dateExample } from "@docs/schemas/dateExample.js"

export const adminBanId = {
  post: makeRoute({
    tag: "Admin",
    summary: "Manages a user ban",
    security: false,
    path: { id: "string" },
    body: {
      id: "string",
      banned: true,
      banTimeout: dateExample
    },
    success: {
      id: "string",
      banned: true,
      banTimeout: dateExample
    },
    400: "`banned` must be `true` or `false`",
  }),
}