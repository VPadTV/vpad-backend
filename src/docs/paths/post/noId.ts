import { BodyFile, ContentType, makeRoute } from "@docs/helpers";
import { simpleUser } from "@docs/schemas/simpleUser";

export const postNoId = {
    get: makeRoute({
        tag: "Post",
        summary: "Gets many posts",
        security: false,
        query: {
            userTierId: "clpeceq9h000078m210txowen",
            creatorId: "clpeceq9h000078m210txowen",
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
                id: "clpeceq9h000078m210txowen",
                text: "some text",
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
        contentType: ContentType.MULTIPART,
        required: ["title", "text", "media"],
        body: {
            title: "some title",
            text: "some text",
            media: BodyFile,
            thumb: BodyFile,
        },
        success: {
            id: "clpeceq9h000078m210txowen"
        }
    })
}