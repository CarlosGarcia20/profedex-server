import { success } from "zod";
import pool from "../config/db.js"

export class subjectModel {
    static async getSubjects() {
        try {
            const { rows } = await pool.query(
                `SELECT 
                subjects.*,
                careers.name AS Carrera
                FROM subjects
                INNER JOIN careers ON subjects.career_id = careers.major_id
                ORDER BY subjects.code ASC
                `
            );

            if (rows.length === 0) return { success: false, message: "No hay materias registradas" }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async createSubject({ name, code, description, credits, hours, semester, plan_year, career_id, active }) {
        try {
            const row = await pool.query(
                `INSERT INTO 
                    subjects (name, code, description, credits, hours, semester, plan_year, career_id, active)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `,
                [
                    name,
                    code,
                    description,
                    credits,
                    hours,
                    semester,
                    plan_year,
                    career_id,
                    active
                ]
            );

            return { success: true, row }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async getSubjectPerId(subjectId) {
        try {
            const { rows } = await pool.query(
                `SELECT 
                    careers.name AS carrera,
                    subjects.*
                FROM subjects
                INNER JOIN careers ON subjects.career_id = careers.major_id
                WHERE subjects.subject_id = $1`,
                [subjectId]
            );

            if (rows.length == 0) {
                return { success: false }
            }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error }
        }
    }
    
    static async updateSubject(subjectId) {
        
    }
    
    static async deleteSubject(subjectId) {
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM subjects WHERE subject_id = $1`,
                [subjectId]
            );

            // Si rowCount es 0, es que no borró nada (no existía el ID)
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