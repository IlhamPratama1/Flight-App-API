import { Request } from "express";
import { User } from '.';

export interface signinInterface {
    email: string,
    password: string
}

export interface signupInterface {
    username: string,
    email: string,
    password: string
}

export interface getRefreshInterface {
    refreshToken: string
}

export interface DataStoredInToken {
    id: number;
}  

export interface RequestWithUser extends Request {
    user: User;
}
  