import { makeRoute } from "@docs/helpers";

export const userLogin = {
    post: makeRoute({
        tag: "User",
        summary: "Logins as a user using email or username and a password",
        security: false,
        required: ["password"],
        body: {
            username: "some_username",
            email: "email@domain.com",
            password: "somepass",
        },
        success: {
            id: "clpeceq9h000078m210txowen",
            token: "string",
        },
        400: "Must include email or username, incorrect password",
        403: "Banned",
        404: "Not found",
    })
}