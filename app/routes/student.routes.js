import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { requireAuth } from "../middlewares/token.js";

export const studentRouter = Router();

studentRouter.get('/me/group', [requireAuth], studentController.getMyGroup);
studentRouter.get('/me/info', [requireAuth], studentController.getMyinfo);
studentRouter.get('/me/schedules', [requireAuth], studentController.getMySchedules);  
studentRouter.get('/me/retakes', [requireAuth], studentController.getRetakesByStudent);
studentRouter.get('/me/teachers', [requireAuth], studentController.getMyTeachers);