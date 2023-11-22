import { Errors } from "@domain/helpers"
import { SimpleUser } from "@domain/helpers/mappers/user"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type CommentGetRequest = {
  user: User
  id: string
}

export type CommentGetResponse = {
  text: string
  meta: {
    user: SimpleUser
  }
}

export async function commentGet(req: CommentGetRequest, db: DatabaseClient): Promise<CommentGetResponse> {
  const comment = await db.comment.findFirst({
    where: { id: req.id },
    select: {
      text: true,
      updatedAt: true,
      user: { select: SimpleUser.selector }
    }
  })
  if (!comment) throw Errors.NOT_FOUND()

  return {
    text: comment.text,
    meta: { user: comment.user }
  }
}