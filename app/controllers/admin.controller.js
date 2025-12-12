import { adminModel } from "../models/admin.model.js";

export class adminController {
    static async getRoles(req, res) {
        try {
            const result = await adminModel.getRoles();

            if (!result.success) {
                return res.status(400).json({ message: result.error.message });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async createTeacher(req, res) {
        try {
            const result = await adminModel.createTeacher({
                acronym: req.body.acronym,
                name: req.body.name,
                lastname: req.body.lastname,
                status: req.body.status
            })
            
            if (!result.success) {
                return res.status(500).json({ message: "Ocurrió un error al crear al maestro" });
            }
            
            return res.status(201).json({ message: "Maestro creado con éxito" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async updateTeacher(req, res) {
        try {
            const { teacherId } = req.params;

            const result = await adminModel.updateTeacher({
                teacherId: teacherId,
                acronym: req.body.acronym,
                name: req.body.name,
                lastname: req.body.lastname,
                status: req.body.status
            });
            console.log(result);
            

            if (!result.success) {
                if (result.type === 'not_found') {
                    return res.status(404).json({ message: "Maestro no encontrado" });
                }
                return res.status(500).json({ message: "Ocurrió un error al actualizar al maestro" });
            }

            return res.status(200).json({ 
                message: "Maestro actualizado con éxito", 
                data: result.teacher 
            });

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteTeacher(req, res) {
        try {
            const { teacherId } = req.params;

            const result = await adminModel.deleteTeacher(teacherId);

            if (!result.success) {
                return res.status(404).json({ message: "No se ha encontrado al maestro" });
            }

            return res.sendStatus(204);
        } catch (error) {
            return { success: false, error }
        }
    }

    static async getUnassigned(req, res) {
        try {
            const result = await adminModel.getUnassignedUsers();
            
            if (!result.success) {
                return res.status(500).json({ message: "Error al obtener usuarios" });
            }
            
            return res.status(200).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async assignUserToMaster(req, res) {
        try {
            const { userId, teacherId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: "El userId es obligatorio" });
            }

            const result = await adminModel.linkUserToMaster({ userId, teacherId });

            console.log(result);
            

            if (!result.success) {
                if (result.type === 'not_found') return res.status(404).json({ message: result.message });
                if (result.type === 'conflict') return res.status(409).json({ message: result.message });
                return res.status(500).json({ message: "Error interno al asignar usuario" });
            }

            return res.status(200).json({ 
                message: "Usuario asignado al profesor correctamente. Ahora tiene rol de PROFESSOR.",
                data: result.master
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}