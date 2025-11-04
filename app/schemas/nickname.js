import zod from 'zod';

const nicknameSchema = zod.object({
    nickname: zod.string().min(3)
});

export const validateNickname = (input) => {
    return nicknameSchema.safeParse(input);
}