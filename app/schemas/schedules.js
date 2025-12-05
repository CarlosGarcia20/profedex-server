import { z } from "zod";

const scheduleItemSchema = z.object({
    group_id: z.coerce.number({ error: "El id del grupo tiene que ser número" })
        .int()
        .positive(),
    subject_id: z.coerce.number({ error: "El id de la materia tiene que ser número" })
        .int()
        .positive(),
    day: z.coerce.number()
        .int()
        .min(1, { error: "El día debe ser entre 1 (Lunes) y 5 (Viernes)" })
        .max(5, { error: "el día no es válido1" }),
    start_time: z.iso.time({ error: "Formato de hora inválido (HH:MM:SS)" }),
    end_time: z.iso.time({ error: "Formato de hora inválido (HH:MM:SS)" }),
    classroom_id: z.coerce.number().int().positive()
})
.refine((data) => data.end_time > data.start_time, {
    error: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["end_time"]
});

const schedulesArraySchema = z.array(scheduleItemSchema)
    .min(1, "Debes enviar al menos un horario");

export function validateSchedules(input) {
    return schedulesArraySchema.safeParse(input);
}