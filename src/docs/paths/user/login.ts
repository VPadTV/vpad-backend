import { makeRoute } from "@docs/helpers.js";

export const userLogin = {
  post: makeRoute({
    tag: "User",
    summary: "Logins as a user using email or username and a password",
    security: false,
    body: {
      email: "string",
      username: "string",
      password: "string"
    },
    success: {
      id: "string",
      token: "string",
    },
    400: "Must include email or username, incorrect password",
    403: "Banned",
    404: "Not found",
  })
}