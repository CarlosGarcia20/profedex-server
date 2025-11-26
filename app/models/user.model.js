import pool from "../config/db.js";

export class userModel {
    
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