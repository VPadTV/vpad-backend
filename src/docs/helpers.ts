export type SwaggerParameter = {
  name: string
  in: "query" | "path"
  schema: { type: string, example?: string | number }
}

export type SwaggerObject = {
  [name: string]: {
    type: string,
    example?: SwaggerDefinitions
    properties?: SwaggerObject
    items?: {
      type: 'object',
      properties: SwaggerObject
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

export type Parameters = {
  [name: string]: string | number
}

type SwaggerDefinitions = string | number | boolean

export type Body = {
  [name: string]: SwaggerDefinitions | Body | [Body]
}

export type GenerateRoute = {
  tag: string
  summary: string
  path?: Parameters
  query?: Parameters
  body?: Body
  success?: Body
  security?: boolean
  [error: number]: string
}

export const makeObject = (args?: Body) => {
  if (!args) return undefined

  let swb: SwaggerObject = {}
  for (const name in args) {
    const value = args[name]
    if (Array.isArray(value))
      swb[name] = {
        type: 'array',
        items: {
          type: 'object',
          properties: obj(value[0]),
        }
      }
    else if (typeof value === 'object')
      swb[name] = {
        type: 'object',
        properties: obj(value as Body)
      }
    else
      swb[name] = {
        type: typeof value,
        example: value
      }
  }
  return swb
}

export const obj = (args: Body) => {
  return makeObject(args)!
}

const makeParameters = (type: "query" | "path", args?: Parameters) => {
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
  const { tag, summary, path: pathParameters, query: queryParameters, body: body, success, security = true, ...errors } = args

  let swParams: SwaggerParameter[] = []
  const swPath = makeParameters("path", pathParameters)
  if (swPath) swParams.push(...swPath)
  const swQuery = makeParameters("query", queryParameters) ?? []
  if (swQuery) swParams.push(...swQuery)

  const swBody = makeObject(body)

  const swSuccess = makeObject(success)

  const swErrors = makeErrors(errors) ?? {}

  return {
    security: security === true ? [{ bearerAuth: [] }] : undefined,
    tags: [tag],
    summary,
    parameters: swParams.length ? swParams : undefined,
    requestBody: swBody ? {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: swBody
          }
        }
      }
    } : undefined,
    responses: {
      200: {
        description: success?.description,
        content: {
          'application/json': {
            schema: swSuccess ? {
              type: 'object',
              properties: {
                token: security ? {
                  type: "string",
                  example: "refreshed token",
                } : undefined, ...swSuccess
              }
            } : undefined
          }
        }
      },
      ...swErrors
    }
  }
}