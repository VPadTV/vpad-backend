import { ErrorMessage } from "@domain/helpers"
import { Database } from "@infra/gateways/database"

export type GetUserByIdRequest = {
    id: number
}

export type GetUserByIdResponse = {
    name: string
    email: string
}

export async function getUserById(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: req.id } })
    if (!user) {
        throw new Error(ErrorMessage.NOT_FOUND.key)
    }
    return {
        name: user.name,
        email: user.email,
    }
}