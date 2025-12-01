import { z } from "zod";
import { titleString } from "../utils/zod-utils.js";

const majorSchema = z.object({
    name: titleString,
    description: z.string({ error: "El campo solo acepta string" })
        .nullish()
        .transform(val => (!val || val.trim() === "") ? null : val),
    active: z.string().min(1, { error: "El campo tiene que contener más de un caracter" })
        .max(1, { error: "El campo no puede contener más de un caracter" })
        .toUpperCase(),
})

export const validateMajor = (input) => {
    return majorSchema.safeParse(input);
} 