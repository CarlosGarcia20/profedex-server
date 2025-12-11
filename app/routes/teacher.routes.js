import { Router } from "express";
import { requireAuth } from "../middlewares/token.js";
import { teacherController } from "../controllers/teacher.controller.js";
import { uploadEvent } from "../middlewares/uploadMiddleware.js";

export const teacherRouter = Router();

teacherRouter.get('/me-info', [requireAuth], teacherController.getMyInfo);
teacherRouter.get('/me/schedules', [requireAuth], teacherController.getMySchedules);
teacherRouter.post(
    '/event', 
    [
        requireAuth,
        uploadEvent.single('image')
    ], 
    teacherController.createEvent
);
teacherRouter.get('/my-events', [requireAuth], teacherController.getMyEvents);
teacherRouter.put(
    '/event/:eventId', 
    [
        requireAuth,
        uploadEvent.single('image')
    ], 
    teacherController.updateEvent
);
teacherRouter.delete('/event/:eventId', [requireAuth], teacherController.deleteEvent);