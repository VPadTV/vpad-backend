import { Errors } from "@domain/helpers/index.js"
import { FileStorage } from "@infra/gateways/index.js"
import { DatabaseClient } from "@infra/gateways/database.js"
import { User } from "@prisma/client"

export type PostEditRequest = {
  user: User
  id: string
  text?: string
  mediaBase64?: string
  thumbBase64?: string
}

export type PostEditResponse = {}

export async function postEdit(req: PostEditRequest, db: DatabaseClient, storage: FileStorage): Promise<PostEditResponse> {
  let mediaUrl: string | undefined
  const post = await db.post.findFirst({ where: { id: req.id, userId: req.user.id } })

  if (!post) throw Errors.NOT_FOUND()

  // FIXME: if update fails, old video is still deleted
  if (req.mediaBase64) {
    if (post.mediaUrl)
      await storage.delete(post?.mediaUrl)
    mediaUrl = await storage.upload(req.mediaBase64)
  }

  // FIXME: if update fails, old thumbnail is still deleted
  if (req.thumbBase64) {
    if (post.thumbUrl)
      await storage.delete(post?.thumbUrl)
    mediaUrl = await storage.upload(req.thumbBase64)
  }

  await db.post.update({
    where: { id: req.id },
    data: {
      text: req.text ?? undefined,
      mediaUrl: mediaUrl,
    }
  })
  return {}
}