import zod from 'zod';

const updateUserSchema = zod.object({
    name: zod.string().min(1, "El nombre no puede estar vacío").optional(),
    nickname: zod.string().min(4, "El nickname debe tener al menos 4 caracteres").optional(),
    password: zod.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
    idRol: zod.string().optional()
});

export const validateUpdateUser = (input) => {
    return updateUserSchema.safeParse(input);
}