import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.get('/user', (req, res) => authController.user(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.delete('/logout', (req, res) => authController.logout(req, res));

export default router;
