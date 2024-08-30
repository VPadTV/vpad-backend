import { Database } from '@infra/gateways'
import { openToken } from '@plugins/openToken'
import { Errors } from '@plugins/http'
import socketio from 'socket.io'
import { MessageSentRequest, messageSent } from '@functions/sockets/messageSent'
import { User } from '@prisma/client'
import { Req } from '@plugins/requestBody'
import { messageUpdated, MessageUpdateRequest } from '@functions/sockets/messageUpdated'
import { messageDeleted, MessageDeleteRequest } from '@functions/sockets/messageDeleted'
import { socketEvent } from '@infra/adapters/socketEvent'

// NOTE: change room ID from `user.id` to something unique and secure,
// possibly based on user id + socket id

export class SocketEvents {
    static register(io: socketio.Server) {
        const db = Database.get()
        let user: User | null

        io.on('connection', async socket => {
            // TODO: Test this shit later
            // const token = socket.handshake.auth.token
            // if (!token) return

            // const decoded = await openToken(token)
            // if (!decoded.user) throw Errors.UNAUTHORIZED()
            // user = decoded.user

            user = await db.user.findUnique({ where: { id: "clyacbq6t0000wei0j94ns1kj" } })
            if (!user) throw Errors.IM_A_TEAPOT()

            socket.join(user.id)

            socket.on('messageSent', socketEvent<MessageSentRequest>(socket, async params => {
                const message = await messageSent({
                    ...params,
                    senderId: user!.id,
                }, db)

                socket.to(params.receiverId!).emit('messageReceived', message)
            }))

            socket.on('messageUpdate', socketEvent<MessageUpdateRequest>(socket, async params => {
                const message = await messageUpdated({
                    ...params,
                    senderId: user!.id,
                }, db)

                socket.to(params.receiverId!).emit('messageUpdateReceived', message)
            }))

            socket.on('messageDelete', socketEvent<MessageDeleteRequest>(socket, async params => {
                const message = await messageDeleted({
                    ...params,
                    senderId: user!.id,
                }, db)

                socket.to(params.receiverId!).emit('messageDeleted', {
                    id: message.id
                })
            }))
        })
    }
}