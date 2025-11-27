import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/token.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";

const ROLES = {
    ADMIN: '1',       
    PROFESSOR: '2',
    STUDENT: '3'
};

export const adminRouter = Router();

adminRouter.get(
    '/users', 
    [
        requireAuth, 
        verifyRole([ROLES.ADMIN])
    ], 
    adminController.getUsers
);

adminRouter.post('/users', /* validacion del token */ adminController.createUser);

adminRouter.post('/users/validate-nickname', /* validacion del token */ adminController.validateNickname);

adminRouter.put('/users/:userId', /* validacion del token */ adminController.updateDataUser);

adminRouter.delete('/users/:userId', /* validacion del token */ adminController.deleteUser);