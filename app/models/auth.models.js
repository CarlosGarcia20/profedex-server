import pool from "../config/db.js";
import { EncryptionHelper } from "../utils/encryption.helper.js";

export class authModel {
    static async login({ username, password }) {
        try {
            const { rows } = await pool.query(
                `SELECT * 
                FROM users 
                WHERE nickname = $1`,
                [username]
            );

            if (rows.length === 0) return { success: false, message: "Usuario no encontrado" }

            const validatePassword = await EncryptionHelper.comparePassword(password, rows[0].password);

            if(!validatePassword) return { success: false, message: "Contraseña incorrecta" }

            return { 
                success: true, 
                data: {
                    userId: rows[0].userid,
                    nickname: rows[0].nickname,
                    name: rows[0].name,
                    idRol: rows[0].idrol,
                    image: rows[0].image
                } 
            }
        } catch (error) {
            return { success: false, error };
        }
    }
}