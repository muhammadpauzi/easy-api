import { Router } from 'express';
import BlogLikeController from '../controllers/BlogLikeController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();
const blogLikeController = new BlogLikeController();
const { verifyJwtToken } = new AuthMiddleware();

router.post(
    '/:id/like',
    (req, ...args) =>
        verifyJwtToken(<IGetUserAuthInfoRequest>(<unknown>req), ...args),
    (req, res) =>
        blogLikeController.like(<IGetUserAuthInfoRequest>(<unknown>req), res)
);

export default router;
