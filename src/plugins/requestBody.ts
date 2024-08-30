import { User } from "@prisma/client"

export type Req<T> = Partial<T>
export type UserReq<T> = Partial<T> & { user: User }