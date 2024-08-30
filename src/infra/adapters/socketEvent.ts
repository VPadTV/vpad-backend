import { badRequest, Errors, HttpError } from '@plugins/http'
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Socket } from 'socket.io';

export function socketEvent<T>(socket: Socket, fn: (params: Omit<T, 'senderId'>) => Promise<void>): (rawParams: any) => Promise<void> {
    return async (rawParams: any) => {
        try {
            await fn(rawParams)
        } catch (error) {
            console.error(`** Socket **`)
            console.error(error)
            const httpErr = handleError(error)
            if ('senderId' in rawParams) {
                socket.to(rawParams.senderId).emit('error', {
                    name: httpErr.name,
                    status: httpErr.status
                })
            }
        }
    }
}

function handleError(error: unknown): HttpError {
    if (error instanceof HttpError)
        return error

    else if (error instanceof PrismaClientKnownRequestError) {
        return badRequest(error.meta?.cause as string ?? error.name)
    }

    else if (error instanceof PrismaClientValidationError) {
        const match = /.*\n\n(.*)\.$/.exec(error.message)
        if (!match) return badRequest(error.name)
        return badRequest(match[1])
    }

    else if (error instanceof PrismaClientUnknownRequestError) {
        return badRequest(error.name)
    }

    return Errors.INTERNAL_SERVER_ERROR()
}