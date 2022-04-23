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

export interface SearchFlight {
    AirlineModelId: number,
    flightTime: Date,
    arrivalTime: Date,
    flightDate: Date,
    arrivalDate: Date,
    fromAirportId: number,
    toAirportId: number,
    adult: number,
    child: number,
    baby: number,
    seatType: string
}