import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

router.get('/user', (req, res) => authController.user(req, res));

export default router;