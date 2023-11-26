import { makeRoute } from "@docs/helpers";

export const userRegister = {
    post: makeRoute({
        tag: "User",
        summary: "Registers a new user",
        security: false,
        body: {
            name: "string",
            email: "string",
            password: "string",
            about: "string",
        },
        success: {
            id: "clpeceq9h000078m210txowen"
        },
        400: "Invalid name, email or password"
    })
}