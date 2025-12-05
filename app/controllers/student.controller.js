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

    static async uploadProfilePicture(req, res) {
        if (!req.file) {
            return res.status(400).json({ message: "No se subió ninguna imagen" });
        }

        const userId = req.user.userId;
        const newUrl = req.file.location;
        const newKey = req.file.key;

        try {
            const result = await studentModel.updateProfilePicture(userId, newUrl, newKey);

            if (!result.success) {
                await s3.send(new DeleteObjectCommand({ 
                    Bucket: process.env.AWS_BUCKET_NAME, Key: newKey 
                }));
                return res.status(500).json({ message: "Error al actualizar perfil" });
            }

            if (result.oldKeyToDelete) {
                s3.send(new DeleteObjectCommand({ 
                    Bucket: process.env.AWS_BUCKET_NAME, 
                    Key: result.oldKeyToDelete 
                })).catch(err => console.error("Error borrando foto vieja:", err));
            }

            return res.status(200).json({ 
                message: "Foto de perfil actualizada", 
                url: result.newUrl 
            });

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
}