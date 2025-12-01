import { Router } from "express";
import { requireAuth } from "../middlewares/token.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";
// Controladores
import { subjectController } from "../controllers/subject.controller.js";
import { majorController } from "../controllers/major.controller.js";
import { groupController } from "../controllers/group.controller.js";
import { userController } from "../controllers/user.controller.js";


const ROLES = {
    ADMIN: '1',       
    PROFESSOR: '2',
    STUDENT: '3'
};

export const adminRouter = Router();

/* Usuarios */
adminRouter.get(
    '/users', 
    [
        requireAuth, 
        verifyRole([ROLES.ADMIN])
    ], 
    userController.getUsers
);
adminRouter.post('/users', /* validacion del token */ userController.createUser);
adminRouter.post('/users/validate-nickname', /* validacion del token */ userController.validateNickname);
adminRouter.put('/users/:userId', /* validacion del token */ userController.updateDataUser);
adminRouter.delete('/users/:userId', /* validacion del token */ userController.deleteUser);

/* Carreras */
adminRouter.get('/majors', majorController.getMajors);
adminRouter.get('/majors/:majorId', majorController.getMajorPerId);
adminRouter.post('/majors', majorController.createMajor);
adminRouter.put('/majors/:majorId', majorController.updateMajor);
adminRouter.delete('/majors/:majorId', majorController.deleteMajor)

/* Materias */
adminRouter.get('/groups', groupController.getGroups);
adminRouter.get('/groups/:groupId', groupController.getGroupPerId);
adminRouter.post('/groups', groupController.createGroup);
adminRouter.put('/groups/:groupId', groupController.updateGroup);
adminRouter.delete('/groups/:groupId', groupController.deleteGroup)

/* Materias */
adminRouter.get('/subjects', subjectController.getSubjects);
adminRouter.get('/subjects/:subjectId', subjectController.getSubjectPerId);
adminRouter.post('/subjects', subjectController.createSubject);
adminRouter.put('/subjects/:subjectId', subjectController.updateSubject);
adminRouter.delete('/subjects/:subjectId', subjectController.deleteSubject)