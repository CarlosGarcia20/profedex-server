import { teacherModel } from "../models/teacher.model.js"
import { validateEvent } from "../schemas/event.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadMiddleware.js";

export class teacherController {
    static async getTeachers(req, res) {
        try {
            const result = await teacherModel.getTeachers();

            if (!result.success) return res.status(404).json({ message: "No hay maestros disponibles" })

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async getMyInfo(req, res) {
        try {
            const userId = req.user.userId;

            const result = await teacherModel.getMyInfo(userId);

            if (!result.success) return res.status(404).json({ message: "Error al obtener la información" })
                
                return res.status(200).json({ data: result.data });
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" })
            }
        }
        
        static async getMySchedules(req, res) {
        try {
            const userId = req.user.userId;
            
            const result = await teacherModel.getMySchedules(userId);
            console.log(result);
            

            if (!result.success) return res.status(404).json({ message: "Error al obtener la información" })

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async createEvent(req, res) {
        const userId = req.user.userId;
        const imageUrl = req.file ? req.file.location : null;
        const s3Key = req.file ? req.file.key : null;

        try {

            const eventValidation = validateEvent(req.body);

            if (!eventValidation.success) {
                await deleteImageOnError(s3Key)
                return res.status(400).json({
                    message: "Datos incorrectos",
                    errors: eventValidation.error.flatten().fieldErrors
                });
            }

            const result = await teacherModel.createEvent({
                name: eventValidation.data.name,
                description: eventValidation.data.description,
                date: eventValidation.data.date,
                image: imageUrl,
                s3Key: s3Key,
                status: eventValidation.data.status,
                userId: userId
            });

            if (!result.success) {
                await deleteImageOnError(s3Key);
                return res.status(500).json({ message: "Error al crear el evento" })
            }

            return res.status(201).json({ message: "Evento creado con éxito" });
        } catch (error) {
            await deleteImageOnError(s3Key);
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async getMyEvents(req, res) {
        try {
            const userId = req.user.userId;

            const result = await teacherModel.getMyEvents(userId);

            if (!result.success) {
                return res.status(404).json({ message: "No tiene eventos creados" });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

const deleteImageOnError = async (s3Key) => {
    if (!s3Key) return;
    try {
        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key
        }));
        console.log(`🗑️ Imagen eliminada de S3 por error en transacción: ${s3Key}`);
    } catch (err) {
        console.error("Error crítico: No se pudo borrar la imagen huérfana de S3", err);
    }
};