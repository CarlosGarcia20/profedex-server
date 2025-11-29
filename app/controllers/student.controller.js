import { studentModel } from "../models/student.model.js"

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
}