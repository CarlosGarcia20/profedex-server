import { unitModel } from "../models/unit.model.js";
import { validateUnits } from "../schemas/units.js";

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

        static async getUnitsBySubjectId(req, res) {
            try {
                const { subjectId } = req.params;
    
                const result = await unitModel.getUnitsBySubjectId(subjectId);
    
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
    
        static async createUnits(req, res) {
            try {
                const unitsValidation = validateUnits(req.body);

                if (!unitsValidation.success) {
                    console.log(unitsValidation);
                    
                    return res.status(400).json({
                        message: "Datos incorrectos en las unidades",
                        errors: unitsValidation.error.errors
                    });
                }

                const result = await unitModel.createBulkUnits(unitsValidation.data);
                console.log(result);
                

                if (!result.success) {
                    return res.status(500).json({ message: "Ocurrió un error al guardar las unidades" });
                }

                return res.status(201).json({ 
                    message: "Unidades guardadas con éxito", 
                    count: result.count 
                });

            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" });
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
    
        static async deleteUnit(req, res) {
            try {
                const { unitId } = req.params;
    
                const result = await unitModel.deleteUnit(unitId);
    
                if (!result.success) {
                    if (result.type === 'not_found') {
                        return res.status(404).json({ message: "La unidad no existe" });
                    }
                    if (result.type === 'conflict') {
                        return res.status(409).json({ message: "No se puede eliminar la unidad porque tiene registros asociados" });
                    }
    
                    return res.status(500).json({ message: "Error al eliminar la unidad" });
                }
    
                return res.sendStatus(204);
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }
}