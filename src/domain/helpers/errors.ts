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

    INVALID_TOKEN: () => badRequest("Invalid Token"),
    INVALID_NAME: () => badRequest("Invalid Name"),
    INVALID_EMAIL: () => badRequest("Invalid Email"),
    INVALID_PASSWORD: () => badRequest("Invalid Password"),
    INCORRECT_PASSWORD: () => badRequest("Incorrect Password"),
    MUST_INCLUDE_EMAIL_OR_USERNAME: () => badRequest("Must Include Email Or Username"),
    BANNED: () => forbidden("Banned"),
}