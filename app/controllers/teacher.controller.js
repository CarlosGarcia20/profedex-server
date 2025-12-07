import { teacherModel } from "../models/teacher.model.js"

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

            if (!result.success) return res.status(404).json({ message: "No hay maestros disponibles" })

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    
}