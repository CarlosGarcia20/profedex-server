import { Router } from "express";
import { requireAuth } from "../middlewares/token";
import { teacherController } from "../controllers/teacher.controller";

export const teacherRouter = Router();

teacherRouter.get('/cards', [requireAuth], teacherController.getTeacherInfoCard);