import { Errors } from '@helpers/http'
import { SmartStream, Storage } from '@infra/gateways'

export type PostStreamRequest = {
    key: string
    width?: string
}

export type PostStreamResponse = {
    stream: SmartStream;
    ContentLength: number;
    ContentType: string;
}

export async function postStream({ key }: PostStreamRequest, storage: Storage): Promise<PostStreamResponse> {
    if (!key) throw Errors.NOT_FOUND()
    const response = await storage.stream(key)
    return response
}