import pool from "../config/db.js";

export class postModel {
    static async createPost({ userId, imageUrl, s3Key }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO user_images (user_id, image_url, s3_key) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [userId, imageUrl, s3Key]
            );

            if (rows.length > 0) {
                return { success: true, post: rows[0] };
            }
            
            return { success: false }
        } catch (error) {
            return { success: false, error };
        }
    }
    
    static async getAllPosts() {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    user_images.id,
                    user_images.image_url,
                    user_images.created_at,
                    users.name,
                    users.nickname
                FROM user_images
                INNER JOIN users on user_images.user_id = users.userid
                ORDER BY user_images.created_at DESC`
            );

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error };
        }
    }
    
    static async getMyPosts(userId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    user_images.id,
                    user_images.image_url,
                    user_images.created_at,
                    users.name,
                    users.nickname
                FROM user_images
                INNER JOIN users on user_images.user_id = users.userid
                WHERE user_images.user_id = $1
                ORDER BY user_images.created_at DESC`,
                [userId]
            );

            if( rows.length > 0) {
                return { success: true, data: rows }
            }
            
            return { success: false }
        } catch (error) {
            return { success: false, error };
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