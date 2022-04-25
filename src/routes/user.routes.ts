import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { Routes } from '../interface';
import AuthMiddleware from '../middlewares/auth.middleware';
import { uploadImage } from '../middlewares/upload.middleware';

export class UserRoute implements Routes {
    public path = '/user/'
    public router = Router();
    public userController = new UserController();
    public authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}all`, this.authMiddleware.checkIfUser, this.userController.getUsers);
        this.router.get(`${this.path}detail`, this.authMiddleware.checkIfUser, this.userController.getMyUser);
        this.router.get(`${this.path}booked-flight`, this.authMiddleware.checkIfUser, this.userController.getMyBookedFlight);
        this.router.get(`${this.path}id/:id`,this.authMiddleware. checkIfUser, this.userController.getUserById);
        this.router.get(`${this.path}username/:username`, this.authMiddleware.checkIfUser, this.userController.getUserByUsername);
        this.router.put(`${this.path}change-profile`, [
            this.authMiddleware.checkIfUser,
            uploadImage
        ], this.userController.changeProfilePicture);
        this.router.delete(`${this.path}delete-profile`, this.authMiddleware.checkIfUser, this.userController.deleteProfilePicture);
    }
}