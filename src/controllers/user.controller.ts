// Lib
import { Request, Response } from 'express';
import fs from 'fs';

// Component
import DB from '../databases';
import { HttpException } from '../exceptions/HttpException';
import { RequestWithUser, User } from '../interface';
import UserService from '../services/user.service';

export default class UserController {
    public userService = new UserService();

    public getUsers = async (req: Request, res: Response) => {
        try {
            return res.status(200).send(await this.userService.getAllUser());
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getUserById = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const user: User = await this.userService.getUserById(req.params.id);
            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getUserByUsername = async (req: Request<{ username: string }>, res: Response) => {
        try {
            const user: User = await this.userService.getUserByUsername(req.params.username);
            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getMyUser = async (req: RequestWithUser, res: Response) => {
        try {
            const user: User = req.user;
            if (!user) return res.status(400).send({ 'message': `User not found` });

            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public changeProfilePicture = async (req: RequestWithUser, res: Response) => {
        try {
            const user: User = req.user;
            const userModel = await DB.Users.findByPk(user.id);
            if (!userModel) throw new HttpException(400, 'Error get User');

            if (userModel.profilePicture !== "") {
                const imagePath: string = userModel.profilePicture.replace(req.protocol + '://' + req.get('host') + '/', '');
                fs.unlinkSync(imagePath);
            }
            
            if (!req.file) throw new HttpException(400, 'Please provide image');
            const path: string = req.protocol + '://' + req.get('host') + "/static/images/" + req.file.filename;            
            userModel.profilePicture = path;
            await userModel.save();

            return res.status(200).send(userModel)
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public deleteProfilePicture = async (req: RequestWithUser, res: Response) => {
        try {
            const user: User = req.user;
            const userModel = await DB.Users.findByPk(user.id);
            if (!userModel) throw new HttpException(400, 'Error get User');

            if (userModel.profilePicture !== "") {
                const imagePath = userModel.profilePicture.replace(req.protocol + '://' + req.get('host') + '/', '');
                fs.unlinkSync(imagePath);
            }
            
            userModel.profilePicture = "";
            await userModel.save();
            
            return res.status(200).send(userModel)
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }
}