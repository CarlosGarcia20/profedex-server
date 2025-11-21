import { z } from 'zod';

const baseUserSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 letras"),
    nickname: z.string().min(4, "El nickname debe tener al menos 4 letras"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const registerSchema = z.discriminatedUnion("role", [

    baseUserSchema.extend({
        role: z.literal("STUDENT"),
        studentId: z.string().min(1, "La matrícula es obligatoria"),
        group_id: z.string("La carrera es obligatoria")
    }),

    baseUserSchema.extend({
        role: z.literal("PROFESSOR"),
        masterId: z.string("El profesor es obligatorio")
    }),

    baseUserSchema.extend({
        role: z.literal("ADMIN"),
    })
]);

export const validateRegister = (input) => {
    return registerSchema.safeParse(input);
}