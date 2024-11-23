import { HttpError, badRequest, Errors } from "@plugins/http"
import { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library"

export function handleError(error: unknown): HttpError {
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