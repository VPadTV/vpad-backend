import { User } from "@prisma/client"

export type TokenMiddlewareResponse = {
    user: User,
    token?: string
}