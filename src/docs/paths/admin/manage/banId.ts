import { makeRoute } from "@docs/helpers.ts";
import { dateExample } from "@docs/schemas/dateExample.ts"

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