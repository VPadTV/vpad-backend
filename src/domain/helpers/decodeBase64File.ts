import { Errors } from "./errors"

export const decodeBase64File = (fileBase64: string) => {
  const matches = fileBase64.match(/^data:([a-zA-Z-+/.]+);base64,(.+)$/)
  if (matches?.length !== 3)
    throw Errors.INVALID_FILE()
  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], 'base64')
  }
}