import { majorModel } from "../models/major.model.js"
import { validateMajor } from "../schemas/major.js";

export class majorController {
    static async getMajors(req, res) {
        try {
            const result = await majorModel.getMajors();

            if (!result.success) {
                res.status(404).json({ message: "No se encontraron carreras" })
            }

            return res.status(200).json({ data: result.data })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async getMajorPerId(req, res) {
        try {
            const { majorId } = req.params;

            const result = await majorModel.getMajorPerId(majorId);

            if (!result.success) {
                res.status(404).json({ message: "No se encontró la carrera solicitada" })
            }

            return res.status(200).json({ data: result.data })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async createMajor(req, res) {
        try {
            const majorValidation = validateMajor(req.body);

            if (!majorValidation.success) {
                return res.status(400).json({ 
                    message: "Datos incorrectos", 
                    errors: majorValidation.error.flatten().fieldErrors 
                });
            }

            const result = await majorModel.createMajor({
                name: majorValidation.data.name,
                description: majorValidation.data.description,
                active: majorValidation.data.active
            });

            if (!result.success) {
                return res.status(404).json({ message: "Ocurrió un error al guardar la carrera" });
            }

            return res.status(201).json({ message: "Carrera creada con éxito" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async updateMajor(req, res) {
        try {
            const { majorId } = req.params;
            const majorValidation = validateMajor(req.body);

            if (!majorValidation.success) {
                return res.status(400).json({ 
                    message: "Datos incorrectos", 
                    errors: majorValidation.error.flatten().fieldErrors 
                });
            }

            const result = await majorModel.updateMajor({
                majorId,
                data: majorValidation.data
            });

            if (!result.success) {
                return res.status(404).json({ 
                    message: "Ocurrió un error al actualizar la carrera" 
                });
            }

            return res.status(201).json({ message: "Datos actualizados éxitosamente" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async deleteMajor(req, res) {
        try {
            const { majorId } = req.params;

            const result = await majorModel.deleteMajor(majorId);

            if (!result.success) {
                if (result.type === 'not_found') {
                    return res.status(404).json({ message: "La carrera no existe" });
                }

                if (result.type === 'conflict') {
                    return res.status(409).json({ message: "No se puede eliminar la carrera porque tiene registros asociados" });
                }

                return res.status(500).json({ message: result.message });
            }

            return res.sendStatus(204);
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}