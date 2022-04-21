import DB from "../databases";

import { HttpException } from "../exceptions/HttpException";
import { Airline, AirlineData } from "../interface";

export default class AirlineService {
    public airlines = DB.Airlines;

    public async getAllAirline(): Promise<Airline[]> {
        const airlines = await this.airlines.findAll();
        return airlines;
    }

    public async getAirlineById(airlineId: number): Promise<Airline> {
        const airline = await this.airlines.findByPk(airlineId);
        if (!airline) throw new HttpException(400, `Airline not found`);

        return airline;
    }

    public async createAirline(airlineData: AirlineData, path: string): Promise<Airline> {
        const airline = await this.airlines.create({
            name: airlineData.name,
            picture: path,
        });

        return airline;
    }
}