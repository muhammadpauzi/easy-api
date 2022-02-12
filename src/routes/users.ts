import { Router } from 'express';
import UserController from '../controllers/UserController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();
const userController = new UserController();
const { verifyJwtToken } = new AuthMiddleware();

router.get(
    '/',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => userController.users(req, res)
);

router.get(
    '/:id',
    (req, ...args) =>
        verifyJwtToken(<IGetUserAuthInfoRequest>(<unknown>req), ...args),
    (req, res) => userController.user(req, res)
);

export default router;
