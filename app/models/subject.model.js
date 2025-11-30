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
    
    static async updateSubject({ subjectId, data }) {
        try {
            const { rows, rowCount } = await pool.query(
                `UPDATE subjects
                SET name = $1, 
                    code = $2, 
                    description = $3,
                    credits = $4, 
                    hours = $5, 
                    semester = $6, 
                    plan_year = $7, 
                    major_id = $8, 
                    active = $9,
                    updated_at = NOW()
                WHERE subject_id = $10
                RETURNING *`,
                [
                    data.name,
                    data.code,
                    data.description,
                    data.credits,
                    data.hours,
                    data.semester,
                    data.plan_year,
                    data.major_id,
                    data.active,
                    subjectId
                ]
            );

            if (rowCount === 0) {
                return { success: false, message: "Materia no encontrada" };
            }

            return { success: true, data: rows[0] };

        } catch (error) {
            return { success: false, error };
        }
    }
    
    static async deleteSubject(subjectId) {
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM subjects WHERE subject_id = $1`,
                [subjectId]
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