import { adminModel } from "../models/admin.model.js";
import { validateNickname } from "../schemas/nickname.js"

export const validateUniqueNickname = async (nickname) => {
    const validation = validateNickname({ nickname: nickname });
    if(!validation.success) return validation;

    const existingUser = await adminModel.getUserByNickName({ nickname });
    
    if (existingUser.success) {
        return { success: false, error: { message: "El nickname ya está en uso" }};
    }

    return { success: true };
}