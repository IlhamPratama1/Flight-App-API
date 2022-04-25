import { Router } from "express";
import FlightController from "../controllers/flight.controller";
import { Routes } from "../interface";
import AuthMiddleware from "../middlewares/auth.middleware";

export class FlightRoute implements Routes {
    public path = '/flight/';
    public router = Router();
    public flightController = new FlightController();
    public authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}all`, this.flightController.allFlight);
        this.router.post(`${this.path}create`, this.authMiddleware.checkIfUser, this.flightController.createFlight);
        this.router.get(`${this.path}search`, this.flightController.searchFlight);
        this.router.put(`${this.path}update/:id`, this.authMiddleware.checkIfUser, this.flightController.updateFlight);
        this.router.delete(`${this.path}delete/:id`, this.authMiddleware.checkIfUser, this.flightController.deleteFlight);
        this.router.get(`${this.path}process-order/:id`, this.flightController.processOrder);
        this.router.post(`${this.path}book-order/:id`, this.authMiddleware.checkIfUser, this.flightController.bookOrder);
        this.router.post(`${this.path}checkout/:id`, this.authMiddleware.checkIfUser, this.flightController.checkOutFlight);
    }
}