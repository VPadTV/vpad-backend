import { FileStorage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostCreateRequest = {
  user: User
  text: string
  mediaBase64: string
  thumbBase64?: string
}

export type PostCreateResponse = {
  id: string
}

export async function postCreate(req: PostCreateRequest, db: DatabaseClient, storage: FileStorage): Promise<PostCreateResponse> {
  console.log(req.user)
  const mediaUrl = await storage.upload(req.mediaBase64)
  let thumbUrl: string | undefined
  if (req.thumbBase64)
    thumbUrl = await storage.upload(req.mediaBase64)
  else
    thumbUrl = "generated thumbnail" // TODO
  const post = await db.post.create({
    data: {
      userId: req.user.id,
      text: req.text,
      mediaUrl,
      thumbUrl,
    }
  })
  return { id: post.id }
}