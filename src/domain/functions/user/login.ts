import { ErrorMessage } from "@domain/helpers"
import { JwtGateway } from "@infra/gateways"
import { Database } from "@infra/gateways/database"
import bcrypt from "bcrypt"

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    token: string
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
    const db = Database.get()
    const user = await db.user.findFirst({
        where: { email: req.email }
    })
    if (!await bcrypt.compare(req.password, user.password))
        throw new Error(ErrorMessage.INCORRECT_PASSWORD.key)

    return { token: JwtGateway.newToken(user.id, user.name) }
}