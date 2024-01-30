export class HttpError extends Error {
    code: number
    constructor(message: string, code?: number) {
        super(message)
        this.code = code ?? 500
    }
}

export const badRequest = (message: string): HttpError => new HttpError(message, 400)
export const unauthorized = (message: string): HttpError => new HttpError(message, 401)
export const forbidden = (message: string): HttpError => new HttpError(message, 403)
export const notFound = (message: string): HttpError => new HttpError(message, 404)
export const imATeapot = (message: string): HttpError => new HttpError(message, 418)

export const Errors = {
    MISSING_TOKEN: () => unauthorized("Missing Token"),
    UNAUTHORIZED: () => unauthorized("Unauthorized"),
    EXPIRED_TOKEN: () => unauthorized("Expired Token"),
    FORBIDDEN: () => forbidden("Forbidden"),
    NOT_FOUND: () => notFound("Not Found"),
    IM_A_TEAPOT: () => imATeapot("I'm A Teapot!"),
    BAD_REQUEST: () => badRequest("Bad Request"),
    FAILED_TO_DOWNLOAD: () => badRequest("Failed to download from URL"),

    LOW_TIER: () => badRequest("Subscription tier too low"),

    INVALID_TOKEN: () => badRequest("Invalid Token"),
    INVALID_USERNAME: () => badRequest("Invalid Username"),
    INVALID_NICKNAME: () => badRequest("Invalid Nickname"),
    INVALID_EMAIL: () => badRequest("Invalid Email"),
    INVALID_PASSWORD: () => badRequest("Invalid Password"),
    INVALID_FILE: () => badRequest("Invalid File"),
    INVALID_TAGS: () => badRequest("Bad Tags"),
    INVALID_PRICE: () => badRequest("Invalid price"),
    INVALID_THUMB: () => badRequest("Invalid thumbnail"),
    INVALID_SORT: () => badRequest("Invalid sort"),
    INVALID_TIER: () => badRequest("Invalid tier"),
    CANT_BE_PAID_AND_COLLABORATION: () => badRequest("Post can't be both paid and collaborative"),

    INCORRECT_PASSWORD: () => badRequest("Incorrect Password"),

    MISSING_EMAIL_OR_USERNAME: () => badRequest("Missing Email Or Username"),
    MISSING_TITLE: () => badRequest("Missing title"),
    MISSING_TEXT: () => badRequest("Missing text"),
    MISSING_MEDIA: () => badRequest("Missing media"),
    MISSING_ID: () => badRequest("Missing ID"),
    MISSING_ADMIN: () => badRequest("Missing admin (must be true or false)"),
    MISSING_USERNAME: () => badRequest("Missing username"),
    MISSING_NAME: () => badRequest("Missing name"),
    MISSING_PRICE: () => badRequest("Missing price"),
    MISSING_EMAIL: () => badRequest("Missing email"),
    MISSING_PASSWORD: () => badRequest("Missing password"),
    MISSING_VOTE: () => badRequest("Missing vote"),

    BANNED: () => forbidden("Banned"),
}