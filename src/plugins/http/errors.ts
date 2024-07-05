export class HttpError extends Error {
    status: number
    constructor(message: string, status?: number) {
        super(message)
        this.status = status ?? 500
    }
}

export const badRequest = (message: string): HttpError => new HttpError(message, 400)
export const unauthorized = (message: string): HttpError => new HttpError(message, 401)
export const forbidden = (message: string): HttpError => new HttpError(message, 403)
export const notFound = (message: string): HttpError => new HttpError(message, 404)
export const imATeapot = (message: string): HttpError => new HttpError(message, 418)

export const serverError = (message: string): HttpError => new HttpError(message, 500)


export const Errors = {
    MISSING_TOKEN: () => unauthorized("MISSING_TOKEN"),
    UNAUTHORIZED: () => unauthorized("UNAUTHORIZED"),
    EXPIRED_TOKEN: () => unauthorized("EXPIRED_TOKEN"),
    FORBIDDEN: () => forbidden("FORBIDDEN"),
    NOT_FOUND: () => notFound("NOT_FOUND"),
    IM_A_TEAPOT: () => imATeapot("IM_A_TEAPOT"),
    BAD_REQUEST: () => badRequest("BAD_REQUEST"),
    FAILED_TO_DOWNLOAD: () => badRequest("FAILED_TO_DOWNLOAD"),
    FAILED_TO_UPDATE: () => badRequest("FAILED_TO_UPDATE"),

    LOW_TIER: () => badRequest("LOW_TIER"),

    INVALID_TOKEN: () => badRequest("INVALID_TOKEN"),
    INVALID_ID: () => badRequest("INVALID_ID"),
    INVALID_USERNAME: () => badRequest("INVALID_USERNAME"),
    USERNAME_ALREADY_EXISTS: () => badRequest("USERNAME_ALREADY_EXISTS"),
    INVALID_NICKNAME: () => badRequest("INVALID_NICKNAME"),
    INVALID_EMAIL: () => badRequest("INVALID_EMAIL"),
    INVALID_PASSWORD: () => badRequest("INVALID_PASSWORD"),
    INVALID_FILE: () => badRequest("INVALID_FILE"),
    INVALID_TAGS: () => badRequest("INVALID_TAGS"),
    INVALID_PRICE: () => badRequest("INVALID_PRICE"),
    INVALID_THUMB: () => badRequest("INVALID_THUMB"),
    INVALID_SORT: () => badRequest("INVALID_SORT"),
    INVALID_TIER: () => badRequest("INVALID_TIER"),
    INVALID_TAKE: () => badRequest("INVALID_TAKE"),
    NO_ACCOUNT: () => badRequest("NO_ACCOUNT"),

    INCORRECT_PASSWORD: () => badRequest("INCORRECT_PASSWORD"),

    MISSING_EMAIL_OR_USERNAME: () => badRequest("MISSING_EMAIL_OR_USERNAME"),
    MISSING_TITLE: () => badRequest("MISSING_TITLE"),
    MISSING_TEXT: () => badRequest("MISSING_TEXT"),
    MISSING_TAGS: () => badRequest("MISSING_TAGS"),
    MISSING_MEDIA: () => badRequest("MISSING_MEDIA"),
    MISSING_ID: () => badRequest("MISSING_ID"),
    MISSING_ADMIN: () => badRequest("BAD_REQUEST"),
    MISSING_USERNAME: () => badRequest("MISSING_USERNAME"),
    MISSING_NAME: () => badRequest("MISSING_NAME"),
    MISSING_PRICE: () => badRequest("MISSING_PRICE"),
    MISSING_EMAIL: () => badRequest("MISSING_EMAIL"),
    MISSING_PASSWORD: () => badRequest("MISSING_PASSWORD"),
    MISSING_VOTE: () => badRequest("MISSING_VOTE"),
    MISSING_DETAILS: () => badRequest("MISSING_DETAILS"),
    MISSING_CREATOR: () => badRequest("MISSING_CREATOR"),

    BANNED: () => forbidden("BANNED"),

    INTERNAL_SERVER_ERROR: () => serverError("INTERNAL_SERVER_ERROR")
}