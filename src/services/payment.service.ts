// Lib
import Stripe from 'stripe';
import midtransClient from 'midtrans-client';

// Component
import { PAYMENT_KEY } from '../config';
import { PaymentData, User } from '../interface';
import DB from '../databases';
import { HttpException } from '../exceptions/HttpException';
import { deleteCacheData } from '../cache';


export default class PaymentService {
    public books = DB.Books;
    public flights = DB.Flights;

    private stripe = new Stripe(PAYMENT_KEY as string, { apiVersion: '2020-08-27' });
    private core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-qtQZrq0qz-3Xs-uxk4zhUiOp',
        clientKey : 'SB-Mid-client-kYVoT74zDV33Wc8s'
    });

    public async CheckOut(bookId: number, paymentData: PaymentData, user: User): Promise<{ paymentId: string, customerId: string }> {
        const flightBook = await this.books.findByPk(bookId);

        if (!flightBook) throw new HttpException(400, `Flight Book not found`);
        if (flightBook.expiryDate.getTime() < new Date().getTime()) throw new HttpException(400, `Flight Book expired`);

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
        await deleteCacheData('books');

        return {paymentId: paymentIntent.id, customerId: customer.id};
    }

    public async PayFlight() {
        let parameter = {
            "payment_type": "bank_transfer",
            "transaction_details": {
                "gross_amount": 24145,
                "order_id": "C34312ERWQ",
            },
            "bank_transfer":{
                "bank": "bni"
            }
        };

        const response = await this.core.charge(parameter);

        return response;
    }
}
