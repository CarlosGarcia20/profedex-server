import pool from "../config/db.js"

export class teacherModel {
    static async getTeachers() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM masters
                ORDER BY lastname ASC`
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
}