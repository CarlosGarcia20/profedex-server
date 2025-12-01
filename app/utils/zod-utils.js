import { z } from "zod";

export const titleString = z.string()
    .min(1, { error: "El campo tiene que tener mas de un caracter" })
    .trim()
    .transform((val) => {
        if (!val) return val;
        return val
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });