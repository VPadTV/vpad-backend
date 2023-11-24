import { userRegister } from "./paths/user/register.ts";
import { userId } from "./paths/user/id.ts";
import { userLogin } from "./paths/user/login.ts";
import { postId } from "./paths/post/id.ts";
import { postNoId } from "./paths/post/noId.ts";
import { commentId } from "./paths/comment/id.ts";
import { commentNoId } from "./paths/comment/noId.ts";
import { adminNoId } from "./paths/admin/noId.ts";
import { adminId } from "./paths/admin/manage/adminId.ts";
import { adminBanId } from "./paths/admin/manage/banId.ts";

export default {
  openapi: "3.0.0",
  info: {
    title: "Indie Streaming App API",
    version: "0.0.1",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      },
    },
  },
  paths: {
    '/user/{id}': userId,
    '/user/login': userLogin,
    '/user/register': userRegister,
    '/post/{id}': postId,
    '/post': postNoId,
    '/comment/{id}': commentId,
    '/comment': commentNoId,
    '/admin': adminNoId,
    '/manage/admin/{id}': adminId,
    '/manage/ban/{id}': adminBanId,
  }
}