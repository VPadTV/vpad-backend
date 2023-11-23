import { userRegister } from "@domain/functions/user/register";
import { userId } from "./paths/user/id";
import { userLogin } from "./paths/user/login";
import { postId } from "./paths/post/id";
import { postNoId } from "./paths/post/noId";

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
  }
}