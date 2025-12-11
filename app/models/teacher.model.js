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
            const { rows, rowCount } = await pool.query(
                `SELECT * FROM events
                WHERE userid = $1`,
                [userId]
            );
            console.log(rows.length);
            

            if (rowCount == 0) return { success: false }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async updateEvent({ eventId, userId, name, description, date, status, image, s3Key }) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            const { rows: currentData } = await client.query(
                `SELECT s3key 
                FROM events
                WHERE event_id = $1
                AND userid = $2`,
                [ eventId, userId ]
            );

            if (currentData.length === 0) {
                await client.query('ROLLBACK');
                return { success: false, type: 'not_found' };
            }

            const oldS3Key = currentData[0].s3key;

            const { rows } = await client.query(
                `UPDATE events
                SET name = $1,
                    description = $2,
                    date = $3,
                    status = $4,
                    image = COALESCE($5, image),
                    s3key = COALESCE($6, s3key),
                    updated_at = NOW()
                WHERE event_id = $7`,
                [
                    name, 
                    description, 
                    date, 
                    status, 
                    image,
                    s3Key, 
                    eventId
                ]
            );

            await client.query('COMMIT');

            return { 
                success: true, 
                oldS3Key: s3Key ? oldS3Key : null 
            };

        } catch (error) {
            await client.query('ROLLBACK');
            return { success: false, error };
        } finally {
            client.release();
        }
    }

    static async deleteEvent(eventId) {
        try {
            const { rowCount: hasImages } = await pool.query(
                `SELECT 1 FROM user_images WHERE event_id = $1 LIMIT 1`,
                [eventId]
            );

            if (hasImages > 0) {
                const { rowCount } = await pool.query(
                    `UPDATE events 
                    SET status = 'N', updated_at = NOW() 
                    WHERE event_id = $1`,
                    [eventId]
                );

                if (rowCount === 0) return { success: false, type: 'not_found' };
                
                return { success: true, action: 'disabled' };

            } else {
                const { rows, rowCount } = await pool.query(
                    `DELETE FROM events 
                    WHERE event_id = $1 
                    RETURNING s3key`, 
                    [eventId]
                );

                if (rowCount === 0) return { success: false, type: 'not_found' };

                const deletedKey = rows[0]?.s3key || null;

                return { success: true, action: 'deleted', s3Key: deletedKey };
            }

        } catch (error) {
            return { success: false, error };
        }
    }
}