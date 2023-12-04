import { Errors } from "@domain/helpers";
import { Decimal } from "@prisma/client/runtime/library";
import Stripe from "stripe";

export type CheckoutData = {
    url: string
    paymentIntent: string
}

export type CreateCheckout = {
    type: 'payment' | 'subscription'
    product: {
        price: Decimal // Decimal(100) = $1.00
        name: string
    }
    quantity: [number, number]
    email: string
}

export class Payment {
    static instance: Payment
    client: Stripe;
    private constructor() {
        const key = process.env.STRIPE_KEY
        if (!key)
            throw Errors.SERVER()
        this.client = new Stripe(key)
    }

    static get() {
        if (!this.instance)
            this.instance = new Payment()
        return this.instance
    }

    async createSession(data: CreateCheckout): Promise<CheckoutData> {
        const session = await this.client.checkout.sessions.create({
            cancel_url: process.env.FRONT_URL! + '/pay/cancel',
            success_url: process.env.FRONT_URL! + '/pay/success',
            mode: data.type,
            customer_email: data.email,
            // automatic_tax: { enabled: true },
            // billing_address_collection: 'auto',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: data.product.name
                        },
                        unit_amount: data.product.price.toNumber(),
                        recurring: data.type === 'subscription' ? {
                            interval: 'month',
                            interval_count: 1,
                        } : undefined,
                    },
                    quantity: 1,
                    adjustable_quantity: {
                        enabled: true,
                        minimum: data.quantity[0] ?? 1,
                        maximum: data.quantity[1] ?? 1,
                    }
                }
            ]
        })
        return {
            url: session.url!,
            paymentIntent: session.payment_intent?.toString()!,
        }
    }

    async getWebhookEvent(body: string | Buffer, signature: string) {
        const secret = process.env.STRIPE_SECRET
        if (!secret) throw Errors.SERVER()
        return this.client.webhooks.constructEvent(body, signature, secret)
    }
}