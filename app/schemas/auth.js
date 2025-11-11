import zod from 'zod';

const authSchema = zod.object({
    username: zod.string().min(4),
    password: zod.string().min(8)
});

export function validateLogin(input) {
    return authSchema.safeParse(input);
}