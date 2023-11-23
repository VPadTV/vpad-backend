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
  children: {
    id: string
    text: string
    meta: { user: SimpleUser }
  }[]
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
      user: { select: SimpleUser.selector },
      children: {
        select: {
          id: true,
          text: true,
          user: { select: SimpleUser.selector },
          children: {
            select: {
              id: true,
              text: true,
              user: { select: SimpleUser.selector },
            }
          }
        }
      }
    }
  })
  if (!comment) throw Errors.NOT_FOUND()

  return {
    text: comment.text,
    children: comment.children.map(comment => ({
      id: comment.id,
      text: comment.text,
      meta: { user: comment.user }
    })),
    meta: { user: comment.user }
  }
}