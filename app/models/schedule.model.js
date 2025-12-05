import pool from "../config/db.js";

export class scheduleModel {
    static async assignSchedule(schedulesArray) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const createdSchedules = [];

            for (const schedule of schedulesArray) {
                const { group_id, subject_id, day, start_time, end_time, classroom_id } = schedule;

                const { rowCount } = await client.query(
                    `SELECT schedule_id FROM schedules 
                    WHERE group_id = $1 
                    AND day_of_week = $2
                    AND (
                        (start_time < $4 AND end_time > $3)
                    )`,
                    [
                       group_id, day, start_time, end_time 
                    ]
                );
                
                if (rowCount > 0) {
                    return {
                        success: false,
                        type: 'conflict',
                        message: 'El grupo ya tiene una clase asignada en este horario'
                    }
                }

                const { rows } = client.query(
                    `INSERT INTO 
                    schedules (group_id, subject_id, day_of_week, start_time, end_time, classroom_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                    `,
                    [
                        group_id, 
                        subject_id, 
                        day, 
                        start_time, 
                        end_time, 
                        classroom_id
                    ]
                );
                
                createdSchedules.push(schedule);      
            }

            await client.query('COMMIT');

            return { success: true, count: createdSchedules.length, schedules: createdSchedules };
        } catch (error) {
            await client.query('ROLLBACK');

            if (error.type === 'conflict') {
                return { success: false, type: 'conflict', message: error.message, detail: error };
            }
            
            return { success: false, type: 'server', error };
        } finally {
            client.release();
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
                ORDER BY schedules.day_of_week, schedules.start_time ASC
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
    
    static async getClassrooms() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM classrooms
                WHERE active = 'S'`
            );

            if (rows.length < 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
}