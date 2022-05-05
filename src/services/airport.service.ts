import DB from "../databases";

import { deleteCacheData, getOrSetCache } from "../cache";
import { HttpException } from "../exceptions/HttpException";
import { Airport, AirportData } from "../interface";

export default class AirportService {
    public airport = DB.Airport;

    public async getAllAirport(): Promise<Airport[]> {
        const airports = await getOrSetCache('airports', async () => {
            const data = await this.airport.findAll();
            return data;
        })
        return airports;
    }

    public async detailAirport(airportId: number): Promise<Airport> {
        const airport = await getOrSetCache(`airport/${airportId}`,async () => {
            const data = await this.airport.findByPk(airportId);
            if (!data) throw new HttpException(400, `Airline not found`); 
            return data;
        });

        return airport;
    }

    public async createAirport(airportData: AirportData): Promise<Airport> {
        const airport = await this.airport.create(airportData);
        await deleteCacheData('airports');
        return airport;
    }

    public async updateAirport(airportId: number, airportData: AirportData): Promise<Airport> {
        const airport = await this.airport.findByPk(airportId);
        if(!airport) throw new HttpException(400, `Airport not found`);

        await airport.update(airportData);
        await deleteCacheData('airports');
        await deleteCacheData(`airport/${airportId}`);
        return airport;
    }

    public async deleteAirport(airportId: number): Promise<void> {
        const airport = await this.airport.findByPk(airportId);
        if(!airport) throw new HttpException(400, `Airport not found`);
        
        await deleteCacheData('airports');
        await deleteCacheData(`airport/${airportId}`);
        await airport.destroy();
    }
}