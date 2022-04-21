import { Request } from "express";
import { User } from '.';

export interface RequestWithUser extends Request {
    user: User;
}

export interface RequestWithUserGeneric<T> extends Request<T> {
    user: User;
}