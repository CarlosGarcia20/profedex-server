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
    
    static async updateEvent(req, res) {
        const { eventId } = req.params;
        const userId = req.user.userId;
        const newImageUrl = req.file ? req.file.location : null;
        const newS3Key = req.file ? req.file.key : null;

        try {
            const eventValidation = validateEvent(req.body);

            if (!eventValidation.success) {
                if (newS3Key) await deleteImageOnError(newS3Key);

                return res.status(400).json({
                    message: "Datos incorrectos",
                    errors: eventValidation.error.flatten().fieldErrors
                });
            }

            const result = await teacherModel.updateEvent({
                eventId,
                userId,
                name: eventValidation.data.name,
                description: eventValidation.data.description || null,
                date: eventValidation.data.date,
                status: eventValidation.data.status,
                image: newImageUrl,
                s3Key: newS3Key,
            });

            if (!result.success) {
                if (newS3Key) await deleteImageOnError(newS3Key);

                if (result.type === 'not_found') {
                    return res.status(404).json({ 
                        message: "Evento no encontrado o no autorizado" 
                    });
                } 

                return res.status(500).json({ message: "Error al actualizar el evento" })
            }

            if (newS3Key && result.oldS3Key) {
                deleteImageOnError(result.oldS3Key);
            }
            
            return res.status(200).json({ message: "Evento actualizado con éxito" });
        } catch (error) {
            if (newS3Key) await deleteImageOnError(newS3Key);
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async deleteEvent(req, res) {
        try {
            const { eventId } = req.params;

            const result = await teacherModel.deleteEvent(eventId);

            if (!result.success) {
                if (result.type === 'not_found') {
                    return res.status(404).json({ message: "El evento no existe" });
                }

                return res.status(500).json({ message: "Error al procesar el evento" });
            }

            if (result.action === 'disabled') {
                return res.status(200).json({ 
                    message: "El evento se ha desactivado" 
                });
            }

            if (result.s3Key) {
                deleteImageOnError(result.s3Key);
            }

            return res.sendStatus(204);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const deleteImageOnError = async (s3Key) => {
    if (!s3Key) return;
    try {
        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key
        }));
        console.log(`Imagen eliminada de S3: ${s3Key}`);
    } catch (err) {
        console.error("Error crítico: No se pudo borrar la imagen huérfana de S3", err);
    }
};