import { BodyFile, ContentType, makeRoute } from "@docs/helpers";

export const userId = {
    get: makeRoute({
        tag: "User",
        summary: "Returns user data from id, must be logged in",
        path: { id: "clpeceq9h000078m210txowen" },
        success: {
            username: "some_username",
            nickname: "some_nickname",
            email: "email@domain.com",
            profilePhotoUrl: "https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/ieopqwieqpop.jpg",
            about: "some about me, or nothing",
            contact: "some contact info",
            admin: false,
        },
        404: "Provided ID didnt resolve to any user",
    }),
    put: makeRoute({
        tag: "User",
        summary: "Updates user from id, must be logged in",
        path: { id: "clpeceq9h000078m210txowen" },
        contentType: ContentType.MULTIPART,
        body: {
            username: "some_username",
            nickname: "some_nickname",
            email: "email@domain.com",
            password: "somepass",
            about: "some about me, or nothing",
            profilePhoto: BodyFile,
        },
        400: "Invalid username, nickname, email, password, or whatever",
        404: "Provided ID didnt resolve to any user",
    })
}