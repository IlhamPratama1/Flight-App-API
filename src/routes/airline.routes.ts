import { Router } from "express";
import { Routes } from "../interface";
import AirlineController from "../controllers/airline.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/upload.middleware";

export class AirlineRoute implements Routes {
    public path = '/airline/';
    public router = Router();
    public airlineController = new AirlineController();
    public authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}all`, this.authMiddleware.checkIfUser, this.airlineController.getAirlines);
        this.router.get(`${this.path}detail/:id`, this.authMiddleware.checkIfUser, this.airlineController.getAirlineById);
        this.router.post(`${this.path}create`, [
            this.authMiddleware.checkIfUser,
            uploadImage
        ], this.airlineController.createAirline);
        this.router.put(`${this.path}update/:id`, [
            this.authMiddleware.checkIfUser,
            uploadImage
        ], this.airlineController.updateAirline);
        this.router.delete(`${this.path}delete/:id`, this.authMiddleware.checkIfUser, this.airlineController.deleteAirline);
    }
}