import { validateRegister } from "../schemas/register.js";

export class authController {
    static async login(req, res) {
        try {
            

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}