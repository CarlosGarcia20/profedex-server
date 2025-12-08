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

    static async getMySchedules(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT
                    CONCAT(
                        masters.acronym, ' ',
                        masters.lastname, ' ',
                        masters.name, ' '
                    ) AS teacher,
                    groups.name AS group,
                    subjects.name AS subject,
                    schedules.day_of_week,
                    schedules.start_time,
                    schedules.end_time,
                    classrooms.name AS classroom
                FROM masters
                INNER JOIN schedules ON masters.master_id = schedules.teacher_id
                INNER JOIN groups ON schedules.group_id = groups.group_id
                INNER JOIN subjects ON schedules.subject_id = subjects.subject_id
                INNER JOIN classrooms ON schedules.classroom_id = classrooms.id
                WHERE user_id = $1`,
                [userId]
            );

            if (rows.length < 0) {
                return { success: false}
            }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }

    static async createEvent({ name, description, date, image, s3Key, status, userId }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO 
                events (name, description, date, image, s3key, status, userid)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    name,
                    description,
                    date,
                    image,
                    s3Key,
                    status,
                    userId
                ]
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async getMyEvents(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM events
                WHERE userid = $1`,
                [userId]
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
}