import { tokenManager } from "../utils/tokenManager.js";
import { authModel } from "../models/auth.models.js";
import { tokenModel } from "../models/token.model.js";
import { validateLogin } from "../schemas/auth.js";

export class authController {
    static async login(req, res) {
        try {
            const authValidation = validateLogin(req.body);

            if (!authValidation.success) {
                return res.status(400).json({ 
                    message: "Datos incorrectos", 
                    errors: authValidation.error.flatten().fieldErrors 
                });
            }

            const { username, password } = authValidation.data;

            const result = await authModel.login({ username, password });

            if(!result.success) return res.status(401).json({ message: "Credenciales inválidas" });

            const accessToken = tokenManager.generateToken({ 
                userId: result.data.userId,
                userIdRol: result.data.idRol 
            });
            const refreshToken = tokenManager.generateRefreshToken({ 
                userId: result.data.userId,
                userIdRol: result.data.idRol 
            });
            
            await tokenModel.saveUserToken({
                userId: result.data.userId,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            res.cookie("accessToken", accessToken, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                // secure: true,
                sameSite: 'lax'
            });

            res.cookie("refreshToken", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                // secure: true, 
                sameSite: 'lax'
            });

            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                user: {
                    nickname: result.data.nickname,
                    name: result.data.name,
                    idRol: result.data.idRol,
                    image: result.data.image
                }
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async logout(req, res) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ message: "Sesión cerrada" });
        }
        
        await tokenModel.revokeToken(refreshToken);

        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'lax'
            // secure: true
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'lax'
            // secure: true
        });
        
        return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) throw new Error("No token");

            const data = tokenManager.verifyRefreshToken(refreshToken);

            const dbToken = await tokenModel.findToken({ token: refreshToken });
            if (!dbToken.success) return res.status(403).json({ message: "Revocado" });

            const newAccessToken = tokenManager.generateToken({ 
                userId: data.userId, 
                userIdRol: data.userIdRol 
            });

            res.cookie("accessToken", newAccessToken, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                // secure: true,
                sameSite: 'lax'
            });
            res.json({ message: "Refrescado" });

        } catch (error) {
            return res.status(403).json({ message: "Invalido" });
        }
    }
}