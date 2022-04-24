import { CountTotal } from '.';

export interface Flight {
    id: number,
    code: string,
    flightTime: Date,
    arrivalTime: Date,
    flightDate: Date,
    arrivalDate: Date,
    adultPx: number,
    childPx: number,
    babyPx: number,
    seatType: string,
    totalSeat: number,
    baggage: number
}

export interface FlightData {
    airlineId: number,
    flightTime: Date,
    arrivalTime: Date,
    flightDate: Date,
    arrivalDate: Date,
    adultPx: number,
    childPx: number,
    babyPx: number,
    seatType: string,
    totalSeat: number,
    baggage: number
}

export interface FlightFacility {
    adultPx: number,
    childPx: number,
    babyPx: number,
    covidInsurance: string | boolean,
    baggageInsurance: string | boolean,
    fullProtection: string | boolean
}

export interface SearchFlight {
    AirlineModelId: number,
    flightTime: Date,
    arrivalTime: Date,
    flightDate: Date,
    arrivalDate: Date,
    fromAirportId: number,
    toAirportId: number,
    adultPx: number,
    childPx: number,
    babyPx: number,
    seatType: string
}

export interface PaymentFlight {
    adultPx: CountTotal,
    childPx: CountTotal,
    babyPx: CountTotal,
    total: number
}