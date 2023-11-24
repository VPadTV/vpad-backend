import { Errors } from "@domain/helpers/index.ts"
import { emailRegex, nameRegex, passwordRegex } from "@domain/helpers/regex.ts"
import { DatabaseClient } from "@infra/gateways/database.ts"
import { FileStorage } from "@infra/gateways/storage.ts"
import bcrypt from "bcrypt"

export type UserEditRequest = {
  id: string
  username?: string
  nickname?: string
  email?: string
  password?: string
  profilePhotoBase64?: string
}

export type UserEditResponse = {
  id: string
}

export async function userEdit(req: UserEditRequest, db: DatabaseClient, storage: FileStorage): Promise<UserEditResponse> {
  if (req.username && !nameRegex().test(req.username)) {
    throw Errors.INVALID_NAME()
  }
  if (req.nickname && !nameRegex().test(req.nickname)) {
    throw Errors.INVALID_NAME()
  }
  if (req.email) {
    if (!emailRegex().test(req.email)) {
      throw Errors.INVALID_EMAIL()
    }
  }
  if (req.password) {
    if (!passwordRegex().test(req.password)) {
      throw Errors.INVALID_PASSWORD()
    }
  }
  let profilePhotoUrl: string | undefined = undefined
  if (req.profilePhotoBase64) {
    profilePhotoUrl = await storage.upload(req.profilePhotoBase64)
  }

  const user = await db.user.update(
    {
      where: { id: req.id },
      data: {
        username: req.username,
        nickname: req.nickname,
        email: req.email,
        password: req.password && await bcrypt.hash(req.password, 10),
        profilePhotoUrl: profilePhotoUrl
      }
    })
  return { id: user.id }
}