// Lib
import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken';

// Component
import { DataStoredInToken, RequestWithUser, RequestWithUserGeneric } from "../interface"
import { SECRET_KEY } from "../config";
import DB from "../databases";
import AuthMidddlewareService from "../services/auth.middleware.service";

export default class AuthMiddleware {
    private authMiddleware = new AuthMidddlewareService();

    public checkIfLogin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (token) {
                const tokenProvided = token.split('Bearer ')[1];
                const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;
                const user = await DB.Users.findByPk(isValid.id);
                if (user) {
                    req.user = user;
                    next();
                } else {
                    return res.status(401).send({ 'message': `Wrong authentication token`});
                }
            } else {
                return res.status(401).send({ 'message': `Authentication token missing`});
            }
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIfUser = async (req: RequestWithUserGeneric<{}>, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (token) {
                const tokenProvided = token.split('Bearer ')[1];
                const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;
                const { user, isRole } = await this.authMiddleware.checkUserRoleIs(isValid.id, 'user');
                if (isRole) {
                    req.user = user;
                    next();
                } else {
                    return res.status(401).send({ 'message': `Wrong authentication token`});
                }
            } else {
                return res.status(401).send({ 'message': `Authentication token not provided`});
            }
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIfAdmin = async (req: RequestWithUserGeneric<{}>, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (token) {
                const tokenProvided = token.split('Bearer ')[1];
                const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;
                const { user, isRole } = await this.authMiddleware.checkUserRoleIs(isValid.id, 'admin');
                if (isRole) {
                    req.user = user;
                    next();
                } else {
                    return res.status(401).send({ 'message': `Wrong authentication token`});
                }
            } else {
                return res.status(401).send({ 'message': `Authentication token not provided`});
            }
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    public checkIfUserAdmin = async (req: RequestWithUserGeneric<{}>, res: Response, next: NextFunction) => {
        try {
            const token = (req.header('Authorization'));
            if (token) {
                const tokenProvided = token.split('Bearer ')[1];
                const isValid = jwt.verify(tokenProvided, SECRET_KEY as string) as DataStoredInToken;
                const { user, isRole } = await this.authMiddleware.checkUserRoleIs(isValid.id, 'user', 'admin');
                if (isRole) {
                    req.user = user;
                    next();
                } else {
                    return res.status(401).send({ 'message': `Wrong authentication token`});
                }
            } else {
                return res.status(401).send({ 'message': `Authentication token not provided`});
            }
        } catch (err) {
            return res.status(401).send(err);
        }
    }
}