import { IRoute } from "@main/route";
import { UserRoute } from "../routes/user";
import { AdminRoute } from "@controllers/admin";
import { DocumentationRoute } from "@controllers/documentation";

export default {
  '/user': new UserRoute(),
  '/admin': new AdminRoute(),
  '/docs': new DocumentationRoute()
} as { [path: string]: IRoute }