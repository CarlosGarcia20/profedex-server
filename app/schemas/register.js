import zod from 'zod';

const registerSchema = zod.object({
    name: zod.string().min(3),
    nickname: zod.string().min(4),
    password: zod.string().min(8),
});

export const validateRegister = (input) => {
    return registerSchema.safeParse(input);
}