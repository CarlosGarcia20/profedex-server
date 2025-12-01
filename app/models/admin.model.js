import pool from "../config/db.js"

export class adminModel {
    static async getRoles() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM roles`
            );

            if (rows.length == 0) {
                return { success: false, message: "No hay roles disponibles" }
            }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
}