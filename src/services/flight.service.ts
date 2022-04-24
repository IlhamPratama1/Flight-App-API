// Lib
import DB from "../databases";

// Component
import { HttpException } from "../exceptions/HttpException";
import { 
    Flight, FlightData, SearchFlight, PaymentFlight,
    Facility, FlightFacility, Passanger 
} from "../interface";


export default class FlightService {
    
    // Database Schema
    public flights = DB.Flights;
    public airlines = DB.Airlines;
    public airports = DB.Airport;
    public books = DB.Books;
    public passangers = DB.Passangers;

    // Const variable
    private searchType: string[] = [
        "flightDate", "arrivalDate",
        "flightTime", "arrivalTime",
        "fromAirportId", "toAirportId",
        "seatType", "AirlineModelId"
    ];
    private personType: string[] = [ "adultPx", "childPx", "babyPx" ];
    private attributeOptions = { exclude: ['createdAt', 'updatedAt'] };
    private facility = {
        covidInsurance : 25000,
        baggageInsurance : 15000,
        fullProtection : 30000
    };

    // Func
    public async getAllFlight(): Promise<Flight[]> {
        return await this.flights.findAll();
    }

    public async searchFlight(flightData: SearchFlight): Promise<Flight[]> {
        const filters = this.filterFlight(flightData);
        const flights: Flight[] = await this.flights.findAll({ 
            where: filters,
            attributes: this.attributeOptions,
            include: [
                { model: this.airlines, attributes: this.attributeOptions },
                { model: this.airports, as: 'fromAirport', attributes: this.attributeOptions },
                { model: this.airports, as: 'toAirport', attributes: this.attributeOptions },
            ],
            raw: true,
            nest: true
        });
        flights.forEach(flight => {
            const payment: PaymentFlight = this.flightPayment(flight, flightData);
            flight["payment"] = payment;
        });
        return flights;
    }

    public async getFlightById(flightId: number): Promise<Flight> {
        const flight = await this.flights.findByPk(flightId);
        if(!flight) throw new HttpException(400, `Flight not found`);

        return flight;
    }

    public async createFlight(flightData: FlightData): Promise<Flight> {
        const airline = await this.airlines.findByPk(flightData.airlineId);
        if(!airline) throw new HttpException(400, `Airline id not valid`);

        const flight = await this.flights.create({ ...flightData, code: `${Date.now()}_${flightData.airlineId}` });
        await flight.setAirlineModel(flightData.airlineId);
        return flight;
    }
    
    public async updateFlight(flightId: number, flightData: FlightData): Promise<Flight> {
        const flight = await this.flights.findByPk(flightId);
        if(!flight) throw new HttpException(400, `Flight not found`);

        const airline = await this.airlines.findByPk(flightData.airlineId);
        if(!airline) throw new HttpException(400, `Airline id not valid`);

        await flight.update({ ...flightData, code: `${Date.now()}_${flightData.airlineId}` })
        await flight.setAirlineModel(flightData.airlineId);
        return flight;
    }

    public async deleteFlight(flightId: number): Promise<void> {
        const flight = await this.flights.findByPk(flightId);
        if(!flight) throw new HttpException(400, `Flight not found`);

        await flight.destroy();
    }

    public async processOrder(flightId: number, facility: FlightFacility): Promise<Flight> {
        const flight = await this.flights.findByPk(flightId, { 
            attributes: this.attributeOptions,
            include: [
                { model: this.airlines, attributes: this.attributeOptions },
                { model: this.airports, as: 'fromAirport', attributes: this.attributeOptions },
                { model: this.airports, as: 'toAirport', attributes: this.attributeOptions },
            ],
            raw: true,
            nest: true
        });
        if(!flight) throw new HttpException(400, `Flight not found`);
        if(flight.totalSeat <= 0) throw new HttpException(400, `Flight already full`);

        const payment: PaymentFlight = this.flightPayment(flight, facility);
        const facilities: Facility = this.addMoreFacility(facility);
        flight["payment"] = payment;
        flight["facilities"] = facilities;
        flight["bill"] = payment.total + facilities.total;

        return flight;
    }

