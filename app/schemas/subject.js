import { z } from 'zod';

const subjectSchema = z.object({
    name: z.string().min(1, { error: "El nombre debe contener al menos un caracter" }).toUpperCase(),
    code: z.coerce.number({ error: "El código debe ser un número" })
        .nonnegative({ error: "El código no puede ser negativo" })
        .int("El código debe ser entero")
        .min(1000, { error: "El código debe tener 4 dígitos" }),
    description: z.string().optional(),
    credits: z.coerce.number({ error: "Los créditos deben de ser números" })
        .nonnegative({ error: "Los créditos no pueden ser negativos" })
        .int("Los créditos deben de ser enteros")
        .min(1, { error: "Los créditos deben de contener al menos un cáracter" }),
    hours: z.coerce.number({ error: "Las horas deben de ser números" })
        .nonnegative({ error: "Las horas no pueden ser negativas" })
        .int("Las horas deben de ser enteros")
        .min(1, { error: "Las horas deben de contener al menos un cáracter" }),
    semester: z.coerce.number({ error: "El semestre debe ser número" })
        .nonnegative({ error: "El semestre no puede ser negativo" })
        .int("El semestre debe de ser enteros")
        .min(1, { error: "El semestre debe de contener al menos un cáracter" }),
    plan_year: z.coerce.number()
        .int()
        .min(1900, "Año muy antiguo")
        .max(2100, "Año muy lejano"),
    major_id: z.coerce.number({ error: "El id de la carrera tiene que ser número" })
        .nonnegative({ error: "El id de la carrera no puede ser negativo" })
        .int("El id de la carrera debe de ser entero")
        .min(1, { error: "El id debe de contener al menos un caracter" }),
    active: z.string().min(1, { error: "El campo tiene que contener más de un caracter" })
        .max(1, { error: "El campo no puede contener más de un caracter" })
        .toUpperCase(),
});

export function validateSubject(input) {
    return subjectSchema.safeParse(input);
}