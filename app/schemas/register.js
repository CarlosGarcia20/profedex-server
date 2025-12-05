import { safeParse, z } from 'zod';

const userschema = z.object({
    name: z.string().min(3, { error: "El nombre del usuario tiene que tener mínimo 3 caracteres" }),
    nickname: z.string().min(4, { error: "El nickname debe tener al menos 4 letras" }),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
    role: z.coerce.number().int().positive()
});

export function validateRegister(input) {
    return userschema.safeParse(input);
}