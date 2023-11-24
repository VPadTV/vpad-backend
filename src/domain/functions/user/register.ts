import { Errors } from "@domain/helpers/index.js"
import { emailRegex, nameRegex, passwordRegex } from "@domain/helpers/regex.js"
import { DatabaseClient } from "@infra/gateways/database.js"
import bcrypt from "bcrypt"

export type UserRegisterRequest = {
  name: string
  email: string
  password: string
  about?: string
}

export type UserRegisterResponse = {
  id: string
}

export async function userRegister(req: UserRegisterRequest, db: DatabaseClient): Promise<UserRegisterResponse> {
  if (!nameRegex().test(req.name)) {
    throw Errors.INVALID_NAME()
  }
  if (!emailRegex().test(req.email)) {
    throw Errors.INVALID_EMAIL()
  }
  if (!passwordRegex().test(req.password)) {
    throw Errors.INVALID_PASSWORD()
  }

  const user = await db.user.create({
    data: {
      username: req.name,
      nickname: req.name,
      email: req.email,
      about: req.about ? req.about : undefined,
      password: await bcrypt.hash(req.password, 10)
    }
  })
  return { id: user.id }
}