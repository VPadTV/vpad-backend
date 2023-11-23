import { Errors } from "@domain/helpers"
import { FileStorage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostDeleteRequest = {
  user: User
  id: string
}

export type PostDeleteResponse = {}

export async function postDelete(req: PostDeleteRequest, db: DatabaseClient, storage: FileStorage): Promise<PostDeleteResponse> {
  const post = await db.post.delete({
    where: { id: req.id, userId: req.user.id }
  })

  if (!post)
    throw Errors.NOT_FOUND()

  if (post.mediaUrl)
    await storage.delete(post.mediaUrl)

  return {}
}