import { DatabaseClient } from "@infra/gateways/database"
import { Payment } from "@infra/gateways/payment"
import { User } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export type PayCreateRequest = {
    user: User
}

export type PayCreateResponse = {
    url: string
}

export async function payCreate(req: PayCreateRequest, db: DatabaseClient, pay: Payment): Promise<PayCreateResponse> {
    const { url } = await pay.createSession({
        type: 'subscription',
        product: {
            price: new Decimal(100),
            name: "example name"
        },
        quantity: [1, 3],
        email: req.user.email,
    })

    return { url }
}