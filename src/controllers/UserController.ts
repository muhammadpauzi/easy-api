import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import {
    CREDENTIALS_MESSAGE,
    SOMETHING_WENT_WRONG,
    USER_ALREADY_EXISTS,
    USER_HAS_BEEN_SUCCESSFULLY_LOGGED_OUT,
    USER_HAS_BEEN_SUCCESSFULLY_REGISTERED,
    USER_HAS_BEEN_SUCESSFULLY_LOGGED_IN,
} from '../constants/messages';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import StringHelper from '../helpers/StringHelper';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import { Secret, sign } from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';

export default class UserController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async users(req: Request, res: Response) {
        try {
            const users = await this.userRepository.getUsers({
                order: {
                    createdAt: 'DESC',
                },
            });
            return ApiResponse.successResponse(res, { data: users });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async user(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const withBlogs = ['true', '1'].includes(req.params.with_blogs);
            const user = await this.userRepository.getUser({
                where: {
                    id,
                },
                relations: withBlogs ? ['blogs'] : [],
                order: {
                    createdAt: 'DESC',
                },
            });
            return ApiResponse.successResponse(res, { data: user });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
