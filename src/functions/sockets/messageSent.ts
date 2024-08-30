import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"

export type MessageSentRequest = Partial<{
    senderId: string
    receiverId: string
    content: string
}>

export async function messageSent(req: MessageSentRequest, db: DatabaseClient) {
    if (!req.senderId) throw Errors.MISSING_ID()
    if (!req.receiverId) throw Errors.MISSING_ID()
    if (!req.content) throw Errors.MISSING_MESSAGE()

    return await db.chatMessage.create({
        data: {
            senderId: req.senderId!,
            receiverId: req.receiverId!,
            content: req.content!,
        }
    })
}