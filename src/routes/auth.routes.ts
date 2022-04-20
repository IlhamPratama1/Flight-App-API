import { Router } from "express";
import { Routes } from "../interface";
import AuthController from "../controllers/auth.controller";
import { checkIfLogin } from "../middlewares";

export class AuthRoute implements Routes {
    public path = '/';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}signup`, this.authController.signUpUser);
        this.router.post(`${this.path}signin`, this.authController.signInUser);
        this.router.get(`${this.path}verify/:code`, checkIfLogin, this.authController.verifyEmail);
        this.router.get(`${this.path}resend-verification`, checkIfLogin, this.authController.resendVerification);
        this.router.post(`${this.path}get-access-token`, checkIfLogin, this.authController.getNewAccess);
    }
}