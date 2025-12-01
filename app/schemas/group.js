import { z } from "zod";

const groupSchema = z.object({
    name: z.string({ error: "Se esperaba un string y se recibió indefinido" }).min(1, { error: "El nombre debe de contener al menos un caracter" }),
    grade_level: z.coerce.number({ error: "El grado debe de ser número" })
        .nonnegative({ error: "El grado no puede ser negativo" })
        .int("El grado debe de ser un entero")
        .min(1, { error: "El grado debe de contener al menos un caracter " }),

    major_id: z.coerce.number({ error: "El id de la carrera tiene que ser número" })
        .nonnegative({ error: "El id de la carrera no puede ser negativo" })
        .int("El id de la carrera debe de ser entero")
        .min(1, { error: "El id debe de contener al menos un caracter" }),
    active: z.string().min(1, { error: "El campo tiene que contener más de un caracter" })
        .max(1, { error: "El campo no puede contener más de un caracter" })
        .toUpperCase(),
});

export const validateGroup = (input) => {
    return groupSchema.safeParse(input);
} 