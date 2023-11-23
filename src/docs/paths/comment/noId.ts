import { makeRoute } from "@docs/helpers";
import { simpleUser } from "@docs/schemas/simpleUser";

export const commentNoId = {
  get: makeRoute({
    tag: "Comment",
    summary: "Gets many comments",
    security: false,
    query: {
      postId: "string",
      sortBy: "latest | oldest",
      page: 1,
      size: 30,
    },
    success: {
      total: 100,
      to: 30,
      from: 0,
      currentPage: 1,
      lastPage: 4,
      data: {
        id: "string",
        text: "string",
        meta: {
          user: simpleUser
        }
      }
    },
    404: "No comments found",
  }),
  post: makeRoute({
    tag: "Comment",
    summary: "Creates a new comment",
    body: {
      postId: "string",
      parentId: "string",
      text: "string",
    },
    success: {
      id: "string"
    }
  })
}