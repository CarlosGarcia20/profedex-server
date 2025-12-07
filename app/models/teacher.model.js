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

    static async getMyInfo(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    masters.*,
                    users.nickname,
                    users.image
                FROM masters
                INNER JOIN users ON masters.user_id = users.userid
                WHERE user_id = $1`,
                [userId]
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error }
        }
    }
}