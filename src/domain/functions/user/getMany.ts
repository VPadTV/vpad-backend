import { Errors } from "@domain/helpers/index.js"
import { SimpleUser } from "@domain/helpers/mappers/user.js"
import { DatabaseClient } from "@infra/gateways/database.js"

export type UserGetManyRequest = {
  usernameSearch?: string
  nicknameSearch?: string
  banned?: boolean
}

export type UserGetManyResponse = { users: SimpleUser[] }

export async function userGetMany(req: UserGetManyRequest, db: DatabaseClient): Promise<UserGetManyResponse> {
  const users = await db.user.findMany({
    where: {
      username: req.usernameSearch ? {
        search: req.usernameSearch,
      } : undefined,
      nickname: req.nicknameSearch ? {
        search: req.nicknameSearch,
      } : undefined,
      banned: req.banned === true ? true : false,
    },
    select: {
      ...SimpleUser.selector,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if (!users || users.length === 0) throw Errors.NOT_FOUND()

  return { users }
}