import { validateUniqueNickname } from "../helpers/validateNickname.js";
import { userModel } from "../models/user.model.js";
import { validateRegister } from "../schemas/register.js";
import { validateUpdateUser } from "../schemas/user-data.js";
import { validateUUID } from "../schemas/uuid.js";
import { EncryptionHelper } from "../utils/encryption.helper.js";

const ROLE_IDS = {
    "ADMIN": 1,
    "PROFESSOR": 2,
    "STUDENT": 3
};

export class userController {
    static async getUsers(req, res) {
        try {
            const result = await userModel.getUsers();

            if (!result.success) {
                return res.status(500).json({
                    message: "Error al obtener los usuarios",
                    error: result.error
                });
            }

            res.status(200).json({ data: result.data });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

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

            const data = registerValidation.data;
            const idRol = ROLE_IDS[data.role];

            const nicknameValidation = await validateUniqueNickname(data.nickname);
            if (!nicknameValidation.success) {
                return res.status(400).json({ message: nicknameValidation.error.message });
            }

            const hashPassword = await EncryptionHelper.hashPassword(data.password);

            const userData = {
                ...data,
                password: hashPassword,
                idRol: idRol
            }

            const result = await userModel.createUser({ userData });

            if (!result.success) {
                if (result.type === 'conflict') {
                    return res.status(409).json({ message: result.error });
                }

                return res.status(500).json({ message: "Error interno al guardar usuario" });
            }

            return res.status(201).json({ message: "Usuario creado con éxito" });

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async updateDataUser(req, res) {
        try {
            const { userId } = req.params;

            const updateValidation = validateUpdateUser(req.body);

            if (!updateValidation.success) {
                return res.status(400).json({
                    message: JSON.parse(updateValidation.error.message)
                });
            }

            let validatedData = updateValidation.data;

            if (validatedData.password) {
                validatedData.password = await EncryptionHelper.hashPassword(validatedData.password);
            }

            const result = await userModel.updateDataUser({
                userId,
                data: validatedData
            });
            
            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json({
                message: result.message,
                user: result.user
            });

        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            const uuidValidation = validateUUID({ userId });

            if (!uuidValidation.success) {
                return res.status(400).json({
                    message: JSON.parse(uuidValidation.error.message)
                });
            }

            const result = await userModel.deleteUser({ userId: uuidValidation.data.userId });

            if (!result.success) {
                return res.status(404).json({ message: "El usuario no existe o ya fue eliminado" });
            }

            return res.status(200).json({ message: "Usuario eliminado con éxito " });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}