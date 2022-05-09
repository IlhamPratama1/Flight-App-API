// Lib
import { Request, Response } from "express";

// Component
import { User, signinInterface, signupInterface, RequestWithUser, getRefreshInterface } from "../interface";
import AuthService from "../services/auth.service";
import AuthValidation from "../validation/auth.validation";


export default class AuthController {
    private auth = new AuthService();
    private validation = new AuthValidation();
    
    public verifyEmail = async (req: RequestWithUser, res: Response) => {
        try {
            const user: User = await this.auth.confirmEmail(req.user, req.params.code);
            return res.send(user);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public resendVerification = async (req: RequestWithUser, res: Response) => {
        try {
            const confirmationCode: string = await this.auth.resendVerificationCode(req.user);
            return res.send({ 'code': confirmationCode });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public signUpUser = async (req: Request, res: Response) => {
        try {
            await this.validation.signUpValidation(req.body);
            const userRequest: signupInterface = req.body;
            const newUser: User = await this.auth.signUp(userRequest);
            return res.status(200).send(newUser);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}`})
        }
    }

    public signInUser = async (req: Request, res: Response) => {
        try {
            await this.validation.signInValidation(req.body);
            const userRequest: signinInterface = req.body;
            const {user, accessToken, roles, refreshToken} = await this.auth.signIn(userRequest);
            return res.status(200).send({
                user: user,
                roles: roles,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getNewAccess = async (req: RequestWithUser, res: Response) => {
        try {
            await this.validation.accessTokenValidation(req.body);
            const accessRequest: getRefreshInterface = req.body;
            const { accessToken, refreshToken } = await this.auth.getNewAccessToken(accessRequest.refreshToken);
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public forgetPassword = async (req: Request, res: Response) => {
        try {
            await this.validation.forgetPasswordValidation(req.body);
            await this.auth.forgetPassword(req.body.email);
            return res.status(200).send({ 'message': 'forget password confirmation send' });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public verifyForgetPassword = async (req: Request<{ forgetToken: string }>, res: Response) => {
        try {
            await this.validation.signInValidation(req.body);
            const userData: signinInterface = req.body;
            await this.auth.confirmPassword(userData, req.params.forgetToken);
            return res.status(200).send({ 'message': 'change password success' });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }
}