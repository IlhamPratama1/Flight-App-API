import Stripe from 'stripe';

import { PAYMENT_KEY } from '../config';
import { PaymentData, User } from '../interface';
import DB from '../databases';
import { HttpException } from '../exceptions/HttpException';


export default class PaymentService {
    private stripe = new Stripe(PAYMENT_KEY as string, { apiVersion: '2020-08-27' });
    public books = DB.Books

    public async CheckOut(bookId: number, paymentData: PaymentData, user: User): Promise<{ paymentId: string, customerId: string }> {
        // check if book expired
        // check if all seat is sold
        // fix facility

        const flightBook = await this.books.findByPk(bookId);
        if (!flightBook) throw new HttpException(400, `Flight Book not found`);

        const customer = await this.stripe.customers.create({
            name: paymentData.name,
            email: paymentData.email,
            address: paymentData.address
        });

        const paymentMethod = await this.stripe.paymentMethods.create({ type: 'card', card: paymentData.card });
                
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: flightBook.amount,
            currency: 'myr',
            customer: customer.id,
            payment_method: paymentMethod.id,
            metadata: {
                id: flightBook.id,
                username: user.username,
                email: user.username
            },
            confirm: true,
        });

        flightBook.status = "COMPLETE";
        await flightBook.save();

        return {paymentId: paymentIntent.id, customerId: customer.id};
    }    
}
