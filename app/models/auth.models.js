import { success } from "zod";
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
                    nickname: rows[0].nickname,
                    name: rows[0].name
                } 
            }
        } catch (error) {
            return { success: false, error };
        }
    }
}