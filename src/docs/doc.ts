import { userRegister } from "./paths/user/register.js";
import { userId } from "./paths/user/id.js";
import { userLogin } from "./paths/user/login.js";
import { postId } from "./paths/post/id.js";
import { postNoId } from "./paths/post/noId.js";
import { commentId } from "./paths/comment/id.js";
import { commentNoId } from "./paths/comment/noId.js";
import { adminNoId } from "./paths/admin/noId.js";
import { adminId } from "./paths/admin/manage/adminId.js";
import { adminBanId } from "./paths/admin/manage/banId.js";

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