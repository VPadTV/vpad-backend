import { makeRoute } from "@docs/helpers";
import { dateExample } from "@docs/schemas/dateExample";
import { simpleUser } from "@docs/schemas/simpleUser";

export const commentId = {
  get: makeRoute({
    tag: "Comment",
    summary: "Returns comment data from id",
    security: false,
    path: { id: "string" },
    success: {
      text: "string",
      children: {
        id: "string",
        text: "string",
        meta: { user: simpleUser }
      },
      meta: {
        user: simpleUser,
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