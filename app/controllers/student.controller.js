import { studentModel } from "../models/student.model.js"
import { s3 } from '../middlewares/uploadMiddleware.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export class studentController {
    static async getMyGroup(req, res) {
        try {
            const userId = req.user.userId;

            const result = await studentModel.getGroupInfo(userId);

            if(!result.success) {
                return res.status(404).json({ message: "No tienes grupo asignado" });
            }
    
            return res.status(200).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    static async getMyinfo(req, res) {
        try {
            const userId = req.user.userId;

            const result = await studentModel.getMyinfo(userId);

            if(!result.success) {
                return res.status(404).json({ message: "Ocurrió un error al obtener la información" });
            }

            return res.status(200).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getMySchedules(req, res) {
        try {
            const userId = req.user.userId;

            const result = await studentModel.getMySchedules(userId);

            if (!result.success) {
                return res.status(404).json({ message: "No tienes horarios asignados" });
            }

            return res.status(200).json({ 
                data: result.data,
                group: result.group
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    static async getRetakesByStudent(req, res) {
        try {
            const userId = req.user.userId;

            const result = await studentModel.getRetakesByStudent(userId);

            if (!result.success) {
                return res.status(404).json({ message: "No tienes materias por recursar" });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getMyTeachers(req, res) {
        try {
            const userId = req.user.userId;

            const result = await studentModel.getMyTeachers(userId);
            
            if (!result.success) {
                return res.status(404).json({ message: "No tienes maestros asignados" });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getAllTeachersCards(req, res) {
        try {
            const result = await studentModel.getAllTeachersCards();
            
            if (!result.success) {
                return res.status(404).json({ message: "No hay maestros disponibles" });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    static async voteTeacher(req, res) {
        const { type } = req.body; 
        const { teacherId } = req.params;
        const studentId = req.user.userId;

        const value = type === 'up' ? 1 : -1;

        const result = await studentModel.toggleVote({ studentId, masterId: teacherId, value });
        
        if (!result.success) return res.status(500).json({ message: "Error al votar" });

        return res.status(200).json({ message: "Voto actualizado" });
    }

    static async getCommentsByTeacher(req, res) {
        try {
            const { teacherId } = req.params;

            const result = await studentModel.getCommentsByTeacher(teacherId);
            
            if (!result.success) {
                return res.status(404).json({ message: "No hay comentarios disponibles" });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    static async createComment(req, res) {
        try {
            const userId = req.user.userId;
            const { teacherId } = req.params;
            const { content } = req.body;
            
            const result = await studentModel.createComment({
                userId,
                teacherId: teacherId,
                content
            });
            
            if (!result.success) {
                return res.status(500).json({ message: "Ocurrió un error al crear el comentario" })
            }
            
            return res.status(201).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
} 