import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
    user: {
        id: string | number;
        username: string;
    };
}