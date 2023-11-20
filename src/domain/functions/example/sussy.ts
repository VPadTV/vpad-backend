import { ErrorMessage } from "@domain/helpers";
import { Database } from "@infra/gateways/prisma";
import { SussyGetRequest, SussyGetResponse, SussyPostRequest, SussyPostResponse } from "src/routes/contracts/example";

export async function sussyGet(req: SussyGetRequest): Promise<SussyGetResponse> {
    if (req.name === "crewmate") {
        return { isSussy: false }
    }
    else if (req.name === "imposter") {
        return { isSussy: true }
    }
    throw new Error(ErrorMessage.INVALID_NAME.key)
}

export async function sussyPost(req: SussyPostRequest): Promise<SussyPostResponse> {
    const db = Database.get()
    const response = await db.crewmate.create({
        data: {
            name: req.name,
            color: req.color
        }
    })
    return {
        id: response.id
    }
}