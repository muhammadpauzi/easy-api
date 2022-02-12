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

    public async user(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id } = req.user;
            const { password, sessionId, ...user } =
                await this.userRepository.getUserById(id);
            return ApiResponse.successResponse(res, { data: user });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
