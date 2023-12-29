import { Errors } from "@domain/helpers"
import { DatabaseClient } from "@infra/gateways/database"
import { Payment } from "@infra/gateways/payment"

export type PayWebhookRequest = {
    signature?: string
    raw: Buffer
}

export async function payWebhook(req: PayWebhookRequest, db: DatabaseClient, pay: Payment): Promise<void> {
    const secret = process.env.STRIPE_SECRET
    const signature = req.signature
    if (!secret || !signature) throw Errors.UNAUTHORIZED()

    const event = await pay.getWebhookEvent(req.raw, secret, signature)

    console.log(event)

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
}