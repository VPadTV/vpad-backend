import { Errors } from "@domain/helpers/index.ts"
import { DatabaseClient } from "@infra/gateways/database.ts"
import { User } from "@prisma/client"

export type CommentDeleteRequest = {
  user: User
  id: string
}

export type CommentDeleteResponse = {}

export async function commentDelete(req: CommentDeleteRequest, db: DatabaseClient): Promise<CommentDeleteResponse> {
  const comment = await db.comment.delete({
    where: { id: req.id, userId: req.user.id },
  })

  if (!comment) throw Errors.NOT_FOUND()

  return {}
}