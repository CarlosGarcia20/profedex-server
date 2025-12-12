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
    
    static async getMyinfo(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    students.*,
                    users.name AS name,
                    users.nickname,
                    users.image,
                    groups.name AS group 
                FROM students
                INNER JOIN users ON students.userid = users.userid
                INNER JOIN groups ON students.group_id = groups.group_id
                WHERE students.userid = $1`,
                [userId]
            );

            if (rows.length < 0) {
                return { success: false }
            }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false }
        }
    }

    static async getMySchedules(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT
                    groups.name AS group,
                    schedules.*,
                    subjects.name AS subject,
                    CONCAT(
                        masters.acronym, ' ', 
                        masters.lastname, ' ',
                        masters.name, ' '
                    ) AS master,
                    classrooms.name AS classroom
                FROM students
                INNER JOIN groups ON students.group_id = groups.group_id
                INNER JOIN schedules ON groups.group_id = schedules.group_id
                INNER JOIN subjects ON schedules.subject_id = subjects.subject_id
                INNER JOIN masters ON schedules.teacher_id = masters.master_id
                INNER JOIN classrooms ON schedules.classroom_id = classrooms.id
                WHERE students.userid = $1
                ORDER BY start_time, day_of_week ASC
                `,
                [userId]
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows, group: rows[0].group }
        } catch (error) {
            return { success: false, error };
        }
    }

    static async getRetakesByStudent(studentId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    retakes.*,
                    subjects.name AS subject,
                    classrooms.name AS classroom
                FROM retakes
                INNER JOIN students ON retakes.student_id = students.id
                INNER JOIN subjects ON retakes.subject_id = subjects.subject_id
                INNER JOIN classrooms ON retakes.classroom_id = classrooms.id
                WHERE students.userid = $1
                `, 
                [studentId]
            );

            if (rows.length < 0) return { success: false }
            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error };
        }
    }

    static async getMyTeachers() {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    masters.master_id,
                    CONCAT(
                        masters.acronym, ' ',
                        masters.lastname, ' ',
                        masters.name
                    ) AS master,
                    users.image,
                    teacher_popularity.popularity
                FROM masters
                LEFT JOIN users ON masters.user_id = users.userid
                LEFT JOIN teacher_popularity ON masters.master_id = teacher_popularity.teacher_id`
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
}