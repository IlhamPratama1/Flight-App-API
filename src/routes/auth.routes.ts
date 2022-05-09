import { Router } from "express";
import { Routes } from "../interface";
import AuthController from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

export class AuthRoute implements Routes {
    public path = '/auth/';
    public router = Router();
    public authController = new AuthController();
    public authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}signup`, this.authController.signUpUser);
        this.router.post(`${this.path}signin`, this.authController.signInUser);
        this.router.get(`${this.path}verify-email/:code`, this.authMiddleware.checkIfLogin, this.authController.verifyEmail);
        this.router.get(`${this.path}resend-verification`, this.authMiddleware.checkIfLogin, this.authController.resendVerification);
        this.router.post(`${this.path}get-access-token`, this.authController.getNewAccess);
        this.router.post(`${this.path}forget-password`, this.authController.forgetPassword);
        this.router.post(`${this.path}verify-forget-password/:forgetToken`, this.authController.verifyForgetPassword);
    }
}