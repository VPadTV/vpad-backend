import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"
import { validString } from "@domain/helpers/validString"
import { numify } from "@domain/helpers/numify"

export type VoteSetRequest = {
    user: User
    postId: string
    vote: number
}

export type VoteSetResponse = {}

export async function voteSet(req: VoteSetRequest, db: DatabaseClient): Promise<VoteSetResponse> {
    if (!req.postId && !validString(req.postId)) throw Errors.MISSING_ID()
    let vote = numify(req.vote) || 0
    if (vote < 0) vote = -1
    else if (vote > 0) vote = 1

    const postFound = await db.post.findFirst({ where: { id: req.postId } })
    if (!postFound) throw Errors.NOT_FOUND()

    await db.votes.upsert({
        where: {
            userId_postId: {
                userId: req.user.id,
                postId: req.postId,
            }
        },
        create: {
            userId: req.user.id,
            postId: req.postId,
            vote
        },
        update: {
            vote: vote
        }
    })

    return {}
}