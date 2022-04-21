// Lib
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// Component
import DB from "../databases";
import { User, signinInterface, signupInterface, DataStoredInTokenForget } from "../interface";
import { SECRET_KEY, EMAIL, PASSWORD } from "../config";
import { HttpException } from '../exceptions/HttpException';


export default class AuthService {
    public users = DB.Users;

    public async signIn(userData: signinInterface): Promise<{ user: User, roles: string[], accessToken: string, refreshToken: string }> {
        const findUser = await this.users.findOne({ where: { email: userData.email } });
        if (!findUser) throw new HttpException(400, `You're email ${userData.email} not found`);

        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
        if (!isPasswordMatching) throw new HttpException(400, "You're password not matching");

        let userRoles: string[] = [];
        const roles = await findUser.getRoleModels();
        roles.forEach(role => {
            userRoles.push(role.name);
        });

        const userAccessToken: string = this.createAccessToken(findUser.id);
        const userRefreshToken: string = await this.createRefreshToken(findUser.id);
        return { user: findUser, roles: userRoles, accessToken: userAccessToken, refreshToken: userRefreshToken };
    }

    
    public async signUp(userData: signupInterface): Promise<User> {
        const findUser = await this.users.findOne({ where: { email: userData.email } });
        if (findUser) throw new HttpException(400, `You're email ${userData.email} already exists`);
        
        const confirmationCode: string = await this.sendConfirmationCode(userData.email);
        
        const newUser = await DB.Users.create({
            username: userData.username,
            email: userData.email,
            password: bcrypt.hashSync(userData.password, 10),
            isVerfied: false,
            confirmationCode: confirmationCode,
            profilePicture: ''
        });

        const role = await DB.Roles.findAll({ where: { name: 'user' } });
        if (role) await newUser.setRoleModels(role);

        return newUser;
    }

    public async getNewAccessToken(userRefreshToken: string, userId: number): Promise<{ accessToken: string, refreshToken: string }> {
        const refreshToken = await DB.RefreshToken.findOne({ where: { token: userRefreshToken } });

        if(!refreshToken) throw new HttpException(400, `refresh token not found`);
        if(refreshToken.expiryDate.getTime() < new Date().getTime()) {
            await refreshToken.destroy();
            throw new HttpException(400, `refresh token expired`);
        }
        
        await refreshToken.destroy();
        const newAccessToken: string = this.createAccessToken(userId);
        const newRefreshToken: string = await this.createRefreshToken(userId);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    public createAccessToken(userId: number): string {
        const tokenExpiredIn: number = 60 * 60;
        const accessToken: string = jwt.sign({ id: userId }, SECRET_KEY as string, { expiresIn: tokenExpiredIn });
        return accessToken;
    }

    public async createRefreshToken(userId: number): Promise<string> {
        const tokenExpiredIn: number = + 86400;
        const tokenExpiredAt: Date = new Date();
        tokenExpiredAt.setSeconds(tokenExpiredAt.getSeconds() + tokenExpiredIn);
        
        const token = uuidv4();
        const refreshToken = await DB.RefreshToken.create({
            token: token,
            expiryDate: tokenExpiredAt
        });

        await refreshToken.setUserModel(userId);
        return refreshToken.token;
    }

    public async forgetPassword(userEmail: string): Promise<void> {
        const user = await DB.Users.findOne({ where: { email: userEmail } });
        if (!user) throw new HttpException(400, `user with email not found`);

        const forgetToken: string = jwt.sign({ email: userEmail }, SECRET_KEY as string );
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: EMAIL as string,
                pass: PASSWORD as string
            }
        });

        let message = {
            from: EMAIL as string,
            to: userEmail,
            subject: "Forget password qaqaq",
            html: `localhost:8000/verify-forget-password/${forgetToken}`
        }

        await transporter.sendMail(message);
    }

    public async confirmPassword(userData: signinInterface, forgetToken: string): Promise<void> {
        const isValid = jwt.verify(forgetToken, SECRET_KEY as string) as DataStoredInTokenForget;
        const user = await DB.Users.findOne({ where: { email: isValid.email} });

        if (!user) throw new HttpException(400, `user with token not found`);
        if (user.email !== userData.email) throw new HttpException(400, `forget token not valid`);
        
        user.password = bcrypt.hashSync(userData.password, 10);
        await user.save();
    }

    public async sendConfirmationCode(userEmail: string): Promise<string> {
        const confimationCode: string = jwt.sign({ email: userEmail }, SECRET_KEY as string );

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: EMAIL as string,
                pass: PASSWORD as string
            }
        });

        let message = {
            from: EMAIL as string,
            to: userEmail,
            subject: "Email qaqaq",
            html: `localhost:8000/verify-email/${confimationCode}`
        }

        await transporter.sendMail(message);
        return confimationCode;
    }

    public async resendVerificationCode(userData: User): Promise<string> {
        const user = await DB.Users.findByPk(userData.id);
        if (!user) throw new HttpException(400, `User not found`);
        if (user.isVerfied) throw new HttpException(400, `User already verified`);

        const confirmationCode: string = await this.sendConfirmationCode(user.email);
        user.confirmationCode = confirmationCode;
        await user.save();

        return user.confirmationCode;
    }

    public async confirmEmail(userData: User, codeConfimation: string): Promise<User> {
        const user = await DB.Users.findOne({ where: { id: userData.id } });
        
        if (!user) throw new HttpException(400, `confirmation code not valid`);
        if (user.confirmationCode !== codeConfimation) throw new HttpException(400, `confirmation code not valid`);

        if (user.isVerfied) throw new HttpException(400, `user already verified`);
        user.isVerfied = true;
        await user.save();
        
        return user;
    }
}