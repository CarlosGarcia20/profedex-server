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

    static async updateProfilePicture(userId, newImageUrl, newS3Key) {
        try {
            const { rows: oldData } = await pool.query(
                `SELECT image_key FROM users WHERE userid = $1`,
                [userId]
            );

            const oldS3Key = oldData[0]?.image_key;

            const { rows } = await pool.query(
                `UPDATE users 
                SET image = $1, image_key = $2
                WHERE userid = $3
                RETURNING image`,
                [newImageUrl, newS3Key, userId]
            );

            return { 
                success: true, 
                newUrl: rows[0].image, 
                oldKeyToDelete: oldS3Key
            };

        } catch (error) {
            return { success: false, error };
        }
    }
}