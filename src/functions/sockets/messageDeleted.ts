import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { ChatMessage } from "@prisma/client"

export type MessageDeleteRequest = Partial<{
    senderId: string
    id: string
    receiverId: string
}>

export async function messageDeleted(req: MessageDeleteRequest, db: DatabaseClient): Promise<ChatMessage> {
    if (!req.id) throw Errors.MISSING_ID()
    if (!req.senderId) throw Errors.MISSING_ID()
    if (!req.receiverId) throw Errors.MISSING_ID()

    return await db.chatMessage.delete({
        where: {
            id: req.id!,
            senderId: req.senderId!,
            receiverId: req.receiverId!,
        }
    })
}