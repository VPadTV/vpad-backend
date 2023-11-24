import { userRegister } from "./paths/user/register";
import { userId } from "./paths/user/id";
import { userLogin } from "./paths/user/login";
import { postId } from "./paths/post/id";
import { postNoId } from "./paths/post/noId";
import { commentId } from "./paths/comment/id";
import { commentNoId } from "./paths/comment/noId";
import { adminNoId } from "./paths/admin/noId";
import { adminId } from "./paths/admin/manage/adminId";
import { adminBanId } from "./paths/admin/manage/banId";

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