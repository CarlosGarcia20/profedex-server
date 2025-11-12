import { userModel } from "../models/user.model.js";
import { validateRegister } from "../schemas/register.js";
import { EncryptionHelper } from "../utils/encryption.helper.js";
import { validateUniqueNickname } from "../helpers/validateNickname.js";

export class userController {
    static async validateNickname(req, res) {
        try {
            const { nickname } = req.body;

            const result = await validateUniqueNickname(nickname);

             if (!result.success) {
                return res.status(400).json({ message: result.error.message });
            }

            return res.status(200).json({ message: "El nickname está disponible" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async createUser(req, res) {
        try {
            const registerValidation = validateRegister(req.body);

            if (!registerValidation.success) {
                return res.status(400).json({
                    message: JSON.parse(registerValidation.error.message)
                })
            }

            const { nickname, name, password } = registerValidation.data;

            const nicknameValidation = await validateUniqueNickname(nickname);
            if (!nicknameValidation.success) {
                return res.status(400).json({ message: nicknameValidation.error.message });
            }

            const hashPassword = await EncryptionHelper.hashPassword(password);
            
            const result = await userModel.createUser({ 
                name,
                nickname,
                password: hashPassword 
            });

            if (!result.success) {
                return res.status(500).json({ message: result.error });
            }

            return res.status(201).json({ message: "Usuario creado con éxito" });
            
        } catch (error) {
            console.log(error);
            
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