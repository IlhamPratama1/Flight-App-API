import { Router } from "express";
import { Routes } from "../interface";
import AirportController from "../controllers/airport.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

export class AirportRoute implements Routes {
    public path = '/airport/';
    public router = Router();
    public airportController = new AirportController();
    public authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}all`, this.authMiddleware.checkIfUser, this.airportController.getAllAirport);
        this.router.get(`${this.path}detail/:id`, this.authMiddleware.checkIfUser, this.airportController.getAirportId);
        this.router.post(`${this.path}create`, this.authMiddleware.checkIfUser, this.airportController.createAirport);
        this.router.put(`${this.path}update/:id`, this.authMiddleware.checkIfUser, this.airportController.updateAirport);
        this.router.delete(`${this.path}delete/:id`, this.authMiddleware.checkIfUser, this.airportController.deleteAirport);
    }
}