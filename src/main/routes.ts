import { IRoute } from "@main/route";
import { UserRoute } from "../routes/user";

export default {
    '/user': new UserRoute(),
  } as {[path: string]: IRoute}