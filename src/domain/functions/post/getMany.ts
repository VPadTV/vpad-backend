import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostGetManyRequest = {
    user: User
    authorId: string
}

export type PostGetManyResponse = Paginate<{
    text: string
    mediaUrl?: string
    meta: {
        author: User
        votes: number
        myVote: number
    }
}>

export async function postGetMany(req: PostGetManyRequest, db: DatabaseClient): Promise<PostGetManyResponse> {
    const posts = await db.post.findMany({
        where: {
            userId: req.authorId
        },
        include: { user: true }
    })
    if (!posts || posts.length === 0) throw Errors.NOT_FOUND()

    return {
        total: 0,
        page: 0,
        size: 0,
        data: posts.map(post => ({
            text: post.text,
            mediaUrl: post.mediaUrl ?? undefined,
            meta: {
                author: post.user,
                votes: 0,
                myVote: 0,
            }
        }))
    }
}