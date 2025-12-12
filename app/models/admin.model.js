import pool from "../config/db.js"

export class adminModel {
    static async getRoles() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM roles`
            );

            if (rows.length == 0) {
                return { success: false, message: "No hay roles disponibles" }
            }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async createTeacher({ acronym, name, lastname, status }) {
        try {
            const { rowCount } = await pool.query(
                `INSERT INTO 
                masters (acronym, name, lastname, active)
                VALUES ($1, $2, $3, $4)
                RETURNING master_id`,
                [
                    acronym,
                    name,
                    lastname,
                    status
                ]
            );

            if (rowCount == 0) return { success: false }

            return { success : true }
        } catch (error) {
            return { success: false, error }
        }
    }

    static async updateTeacher({ teacherId, acronym, name, lastname, status }) {
        try {
            const { rows, rowCount } = await pool.query(
                `UPDATE masters
                SET acronym = COALESCE($1, acronym),
                    name = COALESCE($2, name),
                    lastname = COALESCE($3, lastname),
                    active = COALESCE($4, active)
                WHERE master_id = $5
                RETURNING *`, 
                [
                    acronym, 
                    name, 
                    lastname, 
                    status, 
                    teacherId
                ]
            );

            if (rowCount === 0) {
                return { success: false, type: 'not_found' };
            }

            return { success: true, teacher: rows[0] };

        } catch (error) {
            return { success: false, error };
        }
    }
    
    static async deleteTeacher(teacherId) {
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM masters 
                WHERE master_id = $1`,
                [teacherId]
            );
    
            if (rowCount == 0) return { success: false}
    
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }

    static async getUnassignedUsers() {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    users.userid, 
                    users.name,
                    users.nickname 
                FROM users
                LEFT JOIN masters ON users.userid = masters.user_id
                LEFT JOIN students ON users.userid = students.userid
                WHERE masters.user_id IS NULL AND students.userid IS NULL`
            );

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error };
        }
    }

    static async linkUserToMaster({ userId, teacherId }) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            const checkUser = await client.query(
                `SELECT 1 FROM masters WHERE user_id = $1`, 
                [userId]
            );
            
            if (checkUser.rowCount > 0) {
                await client.query('ROLLBACK');
                return { success: false, type: 'conflict', message: "Este usuario ya está asignado a otro profesor" };
            }

            const assignRes = await client.query(
                `UPDATE masters 
                 SET user_id = $1
                 WHERE master_id = $2
                 RETURNING *`,
                [userId, teacherId]
            );

            if (assignRes.rowCount === 0) {
                await client.query('ROLLBACK');
                return { success: false, type: 'not_found', message: "El profesor no existe" };
            }

            await client.query('COMMIT');
            
            return { success: true, master: assignRes.rows[0] };

        } catch (error) {
            await client.query('ROLLBACK');
            
            if (error.code === '23505') {
                 return { success: false, type: 'conflict', message: "El usuario ya está vinculado" };
            }
            return { success: false, error };
        } finally {
            client.release();
        }
    }
}