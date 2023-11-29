import { Body } from "@docs/helpers";
import { exId } from "./id";

export const simpleUser: Body = {
    id: exId,
    nickname: "string",
    profilePhotoUrl: "string",
}