export interface Ticket {
    id: number,
    code: string,
    customerId: string,
    paymentId: string,
    covidInsurance: boolean,
    baggageInsurance: boolean,
    fullProtection: boolean
}