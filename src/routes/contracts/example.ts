import { Color } from "@prisma/client"

export type SussyGetRequest = {
    name: string
}

export type SussyGetResponse = {
    isSussy: boolean
}

export type SussyPostRequest = {
    name: string,
    color: Color
}

export type SussyPostResponse = {
    id: number
}