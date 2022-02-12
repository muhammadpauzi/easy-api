import { Request, Response, NextFunction } from 'express';

export default class StringMiddleware {
    public trimRequestBody(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'POST') {
            for (const [key, value] of Object.entries(req.body)) {
                if (typeof value === 'string') req.body[key] = value.trim();
            }
        }
        next();
    }
}
