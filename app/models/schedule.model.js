import pool from "../config/db.js";

export class scheduleModel {
    static async assignSchedule({ groupId, subjectId, day, startTime, endTime, classroomId }) {
        try {
            const { rowCount } = await pool.query(
                `SELECT schedule_id FROM schedules 
                WHERE group_id = $1 
                AND day_of_week = $2
                AND (
                    (start_time <= $3 AND end_time > $3) OR
                    (start_time < $4 AND end_time >= $4)
                )`,
                [groupId, day, startTime, endTime]
            );

            if (rowCount > 0) {
                return {
                    success: false,
                    type: 'conflict',
                    message: 'El grupo ya tiene una clase asignada en este horario'
                }
            }

            const { rows } = await pool.query(
                `INSERT INTO 
                    schedules (group_id, subject_id, day_of_week, start_time, end_time, classroom_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [groupId, subjectId, day, startTime, endTime, classroomId]
            );

            return { success: true, schedule: rows[0] };

        } catch (error) {
            return { success: false, error };
        }
    }

    static async getByGroup(groupId) {
        try {
            const { rows } = await pool.query(
                `SELECT
                    schedules.*,
                    groups.name AS group,
                    subjects.name AS subject,
                    classrooms.name AS classroom
                FROM schedules
                INNER JOIN groups ON schedules.group_id = groups.group_id
                INNER JOIN subjects ON schedules.subject_id = subjects.subject_id
                INNER JOIN classrooms ON schedules.classroom_id = classrooms.id
                WHERE schedules.group_id = $1
                ORDER BY schedules.start_time
                `,
                [groupId]
            );

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error };
        }
    }
    
    static async deleteScheduleById(scheduleId) {
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM schedules
                WHERE schedule_id = $1`,
                [scheduleId]
            );

            if (rowCount === 0) return { success: false, type: 'not_found'};

            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }   
}