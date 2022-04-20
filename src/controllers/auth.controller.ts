// Lib
import { Request, Response } from "express";

// Component
import { User, signinInterface, signupInterface, RequestWithUser, getRefreshInterface } from "../interface";
import AuthService from "../services/auth.service";


export default class AuthController {
    private auth = new AuthService();

    public verifyEmail = async (req: RequestWithUser, res: Response) => {
        try {
            const user: User = await this.auth.confirmEmail(req.user, req.params.code);
            return res.send(user);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}`});
        }
    }

    public resendVerification = async (req: RequestWithUser, res: Response) => {
        try {
            const confirmationCode: string = await this.auth.resendVerificationCode(req.user);
            return res.send({ 'code': confirmationCode });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}`});
        }
    }

    public signUpUser = async (req: Request, res: Response) => {
        try {
            const userRequest: signupInterface = req.body;
            const newUser: User = await this.auth.signUp(userRequest);
            return res.status(200).send(newUser);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}`})
        }
    }

    public signInUser = async (req: Request, res: Response) => {
        try {
            const userRequest: signinInterface = req.body;
            const {user, accessToken, roles, refreshToken} = await this.auth.signIn(userRequest);
            return res.status(200).send({
                user: user,
                roles: roles,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}`})
        }
    }

    public getNewAccess = async (req: RequestWithUser, res: Response) => {
        try {
            const accessRequest: getRefreshInterface = req.body;
            const { accessToken, refreshToken } = await this.auth.getNewAccessToken(accessRequest.refreshToken, req.user.id);
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}`})
        }
    }
}