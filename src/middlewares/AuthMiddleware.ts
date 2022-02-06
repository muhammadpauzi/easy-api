import {
    TokenExpiredError,
    verify,
    Secret,
    JwtPayload,
    JsonWebTokenError,
} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {
    NO_TOKEN_PROVIDED,
    NO_USER_WITH_THE_TOKEN,
    SERVER_ERROR,
    SOMETHING_WENT_WRONG,
    THE_USER_ALREADY_LOGGED_IN,
    THE_USER_ALREADY_LOGGED_OUT,
    TOKEN_NOT_VALID,
} from '../constants/messages';
import User from '../entities/User';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import ValidationHelper from '../helpers/ValidationHelper';

export default class AuthMiddleware {
    public async verifyJwtToken(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            // get token from cookie
            if (!req.cookies.token)
                return ApiResponse.errorUnauthorizedResponse(res, {
                    message: NO_TOKEN_PROVIDED,
                });
            const { token: jwtToken } = req.cookies;

            const decodedToken: JwtPayload = <JwtPayload>(
                verify(jwtToken, <Secret>process.env.JWT_SECRET_KEY)
            );

            const user = await User.findOne({
                where: {
                    id: decodedToken.user.id,
                },
            });

            if (!user)
                return ApiResponse.errorResponse(res, 404, {
                    message: NO_USER_WITH_THE_TOKEN,
                });

            if (!user.sessionId)
                return ApiResponse.errorUnauthorizedResponse(res, {
                    message: THE_USER_ALREADY_LOGGED_OUT,
                });

            req.user = {
                id: user.id,
                username: user.username,
            };
            next();
        } catch (error) {
            console.log(error);
            if (error instanceof TokenExpiredError)
                return ApiResponse.errorUnauthorizedResponse(res, {
                    message: NO_TOKEN_PROVIDED,
                });
            if (error instanceof JsonWebTokenError)
                return ApiResponse.errorUnauthorizedResponse(res, {
                    message: TOKEN_NOT_VALID,
                });
            return Error.handleError(res, error);
        }
    }

    public async blockLoggedInUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!req.cookies.token) return next();

            const { token: jwtToken } = req.cookies;
            try {
                const decodedToken: JwtPayload = <JwtPayload>(
                    verify(jwtToken, <Secret>process.env.JWT_SECRET_KEY)
                );

                const user = await User.findOne({
                    where: {
                        id: decodedToken.user.id,
                    },
                });

                if (user && user.sessionId) {
                    return ApiResponse.errorResponse(res, 403, {
                        message: THE_USER_ALREADY_LOGGED_IN,
                    });
                }
                return next(); // user not exists on db or jwt error must be run next() function
            } catch (error) {}
        } catch (error) {
            console.log(error);
            if (error instanceof JsonWebTokenError) return next();
            return Error.handleError(res, error);
        }
    }

    public async validateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = await ValidationHelper.validateData(User, req.body);
            if (errors === true) return next();
            return Error.handleValidationError(res, {
                message: SOMETHING_WENT_WRONG,
                errors,
            });
        } catch (error) {
            console.log(error);
            return Error.handleError(res, error);
        }
    }
}
