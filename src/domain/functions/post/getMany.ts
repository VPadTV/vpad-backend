import { Errors } from "@domain/helpers"
import { Paginate, paginate } from "@domain/helpers/paginate"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostGetManyRequest = {
  user: User
  authorId?: string
  sortBy: "latest" | "oldest" | "high-views" | "low-views"
  page: number
  size: number
}

export type PostGetManyResponse = Paginate<{
  text: string
  thumbUrl?: string
  meta: {
    author: User
    views: number
  }
}>

export type PostSort = {
  createdAt: "asc" | "desc"
} | {
  votes: {
    _count: "asc" | "desc"
  }
}

export async function postGetMany(req: PostGetManyRequest, db: DatabaseClient): Promise<PostGetManyResponse> {
  let orderBy: PostSort
  switch (req.sortBy) {
    case "latest":
      orderBy = { createdAt: "desc" }
      break
    case "oldest":
      orderBy = { createdAt: "asc" }
      break
    case "high-views":
      orderBy = { votes: { _count: "desc" } }
      break
    case "low-views":
      orderBy = { votes: { _count: "asc" } }
      break
  }
  const offset = (req.page - 1) * req.size
  const [posts, total] = await db.$transaction([
    db.post.findMany({
      skip: offset,
      take: req.size,
      where: {
        userId: req.authorId ?? undefined
      },
      select: {
        text: true,
        thumbUrl: true,
        user: true,
        _count: {
          select: {
            votes: true
          }
        },
      },
      orderBy
    }),
    db.post.count({
      where: {
        userId: req.authorId ?? undefined
      }
    }),
  ])

  if (!posts || posts.length === 0) throw Errors.NOT_FOUND()

  return paginate(total, req.page, offset, req.size, posts.map(post => ({
    text: post.text,
    thumbUrl: post.thumbUrl ?? undefined,
    meta: {
      author: post.user,
      views: post._count.votes,
    }
  })))
}