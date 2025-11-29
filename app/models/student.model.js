import pool from "../config/db.js"

export class studentModel {
    static async getGroupInfo(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    groups.name
                FROM students
                INNER JOIN groups ON students.group_id = groups.group_id
                WHERE students.userid = $1`,
                [userId]
            );

            if (rows.length > 0) {
                return { success: true, data: rows }
            }

            return { success: false }
        } catch (error) {
            return { success: false }
        }
    }
}