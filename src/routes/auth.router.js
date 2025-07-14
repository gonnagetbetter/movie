import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middleware/validation.middleware.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validateRegister, (req, res) => authController.register(req, res));
authRouter.post('/login', validateLogin, (req, res) => authController.login(req, res));

export default authRouter;
