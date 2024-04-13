export type SwaggerParameter = {
    name: string
    in: 'query' | 'path'
    schema: { type: string, example?: string | number }
}

export type SwaggerObject = {
    [name: string]: {
        type: string,
        example?: SwaggerDefinitions
        properties?: SwaggerObject
        format?: string
        items?: {
            type: 'object',
            properties: SwaggerObject
        } | {
            type: string,
            example: SwaggerDefinitions
        }
    }
}
export type SwaggerError = {
    [code: number]: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: string
                        }
                    }
                }
            }
        }
    }
}

export const BodyFile = '__bodyfile__'

export type Parameters = {
    [name: string]: string | number
}

type SwaggerDefinitions = string | number | boolean

export type Body = {
    [name: string]: SwaggerDefinitions | Body | SwaggerDefinitions[] | [Body]
}

export enum ContentType {
    FORM = 'application/x-www-form-urlencoded',
    MULTIPART = 'multipart/form-data',
}

export type GenerateRoute = {
    tag: string
    summary: string
    path?: Parameters
    query?: Parameters
    contentType?: ContentType
    bodyRequired?: string[]
    body?: Body
    success?: Body | 'video'
    security?: boolean
    [error: number]: string
}

const makeObject = (args?: Body) => {
    if (!args) return undefined

    let swb: SwaggerObject = {}
    for (const name in args) {
        const value = args[name]
        if (Array.isArray(value)) {
            let arrValue = value[0]
            if (typeof arrValue === 'object') {
                swb[name] = {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: makeObject(arrValue)!
                    }
                }
            } else {
                swb[name] = {
                    type: 'array',
                    items: {
                        type: typeof arrValue,
                        example: arrValue
                    }
                }
            }
        }
        else if (typeof value === 'object')
            swb[name] = {
                type: 'object',
                properties: makeObject(value)!
            }
        else if (value === BodyFile)
            swb[name] = {
                type: 'string',
                format: 'binary'
            }
        else
            swb[name] = {
                type: typeof value,
                example: value
            }
    }
    return swb
}

const makeParameters = (type: 'query' | 'path', args?: Parameters) => {
    if (!args) return undefined;

    let swp: SwaggerParameter[] = []
    for (const name in args) {
        const value = args[name]
        swp.push({
            name,
            in: type,
            schema: {
                type: typeof value,
                example: value
            }
        })
    }
    return swp
}

const makeErrors = (errors?: { [error: number]: string }) => {
    if (!errors) return undefined;

    let swe: SwaggerError = {}
    for (const code in errors) {
        const value = errors[code]
        swe[code] = {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: value
                            }
                        }
                    }
                }
            }
        }
    }
    return swe
}

export const makeRoute = (args: GenerateRoute) => {
    const { tag, summary, path: pathParameters, query: queryParameters, body, contentType, success, bodyRequired = [], security = true, ...errors } = args

    let swParams: SwaggerParameter[] = []
    const swPath = makeParameters('path', pathParameters)
    if (swPath) swParams.push(...swPath)
    const swQuery = makeParameters('query', queryParameters) ?? []
    if (swQuery) swParams.push(...swQuery)

    const swBody = makeObject(body)

    let swSuccess: any
    if (success === 'video') {
        swSuccess = {
            description: 'video',
            content: {
                'video/mp4': {
                    schema: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }
    } else {
        const successObj = makeObject(success)
        swSuccess = {
            description: success?.description,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            token: security ? {
                                type: 'string',
                                example: 'refreshed token',
                            } : undefined, ...successObj
                        }
                    }
                }
            }
        }
    }

    const swErrors = makeErrors(errors) ?? {}

    return {
        security: security === true ? [{ bearerAuth: [] }] : undefined,
        tags: [tag],
        summary,
        parameters: swParams.length ? swParams : undefined,
        requestBody: swBody ? {
            required: true,
            content: {
                [contentType ?? ContentType.FORM]: {
                    schema: {
                        type: 'object',
                        required: bodyRequired,
                        properties: swBody
                    }
                }
            }
        } : undefined,
        responses: {
            200: swSuccess,
            ...swErrors,
        }
    }
}