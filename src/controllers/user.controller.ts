// Lib
import { Request, Response } from 'express';
import fs from 'fs';

// Component
import DB from '../databases';
import { RequestWithUser, User } from '../interface';

export default class UserController {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const users = await DB.Users.findAll();
            if (!users) return res.status(400).send({ 'message': `error get users data` });

            return res.status(200).send(users);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getUserById = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const user = await DB.Users.findByPk(req.params.id);
            if (!user) return res.status(400).send({ 'message': `user not found` });

            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getUserByUsername = async (req: Request<{ username: number }>, res: Response) => {
        try {
            const user = await DB.Users.findOne({ where: { username: req.params.username } });
            if (!user) return res.status(400).send({ 'message': `User not found` });

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

            if (userModel.profilePicture !== "") {
                const imagePath: string = userModel.profilePicture.replace(req.protocol + '://' + req.get('host') + '/', '');
                fs.unlinkSync(imagePath);
            }
            
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