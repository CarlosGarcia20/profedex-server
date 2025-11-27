import { checkContentSafety } from '../utils/moderationAI.js';
import { s3 } from '../middlewares/uploadMiddleware.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { postModel } from '../models/post.model.js';
import 'dotenv/config';

export class postController {
    static async createPost(req, res) {
        if (!req.file) return res.status(400).json({ message: "Falta la imagen" });

        const { key: s3Key, location: imageUrl } = req.file;
        const userId = req.user.userId;

        try {
            const moderation = await checkContentSafety(process.env.AWS_BUCKET_NAME, s3Key);

            if (!moderation.isSafe) {
                await s3.send(new DeleteObjectCommand({ 
                    Bucket: process.env.AWS_BUCKET_NAME, Key: s3Key 
                }));

                return res.status(400).json({ 
                    message: "Imagen rechazada", reasons: moderation.labels 
                });
            }

            const result = await postModel.createPost({ userId, imageUrl, s3Key });

            if (!result.success) {
                return res.status(500).json({ message: "Error al guardar en BD" });
            }

            return res.status(201).json({ 
                message: "Imagen subida con éxito",
            });

        } catch (error) {
            return res.status(500).json({ message: "Error interno" });
        }
    }

    static async getAllPosts(req, res) {
        try {
            const result = await postModel.getAllPosts();

            if (!result.success) {
                return res.status(500).json({ message: "Error al obtener publicaciones" });
            }

            return res.status(200).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    static async getMyPosts(req, res) {
        try {
            const userId = req.user.userId;

            const result = await postModel.getMyPosts(userId);

            if(!result.success) {
                return res.status(404).json({ message: "No se encontraron imágenes del usuario "})
            }

            return res.status(200).json(result.data)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
