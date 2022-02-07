import { Request, Response, NextFunction } from 'express';
import { SOMETHING_WENT_WRONG } from '../constants/messages';
import Error from '../helpers/Error';
import ValidationHelper from '../helpers/ValidationHelper';
import Blog from '../entities/Blog';

export default class BlogMiddleware {
    public async validateBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = await ValidationHelper.validateData(Blog, req.body);
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
