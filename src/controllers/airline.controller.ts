// Lib
import { Request, Response } from "express";
import fs from 'fs';

// Component
import DB from "../databases";
import { HttpException } from "../exceptions/HttpException";
import { Airline, AirlineData } from "../interface";
import AirlineService from "../services/airline.service";

export default class AirlineController {
    private airlineService = new AirlineService();

    public getAirlines = async (req: Request, res: Response) => {
        try {
            return res.status(200).send(await this.airlineService.getAllAirline());
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getAirlineById = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const airline: Airline = await this.airlineService.getAirlineById(req.params.id);
            return res.status(200).send(airline);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public createAirline = async (req: Request, res: Response) => {
        try {
            const airlineData: AirlineData = req.body;

            if (!req.file) throw new HttpException(400, 'Error get User');
            const path: string = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename; 

            const airline: Airline = await this.airlineService.createAirline(airlineData, path);

            return res.status(200).send(airline);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public updateAirline = async (req: Request, res: Response) => {
        try {
            const airlineData: AirlineData = req.body;

            const airline = await DB.Airlines.findByPk(req.params.id);
            if (!airline) return res.status(400).send({ 'message': `Ariline not found` });

            if (req.file) {
                const imagePath: string = airline.picture.replace(req.protocol + '://' + req.get('host') + '/', '');
                fs.unlinkSync(imagePath);

                const path: string = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename; 
                airline.picture = path;
            }

            airline.name = airlineData.name;
            await airline.save();

            return res.status(200).send(airline);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public deleteAirline = async (req: Request<{ id: number}>, res: Response) => {
        try {
            const airline = await DB.Airlines.findByPk(req.params.id);
            if (!airline) return res.status(400).send({ 'message': `Airline not found` });
            
            if (airline.picture !== "") {
                const imagePath: string = airline.picture.replace(req.protocol + '://' + req.get('host') + '/', '');
                fs.unlinkSync(imagePath);
            }

            await airline.destroy();

            return res.status(200).send({ 'message': 'airline deleted' });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }
}