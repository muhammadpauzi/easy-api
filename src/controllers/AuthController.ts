import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import {
    CREDENTIALS_MESSAGE,
    USER_ALREADY_EXISTS,
    USER_HAS_BEEN_SUCCESSFULLY_LOGGED_OUT,
    USER_HAS_BEEN_SUCCESSFULLY_REGISTERED,
    USER_HAS_BEEN_SUCESSFULLY_LOGGED_IN,
} from '../constants/messages';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import StringHelper from '../helpers/StringHelper';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthRepository from '../repositories/AuthRepository';
import { Secret, sign } from 'jsonwebtoken';

export default class AuthController {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    public async user(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id } = req.user;
            const user = await this.authRepository.getUser({
                where: {
                    id,
                },
            });
            return ApiResponse.successResponse(res, { data: user });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            let user = await this.authRepository.getUser({
                where: {
                    username,
                    password,
                },
            });
            const isSame = await compare(password, user.password);
            // username or password are not registered on database
            if (!user || !isSame)
                return Error.handleValidationError(res, {
                    message: 'Whoops! Something went wrong.',
                    errors: [CREDENTIALS_MESSAGE],
                });

            // for securing jwt -> pzn video php jwt ngobar
            const sessionId = await StringHelper.getRandomKey();
            user = this.authRepository.updateSessionIdBy(
                { username: user.username },
                sessionId
            );

            const payload = await sign(
                {
                    user: { id: user.id }, // fix! move sessionId into user
                    sessionId: sessionId,
                },
                <Secret>process.env.JWT_SECRET_KEY,
                {
                    expiresIn: '7d',
                }
            );

            res.cookie('token', payload, { httpOnly: true });

            return ApiResponse.successResponse(res, {
                message: USER_HAS_BEEN_SUCESSFULLY_LOGGED_IN,
                user: {
                    id: user.id,
                    username: user.username,
                },
            });
        } catch (error) {
            console.log(error);
            return Error.handleError(res, error);
        }
    }

    public async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            let user = await this.authRepository.getUser({
                where: {
                    username,
                },
            });

            if (user)
                return ApiResponse.errorResponse(res, 409, {
                    message: USER_ALREADY_EXISTS,
                });

            const createdUser = await this.authRepository.createUser({
                username,
                password,
            });

            return ApiResponse.successCreatedResponse(res, {
                message: USER_HAS_BEEN_SUCCESSFULLY_REGISTERED,
                user: {
                    id: createdUser.id,
                    username: createdUser.username,
                },
            });
        } catch (error) {
            console.log(error);
            return Error.handleError(res, error);
        }
    }

    public async logout(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id } = req.user;
            // reset sessionId of the user
            await this.authRepository.updateSessionIdBy(
                { id: Number(id) },
                null
            );
            // reset token in cookie
            res.cookie('token', '');

            return ApiResponse.successResponse(res, {
                message: USER_HAS_BEEN_SUCCESSFULLY_LOGGED_OUT,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
