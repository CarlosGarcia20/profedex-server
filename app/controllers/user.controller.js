import { userModel } from "../models/user.model.js";
import { validateRegister } from "../schemas/register.js";

export class userController {
    static async createUser(req, res) {
        try {
            try {
                const validate = validateRegister(req.body);

                if (!validate.success) {
                    return res.status(400).json({
                        message: JSON.parse(result.error.message)
                    })
                }

                const result = await userModel.createUser({ input: validate.data });

                if (!result.success) {
                    return res.status(500).json({ message: result.error });
                }

                return res.status(201).json({ message: result });
                
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal Server Error" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async updateDataUser(req, res) {
        try {
            // Cambiar la lógica para actualizar datos del usuario
            const validate = validateRegister(req.body);

            if (!validate.success) {
                return res.status(400).json({
                    message: JSON.parse(result.error.message)
                })
            }

            // const result = await userModel
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}