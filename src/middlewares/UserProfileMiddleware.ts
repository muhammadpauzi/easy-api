import { Request, Response, NextFunction } from 'express';
import { SOMETHING_WENT_WRONG } from '../constants/messages';
import Error from '../helpers/Error';
import ValidationHelper from '../helpers/ValidationHelper';
import UserProfile from '../entities/UserProfile';

export default class UserProfileMiddleware {
    public async validateUserProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = await ValidationHelper.validateData(
                UserProfile,
                req.body
            );
            if (errors === true) return next();
            return Error.handleValidationError(res, {
                message: SOMETHING_WENT_WRONG,
                errors,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
