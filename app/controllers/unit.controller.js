import { unitModel } from "../models/unit.model.js";

export class unitController {
    static async getUnits(req, res) {
            try {
                const result = await unitModel.getUnits();
    
                if (!result.success) {
                    return res.status(404).json({ message: result.message });
                }
    
                return res.status(200).json({ data: result.data });
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }
    
        static async getUnitPerId(req, res) {
            try {
                const { unitId } = req.params;
    
                const result = await unitModel.getUnitPerId(unitId);
    
                if (!result.success) {
                    return res.status(404).json({
                        message: result.message
                    });
                }
    
                return res.status(200).json({ data: result.data });
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" })
            }
        }
    
        static async createUnit(req, res) {
            try {
                // const groupValidation = validateGroup(req.body);
    
                if (!groupValidation.success) {
                    return res.status(400).json({
                        message: "Datos incorrectos",
                        errors: groupValidation.error.flatten().fieldErrors
                    });
                }
    
                const result = await groupModel.createGroup({
                    name: groupValidation.data.name,
                    gradeLevel: groupValidation.data.grade_level,
                    major_id: groupValidation.data.major_id,
                    active: groupValidation.data.active
                })
    
                if (!result.success) {
                    return res.status().json({ message: "Ocurrió un error al crear la unidad" });
                }
    
                return res.status(201).json({ message: "Unidad guardada con éxito" });
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" })
            }
        }
    
        static async updateGroup(req, res) {
            try {
                const { groupId } = req.params;
    
                 const groupValidation = validateGroup(req.body);
    
                if (!groupValidation.success) {
                    return res.status(400).json({
                        message: "Datos incorrectos",
                        errors: groupValidation.error.flatten().fieldErrors
                    });
                }
    
                const result = await groupModel.updateGroup({ groupId, data: groupValidation.data });
                
                if (!result.success) {
                    return res.status(404).json({
                        message: "Ocurrió un error al actualizar los datos del grupo"
                    });
                }
    
                return res.status(201).json({ message: "Datos actualizados éxitosamente" });
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" })
            }
        }
    
        static async deleteGroup(req, res) {
            try {
                const { groupId } = req.params;
    
                const result = await groupModel.deleteGroup(groupId);
    
                if (!result.success) {
                    if (result.type === 'not_found') {
                        return res.status(404).json({ message: "El grupo no existe" });
                    }
                    if (result.type === 'conflict') {
                        return res.status(409).json({ message: "No se puede eliminar el grupo porque tiene registros asociados" });
                    }
    
                    return res.status(500).json({ message: "Error al eliminar el grupo" });
                }
    
                return res.sendStatus(204);
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }
}