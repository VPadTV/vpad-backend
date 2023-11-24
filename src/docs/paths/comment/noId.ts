import { makeRoute } from "@docs/helpers";
import { dateExample } from "@docs/schemas/dateExample";
import { simpleUser } from "@docs/schemas/simpleUser";

export const commentNoId = {
  get: makeRoute({
    tag: "Comment",
    summary: "Returns many comments",
    security: false,
    query: {
      postId: "string",
      parentId: "string",
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
        childrenCount: 10,
        meta: {
          user: simpleUser,
          createdAt: dateExample,
          updatedAt: dateExample,
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