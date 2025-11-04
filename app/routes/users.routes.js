import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.post('/register', userController.createUser)

userRouter.post('/validate-nickname', userController.validateNickname);

