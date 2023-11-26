import {
    makeRoute
} from "@docs/helpers";

export const postStreamKey = {
    get: makeRoute({
        tag: "Post",
        summary: "Streams video from key",
        security: false,
        path: { key: "6256145a90ace45f93cebe5fc3564608" },
        success: 'video',
        404: "Provided ID didnt resolve to any post",
    }),
}