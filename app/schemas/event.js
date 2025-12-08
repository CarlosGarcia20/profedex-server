import { z } from 'zod';

const eventSchema = z.object({
    name: z.string().min(4, { error: "El nombre debe de tener al menos 3 carácteres" }),
    description: z.string().optional(),
    date: z.coerce.date({ error: "La fecha no tiene un formato válido" }),
    status: z.string().
        length(1, "El campo active debe ser de un solo caracter (S/N)")
        .toUpperCase(),
});

export function validateEvent(input) {
    return eventSchema.safeParse(input);
}