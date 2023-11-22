import { User } from "@prisma/client"

export type SimpleUser = {
  id: string
  username: string
  nickname: string
  profilePhotoUrl: string | null
}

export function simpleUser(user: User): SimpleUser {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    profilePhotoUrl: user.profilePhotoUrl,
  }
}