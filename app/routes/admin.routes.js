import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";


export const adminRouter = Router();

adminRouter.get('/users', /* validacion del token */ adminController.getUsers);

adminRouter.post('/users', /* validacion del token */ adminController.createUser);

adminRouter.post('/users/validate-nickname', /* validacion del token */ adminController.validateNickname);

adminRouter.put('/users/:userId', /* validacion del token */ adminController.updateDataUser);

adminRouter.delete('/users/:userId', /* validacion del token */ adminController.deleteUser);