import bcrypt from "bcrypt";

const saltRound = 10;

export class EncryptionHelper {
    static async hashPassword(password) {
        return await bcrypt.hash(password, saltRound);
    }

    static async comparePassword(password, hashPassword) {
        return await bcrypt.compare(password, hashPassword);
    }
}