import { DatabaseClient } from "@infra/gateways"
import { Errors } from "@plugins/http"
import { validString } from "@plugins/validString"
import { ChatMessage } from "@prisma/client"

export type MessageUpdateRequest = Partial<{
    senderId: string
    id: string
    receiverId: string
    content?: string
    seen?: boolean
}>

export async function messageUpdated(req: MessageUpdateRequest, db: DatabaseClient): Promise<ChatMessage> {
    if (!req.id) throw Errors.MISSING_ID()
    if (!req.senderId) throw Errors.MISSING_ID()
    if (!req.receiverId) throw Errors.MISSING_ID()

    let msg = validString(req.content)
    let wasEdited = Boolean(msg && msg.length)

    return await db.chatMessage.update({
        where: {
            id: req.id!,
            senderId: req.senderId!,
            receiverId: req.receiverId!,
        },
        data: {
            seen: req.seen ?? true,
            content: msg,
            edited: wasEdited,
        }
    })
}