import DB from "../databases";

import { getOrSetCache, deleteCacheData } from "../cache";
import { HttpException } from "../exceptions/HttpException";
import { Airline, AirlineData } from "../interface";

export default class AirlineService {
    public airlines = DB.Airlines;

    public async getAllAirline(): Promise<Airline[]> {
        const airlines = await getOrSetCache('airlines', async () => {
            const data = await this.airlines.findAll();
            return data;
        });
        return airlines;
    }

    public async getAirlineById(airlineId: number): Promise<Airline> {
        const airline = await getOrSetCache(`airline/${airlineId}`,async () => {
            const data = await this.airlines.findByPk(airlineId);
            if (!data) throw new HttpException(400, `Airline not found`); 
            return data;
        });

        return airline;
    }

    public async createAirline(airlineData: AirlineData, path: string): Promise<Airline> {
        const airline = await this.airlines.create({
            name: airlineData.name,
            picture: path,
        });

        await deleteCacheData('airlines');

        return airline;
    }
}