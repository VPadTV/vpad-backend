import { Database } from "@infra/gateways/database"
import bcrypt from "bcrypt"

export type RegisterRequest = {
    name: string
    email: string
    password: string
}

export type RegisterResponse = {
    id: number
}

export async function register(req: RegisterRequest): Promise<RegisterResponse> {
    const db = Database.get()
    const user = await db.user.create({
        data: {
            name: req.name,
            email: req.email,
            password: await bcrypt.hash(req.password, 10)
        }
    })
    return { id: user.id }
}