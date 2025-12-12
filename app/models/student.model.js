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

    static async getMyTeachers(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT DISTINCT
                    CONCAT(
                        masters.acronym, ' ',
                        masters.lastname, ' ',
                        masters.name, ' '
                    ) AS master,
                    masters.master_id,
                    users.image
                FROM students
                INNER JOIN groups ON students.group_id = groups.group_id
                INNER JOIN schedules ON groups.group_id = schedules.group_id
                INNER JOIN masters ON schedules.teacher_id = masters.master_id
                LEFT JOIN users ON masters.user_id = users.userid
                WHERE students.userid = $1`,
                [userId]
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }

    static async getAllTeachersCards() {
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
                    COALESCE(SUM(teacher_popularity.vote_value), 0)::int as popularity
                FROM masters
                LEFT JOIN users ON masters.user_id = users.userid
                LEFT JOIN teacher_popularity ON masters.master_id = teacher_popularity.teacher_id
                GROUP BY masters.master_id, users.image
                ORDER BY popularity DESC, masters.lastname ASC`
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }

    static async toggleVote({ studentId, masterId, value }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const checkRes = await client.query(
                `SELECT vote_value FROM teacher_popularity WHERE student_id = $1 AND teacher_id = $2`,
                [studentId, masterId]
            );

            if (checkRes.rowCount > 0) {
                const currentVal = checkRes.rows[0].vote_value;
                if (currentVal === value) {
                    await client.query(
                        `DELETE FROM teacher_popularity WHERE student_id = $1 AND teacher_id = $2`,
                        [studentId, masterId]
                    );
                } else {
                    await client.query(
                        `UPDATE teacher_popularity SET vote_value = $3 WHERE student_id = $1 AND teacher_id = $2`,
                        [studentId, masterId, value]
                    );
                }
            } else {
                await client.query(
                    `INSERT INTO teacher_popularity (student_id, teacher_id, vote_value) VALUES ($1, $2, $3)`,
                    [studentId, masterId, value]
                );
            }

            await client.query('COMMIT');
            return { success: true };

        } catch (error) {
            await client.query('ROLLBACK');
            return { success: false, error };
        } finally {
            client.release();
        }
    }
}