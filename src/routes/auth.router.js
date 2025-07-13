import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));

export default authRouter;
