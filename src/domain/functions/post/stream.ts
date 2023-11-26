import { Errors } from "@domain/helpers"
import { Storage, StreamResponse } from "@infra/gateways"

export type PostStreamRequest = {
    key: string
}

export type PostStreamResponse = StreamResponse

export async function postStream({ key }: PostStreamRequest, storage: Storage): Promise<PostStreamResponse> {
    if (!key) throw Errors.NOT_FOUND()
    return storage.stream(key, { resolution: "" })
}