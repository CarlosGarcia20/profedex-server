import pool from "../config/db.js";

export class unitModel {
    static async getUnits() {
        try {
            const { rows } = await pool.query(
                `SELECT
                    units.*,
                    subjects.name AS subject
                FROM units
                INNER JOIN subjects ON units.subject_id = subjects.subject_id
                ORDER BY subjects.subject_id ASC
                `
            );

            if (rows.length === 0) 
                return { success: false, message: "No hay unidades registradas" }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }

    static async getUnitPerId(unitId) {
        try {
            const { rows } = await pool.query(
                `SELECT
                    units.*,
                    subjects.name AS subject
                FROM units
                INNER JOIN subjects ON units.subject_id = subjects.subject_id
                WHERE units.unit_id = $1`,
                [unitId]
            );

            if (rows.length == 0) {
                return { 
                    success: false, 
                    message: "No se ha encontrado información de la unidad solicitada" 
                }
            }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async createUnit({ subject_id, title, unit_number, active }) {
        try {
            const row = await pool.query(
                `INSERT INTO 
                    units (subject_id, title, unit_number, active)
                VALUES ($1, $2, $3, $4)
                `,
                [
                    subject_id,
                    title,
                    unit_number,
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