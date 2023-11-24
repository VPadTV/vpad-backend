import { IRoute } from "@main/route.ts";
import { UserRoute } from "../routes/user.ts";
import { AdminRoute } from "@controllers/admin.ts";
import { DocumentationRoute } from "@controllers/documentation.ts";
import { PostRoute } from "@controllers/post.ts";
import { CommentRoute } from "@controllers/comment.ts";

export default {
  '/user': new UserRoute(),
  '/admin': new AdminRoute(),
  '/docs': new DocumentationRoute(),
  '/post': new PostRoute(),
  '/comment': new CommentRoute(),
} as { [path: string]: IRoute }