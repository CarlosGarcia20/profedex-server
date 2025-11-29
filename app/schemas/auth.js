import zod from 'zod';

const authSchema = zod.object({
    username: zod.string().min(4, { error: "El usuario debe de contener al menos 4 caracteres" }),
    password: zod.string().min(8, { error: "La contrsaseña debe de contener al menos 8 caracteres" } )
});

export function validateLogin(input) {
    return authSchema.safeParse(input);
}