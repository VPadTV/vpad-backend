import { User } from "@prisma/client"

export type HttpReq<T> = Partial<T>
export type UserHttpReq<T> = Partial<T> & { user: User }