import { adminModel } from "../models/admin.model.js";

export class adminController {
    static async getRoles(req, res) {
        try {
            const result = await adminModel.getRoles();

            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}