import { IRoute } from "@main/route";
import { UserRoute } from "../routes/user";
import { AdminRoute } from "@controllers/admin";
import { DocumentationRoute } from "@controllers/documentation";
import { PostRoute } from "@controllers/post";
import { CommentRoute } from "@controllers/comment";

export default {
    '/user': new UserRoute(),
    '/admin': new AdminRoute(),
    '/docs': new DocumentationRoute(),
    '/post': new PostRoute(),
    '/comment': new CommentRoute(),
} as { [path: string]: IRoute }