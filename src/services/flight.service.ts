import DB from "../databases";
import { HttpException } from "../exceptions/HttpException";
import { Flight, FlightData, SearchFlight } from "../interface";

export default class FlightService {
    public flights = DB.Flights;
    public airlines = DB.Airlines;
    public airports = DB.Airport;

    private searchType: string[] = [
        "flightDate", "arrivalDate",
        "flightTime", "arrivalTime",
        "fromAirportId", "toAirportId",
        "seatType", "AirlineModelId"
    ];
    private personType: string[] = [
        "adultPx", "childPx", "babyPx"
    ];
    private attributeOptions = { exclude: ['createdAt', 'updatedAt'] };

    public async getAllFlight(): Promise<Flight[]> {
        return await this.flights.findAll();
    }

    public async searchFlight(flightData: SearchFlight) {
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
            this.flightPayment(flight, flightData);
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

    public flightPayment(flight: Flight, flightData: SearchFlight) {
        let payment = {};
        let bill: number = 0;
        for (let i = 0; i < this.personType.length; i++) {
            if (flightData[this.personType[i]] !== "" && flightData[this.personType[i]] !== undefined) {
                payment[this.personType[i]] = {
                    count: flightData[this.personType[i]],
                    total: flight[this.personType[i]] * flightData[this.personType[i]]
                };
                bill = bill + flight[this.personType[i]] * flightData[this.personType[i]];
            };
        };
        payment["total"] = bill;
        flight["payment"] = payment;
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