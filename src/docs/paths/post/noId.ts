import { makeRoute } from "@docs/helpers.js";
import { simpleUser } from "@docs/schemas/simpleUser.js";

export const postNoId = {
  get: makeRoute({
    tag: "Post",
    summary: "Gets many posts",
    security: false,
    query: {
      userId: "string",
      sortBy: "latest | oldest | high-views | low-views",
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
        thumbUrl: "string",
        meta: {
          user: simpleUser,
          views: 1000
        }
      }
    },
    404: "No posts found",
  }),
  post: makeRoute({
    tag: "Post",
    summary: "Creates a new post",
    body: {
      text: "string",
      mediaBase64: "string",
      thumbBase64: "string",
    },
    success: {
      id: "string"
    }
  })
}