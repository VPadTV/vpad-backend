export type SwaggerParameter = {
  name: string
  in: "query" | "path"
  schema: { type: "string" | "number", example?: string | number }
}

export type SwaggerObject = {
  [name: string]: {
    type: string,
    example?: SwaggerDefinitions
    properties?: SwaggerObject
  }
}
export type SwaggerError = {
  [code: number]: {
    description: string
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
  [name: string]: ("string" | "number") | ["string" | "number", string | number]
}

type SwaggerTypes = "string" | "number" | "boolean" | "object"
type SwaggerDefinitions = string | number | boolean

export type Body = {
  [name: string]: SwaggerTypes | [SwaggerTypes, SwaggerDefinitions | SwaggerObject]
}
export type GenSuccess = {
  description: string,
  body?: Body
}

export type GenError = {
  description: string,
  error: string
}

export type GenerateRoute = {
  tag: string
  summary: string
  pathParameters?: Parameters
  queryParameters?: Parameters
  body?: Body
  success?: GenSuccess
  security?: boolean
  [error: number]: GenError
}

export const obj = (args?: Body) => {
  if (!args) return undefined

  let swb: SwaggerObject = {}
  for (const name in args) {
    const value = args[name]
    if (typeof value === 'string') {
      swb[name] = {
        type: value
      }
    } else {
      if (typeof value[1] === 'object')
        swb[name] = {
          type: value[0],
          properties: value[1]
        }
      else
        swb[name] = {
          type: value[0],
          example: value[1]
        }
    }
  }
  return swb
}

const makeParameters = (type: "query" | "path", args?: Parameters) => {
  if (!args) return undefined;

  let swp: SwaggerParameter[] = []
  for (const name in args) {
    const value = args[name]
    if (typeof value === 'string') {
      swp.push({
        name,
        in: type,
        schema: { type: value }
      })
    } else {
      swp.push({
        name,
        in: type,
        schema: { type: value[0], example: value[1] }
      })
    }
  }
  return swp
}

const makeErrors = (errors?: { [error: number]: GenError }) => {
  if (!errors) return undefined;

  let swe: SwaggerError = {}
  for (const code in errors) {
    const value = errors[code]
    swe[code] = {
      description: value.description,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: value.error
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
  const { tag, summary, pathParameters, queryParameters, body, success, security = true, ...errors } = args

  let swParams: SwaggerParameter[] = []
  const swPath = makeParameters("path", pathParameters)
  if (swPath) swParams.push(...swPath)
  const swQuery = makeParameters("query", queryParameters) ?? []
  if (swQuery) swParams.push(...swQuery)

  const swBody = obj(body)

  const swSuccess = obj(success?.body)

  const swErrors = makeErrors(errors) ?? {}

  console.log(swSuccess)

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
                ...swSuccess, token: security ? {
                  type: "string",
                  example: "refreshed token",
                } : undefined
              }
            } : undefined
          }
        }
      },
      ...swErrors
    }
  }
}