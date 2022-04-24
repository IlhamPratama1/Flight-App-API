import Stripe from 'stripe';
import { PAYMENT_KEY } from '../config';

export default class PaymentService {
    private stripe;

    constructor() {
        this.stripe = new Stripe(PAYMENT_KEY as string, { apiVersion: '2020-08-27' });
    }

    public async CheckOut() {
        const customer = await this.stripe.customers.create({
            name: 'asolole',
            description: 'My First Test Customer (created for API docs)',
        });

        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: {
              number: '4242424242424242',
              exp_month: 4,
              exp_year: 2023,
              cvc: '314',
            },
          });

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: 500,
            currency: 'usd',
            customer: customer.id,
            payment_method: paymentMethod.id,
        });

        const confirmPayment = await this.stripe.paymentIntents.confirm(
            paymentIntent.id,
            {payment_method: paymentMethod.id}
        );

        return confirmPayment;
    }    
}
