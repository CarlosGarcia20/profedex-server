import { scheduleModel } from "../models/schedule.model.js";
import { validateSchedules } from "../schemas/schedules.js";

export class scheduleController {
    static async create(req, res) {
        try {
            const validationSchedule = validateSchedules(req.body);
    
            if (!validationSchedule.success) {
                if(!validationSchedule.message) {
                    return res.status(400).json({
                        message: JSON.parse(validationSchedule.error.message)
                    })
                } 
                    
                return res.status(400).json({ 
                    message: "Datos incorrectos",
                    errors: validationSchedule.error.flatten().fieldErrors 
                });
            }
    
            const result = await scheduleModel.assignSchedule(validationSchedule.data);

            if (!result.success) {
                if (result.type === 'conflict') {
                    return res.status(409).json({
                        message: result.message,
                        conflict: result.detail 
                    });
                }

                return res.status(500).json({ message: "Error al asignar horarios" });
            }
    
            return res.status(201).json({ 
                message: "Horarios asignados correctamente", 
                count: result.count 
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getGroupSchedule(req, res) {
        try {
            const validationSchedule = validateSchedules(req.body);
    
            if (!validationSchedule.success) {
                if(!validationSchedule.message) {
                    return res.status(400).json({
                        message: JSON.parse(validationSchedule.error.message)
                    })
                } 
                    
                return res.status(400).json({ 
                    message: "Datos incorrectos",
                    errors: validationSchedule.error.flatten().fieldErrors 
                });
            }
    
            const result = await scheduleModel.assignSchedule(validationSchedule.data);

            if (!result.success) {
                if (result.type === 'conflict') {
                    return res.status(409).json({
                        message: result.message,
                        conflict: result.detail 
                    });
                }

                return res.status(500).json({ message: "Error al asignar horarios" });
            }
    
            return res.status(201).json({ 
                message: "Horarios asignados correctamente", 
                count: result.count 
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getGroupSchedule(req, res) {
        try {
            const { groupId } = req.params;
            
            const result = await scheduleModel.getByGroup(groupId);

            if (!result.success) return res.status(404).json({ message: "Error interno" });
            
            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

     static async delete(req, res) {
        try {
            const { scheduleId } = req.params;

            const result = await scheduleModel.deleteScheduleById(scheduleId);

            if (!result.success) {
                if (result.type === 'not_found') {
                    return res.status(404).json({ message: "La clase no existe" });
                }

                return res.status(500).json({ message: result.message });
            }

            return res.sendStatus(201);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async getClassrooms(req, res) {
        try {
            const result = await scheduleModel.getClassrooms();

            if (!result.success) return res.status(404).json({ message: "No hay grupos registrados" });

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

     static async delete(req, res) {
        try {
            const { scheduleId } = req.params;

            const result = await scheduleModel.deleteScheduleById(scheduleId);

            if (!result.success) {
                if (result.type === 'not_found') {
                    return res.status(404).json({ message: "La clase no existe" });
                }

                return res.status(500).json({ message: result.message });
            }

            return res.sendStatus(201);
        } catch (error) {
            return { success: false, error };
        }
    }
}