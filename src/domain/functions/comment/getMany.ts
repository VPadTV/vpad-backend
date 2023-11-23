import { SimpleUser } from "@domain/helpers/mappers/user"
import { Paginate, paginate } from "@domain/helpers/paginate"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type CommentGetManyRequest = {
  user: User
  postId: string

  page: number
  size: number
}

export type CommentGetManyResponse = Paginate<{
  id: string
  text: string
  meta: {
    user: SimpleUser
  }
}>

export async function commentGetMany(req: CommentGetManyRequest, db: DatabaseClient): Promise<CommentGetManyResponse> {
  const offset = (req.page - 1) * req.size

  const [comments, total] = await db.$transaction([
    db.comment.findMany({
      where: { postId: req.postId },
      select: {
        id: true,
        text: true,
        updatedAt: true,
        user: { select: SimpleUser.selector },
      }
    }),
    db.comment.count({
      where: { postId: req.postId }
    }),
  ])

  return paginate(total, req.page, offset, req.size, comments.map(comment => ({
    id: comment.id,
    text: comment.text,
    meta: {
      user: comment.user
    }
  })))
}