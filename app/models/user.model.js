import pool from "../config/db.js";

export class userModel {
    static async getUserByNickName({ nickname }) {
        try {
            const { rows } = await pool.query(
                `SELECT nickname FROM USERS
                WHERE  nickname = $1`,
                [nickname]
            )

            if (rows.length > 0) {
                return { success: true };
            }

            return { success: false };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async createUser({ name, nickname, password }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO users (name, nickname, password)
                    VALUES ($1, $2, $3)
                `,
                [name, nickname, password]
            );

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async updateDataUser({ input }) {
        try {
            const { userId, name, nickname, password } = input;

            // introducir logica para conectar a la bd
            // const { rows }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getroleIdUser({ userId }) {
        try {
            await pool.query(
                `
                SELECT idrol FROM users
                WHERE userid = $1
                `,
                [userId]
            );
        } catch (error) {
            return { success: false, error }
        }
    }
}