import { makeRoute } from "@docs/helpers";

export const userRegister = {
    post: makeRoute({
        tag: "User",
        summary: "Registers a new user",
        security: false,
        required: ["username", "email", "password"],
        body: {
            username: "some_username",
            nickname: "some_nickname",
            email: "email@domain.com",
            password: "somepass",
            about: "some about section",
        },
        success: {
            id: "clpeceq9h000078m210txowen"
        },
        400: "Invalid name, email or password"
    })
}