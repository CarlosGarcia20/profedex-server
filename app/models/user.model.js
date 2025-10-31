import { uuidv4 } from "zod";

export class userModel {
    static async createUser({ input }) {
        try {
            const { name, nickname, password } = input;
            
            const userId = uuidv4();

            return { success: true, data: { userId }}
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
}