    public async bookOrder(userId: number, flightId: number, facility: FlightFacility, passangersData: Passanger[]) {
        const flight = await this.flights.findByPk(flightId);
        if(!flight) throw new HttpException(400, `Flight not found`);

        const passangers = await this.passangers.bulkCreate(passangersData);
        this.countPassanger(passangers, facility);

        const payment: PaymentFlight = this.flightPayment(flight, facility);
        const facilities: Facility = this.addMoreFacility(facility);
        const totalPayment: number = payment.total + facilities.total;
        
        let oneHourAhead = new Date();
        oneHourAhead.setMinutes(oneHourAhead.getMinutes() + 60);
        
        const bookFlight = await this.books.create({
            expiryDate: oneHourAhead,
            status: "PENDING",
            amount: totalPayment
        }, { include: [ this.flights, this.passangers ] });

        await bookFlight.setUserModel(userId);
        await bookFlight.setFlightModel(flight);
        await bookFlight.setPassangerModels(passangers);

        return { bookFlight, facilities, payment };
    }

    public countPassanger(passangers: Passanger[], facility: FlightFacility) {
        let adultPx = 0;
        let childPx = 0;
        let babyPx= 0;

        passangers.forEach(passanger => {
            switch(passanger.age) {
                case 'adult':  {
                    adultPx = adultPx + 1;
                    break;
                }
                case 'child': {
                    childPx = childPx + 1;
                    break;
                }
                case 'baby': {
                    babyPx = babyPx + 1;
                    break;
                }
            }
        });
        
        facility.adultPx = adultPx;
        facility.childPx = childPx;
        facility.babyPx = babyPx;
    }

    public addMoreFacility(facility: FlightFacility): Facility {
        let facilities: Facility = {
            covidInsurance: 0,
            baggageInsurance: 0,
            fullProtection: 0,
            total: 0
        };

        if (facility.covidInsurance === "true" || facility.covidInsurance === true) {
            facilities.covidInsurance = this.facility.covidInsurance;
            facilities.total = facilities.total + this.facility.covidInsurance;
        }

        if (facility.baggageInsurance === "true" || facility.baggageInsurance === true) {
            facilities.baggageInsurance = this.facility.baggageInsurance;
            facilities.total = facilities.total + this.facility.baggageInsurance;
        }

        if (facility.fullProtection === "true" || facility.fullProtection === true) {
            facilities.fullProtection = this.facility.fullProtection;
            facilities.total = facilities.total + this.facility.fullProtection;
        }

        return facilities;
    }

    public flightPayment(flight: Flight, flightData: SearchFlight | FlightFacility): PaymentFlight {
        let payment: PaymentFlight = { 
            adultPx: { count: 1, total: 0 }, 
            childPx: { count: 1, total: 0 }, 
            babyPx: { count: 1, total: 0 }, 
            total: 0 
        };
        for (let i = 0; i < this.personType.length; i++) {
            if (flightData[this.personType[i]] !== "" && flightData[this.personType[i]] !== undefined) {
                switch (this.personType[i]) {
                    case "adultPx": {
                        payment.adultPx.count = Number(flightData.adultPx);
                        payment.adultPx.total = flight.adultPx * flightData.adultPx;
                        payment.total = payment.total + payment.adultPx.total;
                        break;
                    }
                    case "childPx": {
                        payment.childPx.count = Number(flightData.childPx);
                        payment.childPx.total = flight.childPx * flightData.childPx;
                        payment.total = payment.total + payment.childPx.total;
                        break;
                    }
                    case "babyPx": {
                        payment.babyPx.count = Number(flightData.babyPx);
                        payment.babyPx.total = flight.babyPx * flightData.babyPx;
                        payment.total = payment.total + payment.babyPx.total;
                        break;
                    }
                }

            };
        };
        return payment;
    }

    public filterFlight(flightData: SearchFlight): {} {
        let filters = {};
        for (let i = 0; i < this.searchType.length; i++) {
            if (flightData[this.searchType[i]] !== "" && flightData[this.searchType[i]] !== undefined) {
                switch (this.searchType[i]) {
                    case "flightDate": {
                        filters[this.searchType[i]] = new Date(flightData[this.searchType[i]]);
                        break;
                    }
                    case "arrivalDate": {
                        filters[this.searchType[i]] = new Date(flightData[this.searchType[i]]);
                        break;
                    }
                    default: {
                        filters[this.searchType[i]] = flightData[this.searchType[i]];
                        break;
                    }
                }
            }
        }

        return filters;
    }
}