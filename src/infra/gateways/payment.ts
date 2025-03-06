import { Errors } from '@plugins/http';
import { Decimal } from '@prisma/client/runtime/library';
import Stripe from 'stripe';

export type CheckoutData = {
    url: string
    paymentIntent: string
}

export type CreateCheckout = {
    type: 'donation' | 'subscription'
    product: {
        price: Decimal // Decimal(100) = $1.00
        name: string
    }
    email: string
    destinationAccountId: string
}

export type DonateInput = {
    destinationAccountId: string
    email: string
    amount: Decimal
}

export type SubscribeInput = {
    destinationAccountId: string
    email: string
    amount: Decimal

    lengthInMonths?: number
}

export type PayInput = {
    destinationAccountId: string
    email: string
    amount: Decimal
}

export class Payment {
    static instance: Payment
    client: Stripe;
    private constructor() {
        const key = process.env.STRIPE_KEY
        if (!key)
            throw Errors.INTERNAL_SERVER_ERROR()
        this.client = new Stripe(key)
    }

    static get() {
        if (!this.instance)
            this.instance = new Payment()
        return this.instance
    }

    async createAccount(email: string): Promise<string> {
        const account = await this.client.accounts.create({
            type: 'express',
            email: email,
        })
        return account.id
    }

    async getAccountLink(accountId: string, linkType: 'create' | 'update'): Promise<string> {
        let type: 'account_onboarding' | 'account_update';
        if (linkType === 'create') type = 'account_onboarding'
        else type = 'account_update'
        const link = await this.client.accountLinks.create({
            account: accountId,
            type,
            refresh_url: process.env.FRONT_URL! + '/pay/reauth',
            return_url: process.env.FRONT_URL! + '/pay/return',
        })
        return link.url
    }

    async donate(_data: DonateInput): Promise<CheckoutData> {
        throw new Error('Unimplemented')
    }

    async subscribe(_data: DonateInput): Promise<CheckoutData> {
        throw new Error('Unimplemented')
    }

    async payUser(_data: DonateInput): Promise<CheckoutData> {
        throw new Error('Unimplemented')
    }

    async createSession(data: CreateCheckout): Promise<CheckoutData> {
        let mode: 'payment' | 'subscription'
        if (data.type === 'donation') mode = 'payment'
        else mode = 'subscription'

        const fee = data.product.price.mul(new Decimal(process.env.FEE!)).toNumber()

        const session = await this.client.checkout.sessions.create({
            mode,
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
                        enabled: false,
                    }
                }
            ],
            payment_intent_data: {
                application_fee_amount: fee,
                transfer_data: {
                    destination: data.destinationAccountId,
                }
            },
            cancel_url: process.env.FRONT_URL! + '/pay/cancel',
            success_url: process.env.FRONT_URL! + '/pay/success',
        })
        return {
            url: session.url!,
            paymentIntent: session.payment_intent?.toString()!,
        }
    }

    async getWebhookEvent(body: Buffer, secret: string, signature: string) {
        return this.client.webhooks.constructEvent(body, signature, secret)
    }
}