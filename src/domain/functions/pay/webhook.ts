import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { Payment } from "@infra/gateways/payment"
import { User } from "@prisma/client"

export type PayWebhookRequest = {
    user: User
    headers: { 'stripe-signature'?: string }
    body: any
}

export type PayWebhookResponse = {
}

export async function payWebhook(req: PayWebhookRequest, db: DatabaseClient, pay: Payment): Promise<PayWebhookResponse> {
    const secret = process.env.STRIPE_SECRET
    const signature = req.headers["stripe-signature"]
    if (!secret || !signature) throw Errors.UNAUTHORIZED()

    const event = await pay.getWebhookEvent(JSON.stringify(req.body), signature)

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.error(`Unhandled event type ${event.type}.`);
    }

    return {}
}