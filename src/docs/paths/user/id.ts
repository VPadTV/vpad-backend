import { makeRoute } from "@docs/helpers.ts";

export const userId = {
  get: makeRoute({
    tag: "User",
    summary: "Returns user data from id, must be logged in",
    path: { id: "string" },
    success: {
      username: "string",
      nickname: "string",
      email: "string",
      profilePhotoUrl: "string",
      about: "string",
      contact: "string",
      admin: false,
    },
    404: "Provided ID didnt resolve to any user",
  }),
  put: makeRoute({
    tag: "User",
    summary: "Updates user from id, must be logged in",
    path: { id: "string" },
    body: {
      username: "string",
      nickname: "string",
      email: "string",
      password: "string",
      about: "string",
      profilePhotoBase64: "string",
    },
    success: {
      username: "string",
      nickname: "string",
      email: "string",
      profilePhotoUrl: "string",
      about: "string",
      contact: "string",
      admin: "boolean",
    },
    400: "Invalid username, nickname, email, password, or whatever",
    404: "Provided ID didnt resolve to any user",
  })
}