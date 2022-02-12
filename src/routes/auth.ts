import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import StringMiddleware from '../middlewares/StringMiddleware';

const router = Router();
const authController = new AuthController();
const { trimRequestBody } = new StringMiddleware();
const { verifyJwtToken, blockLoggedInUser, validateUser } =
    new AuthMiddleware();

router.get(
    '/user',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => authController.user(<IGetUserAuthInfoRequest>req, res)
);
router.post('/login', trimRequestBody, blockLoggedInUser, (req, res) =>
    authController.login(req, res)
);
router.post(
    '/register',
    trimRequestBody,
    validateUser,
    blockLoggedInUser,
    (req, res) => authController.register(req, res)
);
router.delete(
    '/logout',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => authController.logout(<IGetUserAuthInfoRequest>req, res)
);

export default router;
