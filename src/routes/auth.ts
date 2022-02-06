import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';

const router = Router();
const authController = new AuthController();

router.get('/user', (req, res) =>
    authController.user(<IGetUserAuthInfoRequest>req, res)
);
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.delete('/logout', (req, res) =>
    authController.logout(<IGetUserAuthInfoRequest>req, res)
);

export default router;
