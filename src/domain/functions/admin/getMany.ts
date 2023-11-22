import { Errors } from "@domain/helpers"
import { Paginate, paginate } from "@domain/helpers/paginate"
import { SimpleUser, simpleUser } from "@domain/helpers/simple"
import { DatabaseClient } from "@infra/gateways/database"

export type AdminGetManyRequest = {
  page: number
  size: number
}

export type AdminGetManyResponse = Paginate<SimpleUser>

export async function adminGetMany(req: AdminGetManyRequest, db: DatabaseClient): Promise<AdminGetManyResponse> {
  const offset = (req.page - 1) * req.size
  const [users, total] = await db.$transaction([
    db.user.findMany({
      skip: offset,
      take: req.size,
      where: {
        admin: true
      },
      include: {
        _count: {
          select: {
            votes: true
          }
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    db.user.count({ where: { admin: true } }),
  ])

  if (!users || users.length === 0) throw Errors.NOT_FOUND()

  return paginate(total, req.page, offset, req.size, users.map(simpleUser))
}