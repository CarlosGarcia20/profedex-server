import { token } from "../middlewares/token.js";
import { authModel } from "../models/auth.models.js";
import { validateLogin } from "../schemas/auth.js";

export class authController {
    static async login(req, res) {
        try {
            const authValidation = await validateLogin(req.body);

           if (!authValidation.success) {
                return res.status(400).json({ message: JSON.parse(authValidation.error.message) });
            }

            const { username, password } = authValidation.data;

            const result = await authModel.login({ username, password });

            if(!result.success) return res.status(404).json({ message: result.message });

            const accessToken = await token.generateToken({ userIdRol: result.data.idRol });
            const refreshToken = await token.generateRefreshToken({ userIdRol: result.data.idRol });

            res.cookie("accessToken", accessToken, {
                maxAge: 300000,  // 5 Minutos
                httpOnly: true
            })

            res.cookie("refreshToken", refreshToken, {
                maxAge: 604800,  // 7 dias
                httpOnly: true
            })

            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                user: {
                    nickname: result.data.nickname,
                    name: result.data.name
                }
            })
            

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}