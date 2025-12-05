import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { requireAuth } from "../middlewares/token.js";
import { uploadProfile } from "../middlewares/uploadMiddleware.js";

export const studentRouter = Router();

studentRouter.get('/me/group', [requireAuth], studentController.getMyGroup);
studentRouter.get('/me/info', [requireAuth], studentController.getMyinfo);
studentRouter.get('/me/schedules', [requireAuth], studentController.getMySchedules);  
studentRouter.patch(
    '/profile-picture', 
    [
        requireAuth,
        uploadProfile.single('avatar')
    ], 
    studentController.uploadProfilePicture
)
studentRouter.get('/me/retakes', [requireAuth], studentController.getRetakesByStudent);
studentRouter.get('/me/teachers', [requireAuth], studentController.getMyTeachers);