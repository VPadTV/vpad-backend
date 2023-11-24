import { SimpleUser } from "@domain/helpers/mappers/user.ts"
import { Paginate, paginate } from "@domain/helpers/paginate.ts"
import { DatabaseClient } from "@infra/gateways/database.ts"
import { User } from "@prisma/client"

export type CommentGetManyRequest = {
  user: User
  postId?: string
  parentId?: string
  sortBy: "latest" | "oldset" // TODO: Implement comment sorting

  page: number
  size: number
}

export type CommentGetManyResponse = Paginate<{
  id: string
  text: string
  childrenCount: number
  meta: {
    user: SimpleUser
    createdAt: string,
    updatedAt: string,
  }
}>

export async function commentGetMany(req: CommentGetManyRequest, db: DatabaseClient): Promise<CommentGetManyResponse> {
  const offset = (req.page - 1) * req.size

  const [comments, total] = await db.$transaction([
    db.comment.findMany({
      where: {
        postId: req.postId ?? undefined,
        parentId: req.parentId ?? undefined
      },
      select: {
        id: true,
        text: true,
        user: { select: SimpleUser.selector },
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { children: true }
        }
      }
    }),
    db.comment.count({
      where: {
        postId: req.postId ?? undefined,
        parentId: req.parentId ?? undefined
      }
    }),
  ])

  return paginate(total, req.page, offset, req.size, comments.map(comment => ({
    id: comment.id,
    text: comment.text,
    childrenCount: comment._count.children,
    meta: {
      user: comment.user,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }
  })))
}