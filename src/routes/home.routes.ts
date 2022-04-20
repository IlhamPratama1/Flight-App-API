import { Router } from "express";
import { Routes } from "../interface";
import IndexController from "../controllers/index.controller";

export class HomeRoute implements Routes {
    public path = '/';
    public router = Router();
    public indexController = new IndexController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", this.indexController.index);
    }
}