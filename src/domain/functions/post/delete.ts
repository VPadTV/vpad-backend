import { Errors } from "@domain/helpers/index.ts"
import { FileStorage } from "@infra/gateways/index.ts"
import { DatabaseClient } from "@infra/gateways/database.ts"
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