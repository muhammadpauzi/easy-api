import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();
const authController = new AuthController();
const { verifyJwtToken, blockLoggedInUser, validateUser } =
    new AuthMiddleware();

router.get(
    '/user',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => authController.user(<IGetUserAuthInfoRequest>req, res)
);
router.post('/login', blockLoggedInUser, (req, res) =>
    authController.login(req, res)
);
router.post('/register', validateUser, blockLoggedInUser, (req, res) =>
    authController.register(req, res)
);
router.delete(
    '/logout',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => authController.logout(<IGetUserAuthInfoRequest>req, res)
);

export default router;
