import { success } from "zod";
import pool from "../config/db.js"

export class majorModel {
    static async getMajors() {
        try {
            const { rows, rowCount } = await pool.query(
                `SELECT * FROM majors`
            );

            if (rowCount < 1) {
                return { success: false }
            }

            return { success: true, data: rows}
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async getMajorPerId(majorId) {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM majors
                WHERE major_id = $1`,
                [majorId]
            );

            if (rows.length == 0) {
                return { success: false }
            }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async createMajor({ name, description, active }) {
        try {
            const { rowCount } = await pool.query(
                `INSERT INTO majors (name, description, active)
                VALUES ($1, $2, $3)`,
                [
                    name,
                    description,
                    active
                ]
            );

            if (rowCount < 1) return { success: false }

            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async updateMajor({ majorId, data }) {
        try {
            const { rowCount } = await pool.query(
                `UPDATE majors
                SET name = $1, description = $2, active = $3
                WHERE major_id = $4`,
                [
                    data.name,
                    data.description,
                    data.active,
                    majorId
                ]
            );

            if (rowCount < 1) {
                return { success: false }
            }

            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async deleteMajor(majorId) {
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM majors
                WHERE major_id = $1`,
                [majorId]
            );

            if (rowCount === 0) return { success: false, type: 'not_found'};

            return { success: true }
        } catch (error) {
            if (error.code === '23503') return { success: false, type: 'conflict', error };

            return { success: false, error }
        }
    }
}