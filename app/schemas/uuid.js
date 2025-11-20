import zod from 'zod';

const uuidSchema = zod.object({
    userId: zod.uuid()
});

export const validateUUID = (input) => {
    return uuidSchema.safeParse(input)
}