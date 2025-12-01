import { Router } from "express";
import { requireAuth } from "../middlewares/token.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";
// Controladores
import { adminController } from "../controllers/admin.controller.js";
import { subjectController } from "../controllers/subject.controller.js";
import { majorController } from "../controllers/major.controller.js";

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

/* Carreras */
adminRouter.get('/majors', majorController.getMajors);
adminRouter.get('/majors/:majorId', majorController.getMajorPerId);
adminRouter.post('/majors', majorController.createMajor);
adminRouter.put('/majors/:majorId', majorController.updateMajor);
adminRouter.delete('/majors/:majorId', majorController.deleteMajor)


/* Materias */
adminRouter.get('/subjects', subjectController.getSubjects);
adminRouter.get('/subjects/:subjectId', subjectController.getSubjectPerId);
adminRouter.post('/subjects', subjectController.createSubject);
adminRouter.put('/subjects/:subjectId', subjectController.updateSubject);
adminRouter.delete('/subjects/:subjectId', subjectController.deleteSubject)