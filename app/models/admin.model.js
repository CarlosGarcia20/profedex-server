import { success } from "zod";
import pool from "../config/db.js";

export class adminModel {
	static async getUserByNickName({ nickname }) {
		try {
			const { rows } = await pool.query(
				`SELECT nickname FROM USERS
					WHERE nickname = $1`,
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

	static async createUser({ userData }) {
		const client = await pool.connect();
		
		try {
			await client.query('BEGIN');

			const { name, nickname, password, idRol, role } = userData;

			const userQuery = `
				INSERT INTO users (name, nickname, password, idrol)
				VALUES ($1, $2, $3, $4)
				RETURNING userid
			`;

			const userRes = await client.query(
				userQuery, 
				[name, nickname, password, idRol]
			);
			const newUserId = userRes.rows[0].userid;

			if (role == "STUDENT") {
				const { studentId, group_id } = userData;

				await client.query(
                    `INSERT INTO students (userid, enrollment_id, group_id) 
					VALUES ($1, $2, $3)`,
					[newUserId, studentId, group_id]
                );
				
 			} else if (role == "PROFESSOR") {
				const { masterId, } = userData;

				await client.query(
					`UPDATE masters 
					SET user_id = $1
					WHERE master_id = $2`,
					[newUserId, masterId]
				);
			}

			await client.query('COMMIT');

            return { success: true };
		} catch (error) {
			await client.query('ROLLBACK');
			
			if (error.code === '23505') {
				return {
					success: false,
					type: 'conflict',
					error: 'El usuario ya existe (DB constraint)'
				};
			}
			return { success: false, error }

		} finally {
			client.release();
		}
	}

	static async getUsers() {
		try {
			const { rows } = await pool.query(
				`SELECT 
					userid, name, nickname, idrol 
				FROM users`
			);

			return { success: true, data: rows }
		} catch (error) {
			return { success: false, error }
		}
	}

	static async updateDataUser({ userId, data }) {
		try {
			const { rowCount: exists } = await pool.query(
				`SELECT userid FROM users WHERE userid = $1`,
				[userId]
			);

			if (exists < 1) {
				return { success: false, message: "Usuario no encontrado" };
			}

			const fields = [];
			const values = [];
			let index = 1;

			for (const key in data) {
				if (data[key] !== undefined && data[key] !== null) {
					fields.push(`${key} = $${index}`);
					values.push(data[key]);
					index++;
				}
			}

			if (fields.length === 0) {
				return { success: false, message: "No hay datos para actualizar" };
			}

			values.push(userId);

			const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE userid = $${index}
            RETURNING userid, name, nickname, idRol;
        `;

			const { rows } = await pool.query(query, values);

			return {
				success: true,
				message: "Usuario actualizado correctamente",
				user: rows[0]
			};

		} catch (error) {
			return { success: false, error }
		}
	}

	static async deleteUser({ userId }) {
		try {
			const { rowCount } = await pool.query(
				`
					DELETE FROM users
					WHERE userid = $1
				`,
				[userId]
			)

			if (rowCount == 0) return { success: false }

			return { success: true }
		} catch (error) {
			return { success: false, error }
		}
	}
}