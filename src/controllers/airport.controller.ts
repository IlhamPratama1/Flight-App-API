import { Request, Response } from "express";
import { Airport, AirportData } from "../interface";
import AirportService from "../services/airport.service";

export default class AirportController {
    private airportService = new AirportService();

    public getAllAirport = async (req: Request, res: Response) => {
        try {
            const airports: Airport[] = await this.airportService.getAllAirport();
            return res.status(200).send(airports);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public getAirportId = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const airport: Airport = await this.airportService.detailAirport(req.params.id);
            return res.status(200).send(airport);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public createAirport = async (req: Request, res: Response) => {
        try {
            const airportData: AirportData = req.body;
            const airport: Airport = await this.airportService.createAirport(airportData);

            return res.status(200).send(airport);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public updateAirport = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const airportData: AirportData = req.body;
            const airport: Airport = await this.airportService.updateAirport(req.params.id, airportData);

            return res.status(200).send(airport);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public deleteAirport = async (req: Request<{ id: number }>, res: Response) => {
        try {
            await this.airportService.deleteAirport(req.params.id);
            return res.status(200).send({ 'message': 'Airport deleted' });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }
}