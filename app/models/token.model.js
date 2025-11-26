import { success } from "zod";
import pool from "../config/db.js";

export class tokenModel {
    static async saveUserToken({ userId, token, expiresAt }) {
        try {
            await pool.query(
                `
                INSERT INTO refresh_tokens (token, user_id, expires_at)
                VALUES ($1, $2, $3)
                `,
                [ token, userId, expiresAt ]
            );

        } catch (error) {
            return { success: false, error }
        }
    }

    static async findToken({ token }) {
        try {
            const { rows } = await pool.query(
                `SELECT token FROM refresh_tokens
                WHERE token = $1`,
                [token]
            );

            if (rows.length === 0) {
                return { success: false, message: "No existe el token solicitado" }
            }

            return {
                success: true,
                token: rows[0].token
            }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async revokeToken( token ) {
        try {
            await pool.query(
            `
                DELETE FROM refresh_tokens WHERE token = $1
            `,
            [token]
        );
        } catch (error) {
            return { success: false, error }
        }
    }
}