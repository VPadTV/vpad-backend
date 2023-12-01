import { BodyFile, ContentType, makeRoute } from "@docs/helpers";
import { exId } from "@docs/schemas/id";
import { simpleUser } from "@docs/schemas/simpleUser";

export const postNoId = {
    post: makeRoute({
        tag: "Post",
        summary: "Creates a new post",
        contentType: ContentType.MULTIPART,
        bodyRequired: ["title", "text", "media", "tags"],
        body: {
            title: "some title",
            text: "some text",
            media: BodyFile,
            thumb: BodyFile,
            nsfw: false,
            tags: 'some,tags',
            minTierId: exId,
        },
        success: {
            id: exId
        }
    }),
    get: makeRoute({
        tag: "Post",
        summary: "Gets many posts",
        query: {
            userTierId: exId,
            creatorId: exId,
            sortBy: "latest | oldest | high-views | low-views",
            search: "search terms",
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
                id: exId,
                text: "some text",
                thumbUrl: "string",
                meta: {
                    nsfw: false,
                    tags: ['some', 'tags'],
                    minTierId: exId,
                    user: simpleUser,
                    views: 1000
                }
            }
        },
        404: "No posts found",
    })
}