import { Errors } from "@domain/helpers/index.js"
import { FileStorage } from "@infra/gateways/index.js"
import { DatabaseClient } from "@infra/gateways/database.js"
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