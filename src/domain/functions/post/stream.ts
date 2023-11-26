import { Errors } from "@domain/helpers"
import { Storage, StreamResponse } from "@infra/gateways"

export type PostStreamRequest = {
    url: string
}

export type PostStreamResponse = StreamResponse

export async function postStream({ url }: PostStreamRequest, storage: Storage): Promise<PostStreamResponse> {
    if (!url) throw Errors.NOT_FOUND()
    return storage.stream(url)
}