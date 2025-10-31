import pool from "../config/db.js";

export class authModel {
    static async login({ input }) {
        try {
            const { user, password } = input

            const { rows } = await pool.query(
                `SELECT user, password FROM usuarios WHERE user = $1`,
                [user]
            )

            if (rows.lenght === 0) return { success: false, message: "Usuario no encontrado" }

            if (password !== rows[0].password) return { success: false, message: "Contraseña incorrecta" }
            
        } catch (error) {
            return { success: false, error };
        }
    }
}