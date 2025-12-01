import { z } from 'zod';

const ROLE_ID_MAP = {
    1: "ADMIN",
    "1": "ADMIN", // Por si llega como string "1"
    2: "PROFESSOR",
    "2": "PROFESSOR",
    3: "STUDENT",
    "3": "STUDENT"
};

const baseUserSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 letras"),
    nickname: z.string().min(4, "El nickname debe tener al menos 4 letras"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const userDiscriminatedSchema = z.discriminatedUnion("role", [
    baseUserSchema.extend({
        role: z.literal("STUDENT"),
        studentId: z.string().min(1, "La matrícula es obligatoria"),
        group_id: z.string().min(1, "El ID de grupo es obligatorio") 
    }),

    baseUserSchema.extend({
        role: z.literal("PROFESSOR"),
        masterId: z.string().min(1, "El ID de maestro es obligatorio")
    }),

    baseUserSchema.extend({
        role: z.literal("ADMIN"),
    })
]);

const registerSchema = z.preprocess((input) => {
    if (typeof input === 'object' && input !== null && 'role' in input) {
        
        const originalRole = input.role;
        
        const translatedRole = ROLE_ID_MAP[originalRole] || originalRole;

        return {
            ...input,
            role: translatedRole
        };
    }
    return input;
}, userDiscriminatedSchema);

export const validateRegister = (input) => {
    return registerSchema.safeParse(input);
}