import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"

export type UserGetByIdRequest = {
  id: string
}

export type UserGetByIdResponse = {
  username: string
  nickname: string
  email: string
  profilePhotoUrl: string | null
  about: string | null
  contact: string | null
  admin: boolean
}

export async function userGet(req: UserGetByIdRequest, db: DatabaseClient): Promise<UserGetByIdResponse> {
  const user = await db.user.findFirst({ where: { id: req.id } })
  if (!user) {
    throw Errors.NOT_FOUND()
  }
  return {
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    profilePhotoUrl: user.profilePhotoUrl ?? null,
    about: user.about ?? null,
    contact: user.contact ?? null,
    admin: user.admin
  }
}