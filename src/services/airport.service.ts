import DB from "../databases";
import { HttpException } from "../exceptions/HttpException";
import { Airport, AirportData } from "../interface";

export default class AirportService {
    public airport = DB.Airport;

    public async getAllAirport(): Promise<Airport[]> {
        return await this.airport.findAll();
    }

    public async createAirport(airportData: AirportData): Promise<Airport> {
        const airport = await this.airport.create(airportData);
        return airport;
    }

    public async updateAirport(airportId: number, airportData: AirportData): Promise<Airport> {
        const airport = await this.airport.findByPk(airportId);
        if(!airport) throw new HttpException(400, `Airport not found`);

        await airport.update(airportData);
        return airport;
    }

    public async deleteAirport(airportId: number): Promise<void> {
        const airport = await this.airport.findByPk(airportId);
        if(!airport) throw new HttpException(400, `Airport not found`);

        await airport.destroy();
    }
}