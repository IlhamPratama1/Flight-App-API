import { CountTotal } from '.';

// General flight type
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

// User flight data to create new flight
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

// user flight facility to count passanger with facility
export interface FlightFacility {
    adultPx: number,
    childPx: number,
    babyPx: number,
    covidInsurance: string | boolean,
    baggageInsurance: string | boolean,
    fullProtection: string | boolean
}

// User Search flight to search flight
export interface SearchFlight {
    page: string,
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

// user payment flight for type of total flight payment
export interface PaymentFlight {
    adultPx: CountTotal,
    childPx: CountTotal,
    babyPx: CountTotal,
    total: number
}