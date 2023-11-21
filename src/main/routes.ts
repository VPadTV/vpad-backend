import { IRoute } from "@main/route";
import { UserRoute } from "../routes/user";
import { AdminRoute } from "@controllers/admin";

export default {
    '/user': new UserRoute(),
    '/admin': new AdminRoute(),
  } as {[path: string]: IRoute}