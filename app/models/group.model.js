import pool from "../config/db.js";

export class groupModel {
    static async getGroups() {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    groups.*,
                    majors.name AS major
                FROM groups
                INNER JOIN majors ON groups.major_id = majors.major_id
                ORDER BY groups.name ASC
                `
            );

            if (rows.length === 0) return { success: false, message: "No hay grupos registrados" }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }

    static async getGroupPerId(groupId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    groups.*,
                    majors.name AS major
                FROM groups
                INNER JOIN majors ON groups.major_id = majors.major_id
                WHERE groups.group_id = $1`,
                [groupId]
            );

            if (rows.length == 0) {
                return { 
                    success: false, 
                    message: "No se ha encontrado información del grupo solicitado" 
                }
            }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async createGroup({ name, gradeLevel, major_id, active }) {
        try {
            const row = await pool.query(
                `INSERT INTO 
                    groups (name, grade_level, major_id, active)
                VALUES ($1, $2, $3, $4)
                `,
                [
                    name,
                    gradeLevel,
                    major_id,
                    active
                ]
            );

            return { success: true, row }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async updateGroup({ groupId, data }) {
        try {
            const { rows, rowCount } = await pool.query(
                `UPDATE groups
                SET name = $1, 
                    grade_level = $2, 
                    major_id = $3, 
                    active = $4
                WHERE group_id = $5
                RETURNING *`,
                [
                    data.name,
                    data.grade_level,
                    data.major_id,
                    data.active,
                    groupId
                ]
            );

            if (rowCount === 0) {
                return { success: false, message: "Grupo no encontrado" };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            return { success: false, error };
        }
    }
    
    static async deleteGroup(groupId) {
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM groups WHERE group_id = $1`,
                [groupId]
            );

            if (rowCount === 0) {
                return { success: false, type: 'not_found' };
            }

            return { success: true };

        } catch (error) {
            if (error.code === '23503') {
                return { success: false, type: 'conflict', error };
            }

            return { success: false, type: 'server', error };
        }
    }
}