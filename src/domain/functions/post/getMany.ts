import { Errors } from "@domain/helpers/index.js"
import { SimpleUser } from "@domain/helpers/mappers/user.js"
import { Paginate, paginate } from "@domain/helpers/paginate.js"
import { DatabaseClient } from "@infra/gateways/database.js"
import { User } from "@prisma/client"

export type PostGetManyRequest = {
  user: User
  userId?: string
  sortBy: "latest" | "oldest" | "high-views" | "low-views"
  titleSearch?: string

  page: number
  size: number
}

export type PostGetManyResponse = Paginate<{
  id: string
  title: string
  text: string
  thumbUrl?: string
  meta: {
    user: SimpleUser
    views: number
    createdAt: string
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
  const offset = (+req.page - 1) * +req.size
  const [posts, total] = await db.$transaction([
    db.post.findMany({
      skip: offset,
      take: +req.size,
      where: {
        userId: req.userId ?? undefined,
        title: req.titleSearch ? {
          search: req.titleSearch
        } : undefined,
      },
      select: {
        id: true,
        title: true,
        text: true,
        thumbUrl: true,
        user: { select: SimpleUser.selector },
        createdAt: true,
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
        userId: req.userId ?? undefined
      }
    }),
  ])

  if (!posts || posts.length === 0) throw Errors.NOT_FOUND()

  return paginate(total, +req.page, offset, +req.size, posts.map(post => ({
    id: post.id,
    title: post.title,
    text: post.text,
    thumbUrl: post.thumbUrl ?? undefined,
    meta: {
      user: post.user,
      views: post._count.votes,
      createdAt: post.createdAt.toISOString(),
    }
  })))
}