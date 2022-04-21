// Lib
import { Request, Response } from "express";
import fs from 'fs';

// Component
import DB from "../databases";
import { AirlineData } from "../interface";

export default class AirlineController {
    public getAirlines = async (req: Request, res: Response) => {
        try {
            const airlines = await DB.Airlines.findAll();
            if (!airlines) return res.status(400).send({ 'message': `error get users data` });

            return res.status(200).send(airlines);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getAirlineById = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const airline = await DB.Airlines.findByPk(req.params.id);
            if (!airline) return res.status(400).send({ 'message': `user not found` });

            return res.status(200).send(airline);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public createAirline = async (req: Request, res: Response) => {
        try {
            const airlineData: AirlineData = req.body;
            const path: string = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename; 

            const airline = await DB.Airlines.create({
                name: airlineData.name,
                picture: path,
            });

            return res.status(200).send(airline);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` }); 
        }
    }

    public updateAirline = async (req: Request, res: Response) => {
        try {
            const airlineData: AirlineData = req.body;

            const airline = await DB.Airlines.findByPk(req.params.id);
            if (!airline) return res.status(400).send({ 'message': `User not found` });

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