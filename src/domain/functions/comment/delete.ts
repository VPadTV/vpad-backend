import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type CommentDeleteRequest = {
  user: User
  id: string
}

export type CommentDeleteResponse = {}

export async function commentDelete(req: CommentDeleteRequest, db: DatabaseClient): Promise<CommentDeleteResponse> {
  await db.$transaction(async (tx) => {
    const comment = await tx.comment.findFirst({ where: { id: req.id } })

    if (!comment) throw Errors.NOT_FOUND()

    await tx.comment.delete({
      where: { id: req.id },
    })
  })

  return {}
}