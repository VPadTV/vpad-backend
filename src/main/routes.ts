import { IRoute } from "@main/route.js";
import { UserRoute } from "../routes/user.js";
import { AdminRoute } from "@controllers/admin.js";
import { DocumentationRoute } from "@controllers/documentation.js";
import { PostRoute } from "@controllers/post.js";
import { CommentRoute } from "@controllers/comment.js";

export default {
  '/user': new UserRoute(),
  '/admin': new AdminRoute(),
  '/docs': new DocumentationRoute(),
  '/post': new PostRoute(),
  '/comment': new CommentRoute(),
} as { [path: string]: IRoute }