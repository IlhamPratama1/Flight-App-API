import { Router } from "express";
import { Routes } from "../interface";
import AuthMiddleware from "../middlewares/auth.middleware";
import TicketController from "../controllers/ticket.controller";

export class TicketRoute implements Routes {
    public path = '/ticket/';
    public router = Router();
    public ticketController = new TicketController();
    public authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}all`, this.authMiddleware.checkIfUser, this.ticketController.getAllTicket);
        this.router.get(`${this.path}detail/:id`, this.authMiddleware.checkIfUser, this.ticketController.getTicketById);
    }
}