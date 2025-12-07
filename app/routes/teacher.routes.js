import { Router } from "express";
import { requireAuth } from "../middlewares/token.js";
import { teacherController } from "../controllers/teacher.controller.js";

export const teacherRouter = Router();

teacherRouter.get('/me-info', [requireAuth], teacherController.getMyInfo);
