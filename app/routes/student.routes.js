import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { requireAuth } from "../middlewares/token.js";

export const studentRouter = Router();

studentRouter.get('/me/group', [requireAuth], studentController.getMyGroup);