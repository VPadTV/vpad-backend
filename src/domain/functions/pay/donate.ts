import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { Payment } from "@infra/gateways/payment"
import { User } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export type PayDonateRequest = {
    user: User
    donation: number
    destinationUserId: string
}

export type PayDonateResponse = {
    url: string
}

export async function payCreate(req: PayDonateRequest, db: DatabaseClient, pay: Payment): Promise<PayDonateResponse> {
    const destinationUser = await db.user.findFirst({ where: { id: req.destinationUserId } })
    if (!destinationUser) throw Errors.NOT_FOUND("Desination User")

    const accountId = destinationUser.stripeAccountId
    if (!accountId) throw Errors.NO_ACCOUNT()

    const { url } = await pay.createSession({
        type: 'payment',
        product: {
            price: new Decimal(req.donation),
            name: "example name"
        },
        quantity: [1, 3],
        email: req.user.email,
        destinationAccountId: accountId
    })

    return { url }
}