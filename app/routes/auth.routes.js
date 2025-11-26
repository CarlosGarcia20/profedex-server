import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post('/', authController.login);

authRouter.post('/logout', authController.logout);

authRouter.get('/refresh', authController.refreshToken);