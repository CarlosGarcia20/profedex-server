import { z } from "zod";

const unitSchema = z.object({
    subject_id: z.coerce.number({ error: "El id de la materia tiene que ser número" })
        .nonnegative({ error: "El id de la materia no puede ser negativo" })
        .int("El id de la materia debe de ser entero")
        .min(1, { error: "El campo debe de contener al menos un caracter" }),
    title: z.string().min(3, { error: "El nombre de la unidad tiene que tener al menos 3 caracteres" }),
    unit_number: z.coerce.number().int().positive()
        .min(1, { error: "El campo debe de contener al menos un cáracter" }),
    active: z.string().length(1, { error: "" }).toUpperCase(),
});

const unitsArraySchema = z.array(unitSchema)
    .min(1, "Debes enviar al menos una unidad");

// 3. Exportamos la validación del ARRAY
export function validateUnits(input) {
    return unitsArraySchema.safeParse(input);
}