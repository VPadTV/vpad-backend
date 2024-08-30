import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { Payment } from '@infra/gateways/payment'
import { User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export type DonateRequest = {
    user: User
    donation: number
    destinationUserId: string
}

export type DonateResponse = {
    url: string
}

export async function donateCreate(req: DonateRequest, db: DatabaseClient, pay: Payment): Promise<DonateResponse> {
    const destinationUser = await db.user.findFirst({ where: { id: req.destinationUserId } })
    if (!destinationUser) throw Errors.NOT_FOUND()

    const accountId = destinationUser.stripeAccountId
    if (!accountId) throw Errors.NO_ACCOUNT()

    pay.donate({
        email: req.user.email,
        amount: new Decimal(req.donation),
        destinationAccountId: destinationUser.stripeAccountId!
    })

    return { url: '' }
}