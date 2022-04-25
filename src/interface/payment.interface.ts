export interface CountTotal {
    count: number,
    total: number
}

export interface PaymentData {
    name: string,
    address: {
        city: string,
        country: string,
        line1: string,
        line2: string,
        postal_code: string,
        state: string
    },
    email: string,
    card: {
        number: string,
        exp_month: number,
        exp_year: number,
        cvc: string
    }
}