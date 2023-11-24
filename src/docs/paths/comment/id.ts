import { makeRoute } from "@docs/helpers.ts";
import { dateExample } from "@docs/schemas/dateExample.ts";
import { simpleUser } from "@docs/schemas/simpleUser.ts";

export const commentId = {
  get: makeRoute({
    tag: "Comment",
    summary: "Returns comment data from id",
    security: false,
    path: { id: "string" },
    success: {
      text: "string",
      childrenCount: 10,
      meta: {
        user: simpleUser,
        createdAt: dateExample,
        updatedAt: dateExample,
      },
    },
    404: "Provided ID didnt resolve to any comment",
  }),
  put: makeRoute({
    tag: "Comment",
    summary: "Updates comment from id, must be logged in",
    path: { id: "string" },
    body: {
      text: "string",
      updatedAt: dateExample,
    },
    404: "Provided ID didnt resolve to any comment",
  }),
  delete: makeRoute({
    tag: "Comment",
    summary: "Deletes a comment from id, must be logged in",
    path: { id: "string" },
    404: "Provided ID didnt resolve to any comment",
  })
}