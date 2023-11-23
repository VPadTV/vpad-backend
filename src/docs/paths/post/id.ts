import { makeRoute } from "@docs/helpers";
import { simpleUser } from "@docs/schemas/simpleUser";

export const postId = {
  get: makeRoute({
    tag: "Post",
    summary: "Returns post data from id",
    security: false,
    path: { id: "string" },
    success: {
      text: "string",
      mediaUrl: "string",
      thumbUrl: "string",
      meta: {
        user: simpleUser,
        likes: 10,
        dislikes: 20,
        views: 40,
        myVote: 1,
      },
    },
    404: "Provided ID didnt resolve to any post",
  }),
  put: makeRoute({
    tag: "Post",
    summary: "Updates post from id, must be logged in",
    path: { id: "string" },
    body: {
      text: "string",
      mediaBase64: "string",
      thumbBase64: "string",
    },
    404: "Provided ID didnt resolve to any post",
  }),
  delete: makeRoute({
    tag: "Post",
    summary: "Deletes a post from id, must be logged in",
    path: { id: "string" },
    404: "Provided ID didnt resolve to any post",
  })
}