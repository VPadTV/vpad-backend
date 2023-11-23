import { makeRoute } from "@docs/helpers";

export const userId = {
  get: makeRoute({
    tag: "User",
    summary: "Returns user data from id, must be logged in",
    pathParameters: { id: "string" },
    success: {
      description: "User data",
      body: {
        username: "string",
        nickname: "string",
        email: "string",
        profilePhotoUrl: "string",
        about: "string",
        contact: "string",
        admin: "boolean",
      },
    },
    404: {
      description: "Not found",
      error: "Provided ID didnt resolve to any user"
    }
  }),
  put: makeRoute({
    tag: "User",
    summary: "Updates user from id, must be logged in",
    pathParameters: { id: "string" },
    body: {
      username: "string",
      nickname: "string",
      email: "string",
      password: "string",
      about: "string",
      profilePhotoBase64: "string",
    },
    success: {
      description: "User ID",
      body: {
        username: "string",
        nickname: "string",
        email: "string",
        profilePhotoUrl: "string",
        about: "string",
        contact: "string",
        admin: "boolean",
      },
    },
    404: {
      description: "Not found",
      error: "Provided ID didnt resolve to any user"
    }
  })
}