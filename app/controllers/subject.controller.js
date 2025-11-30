import { subjectModel } from "../models/subject.model.js";
import { validateSubject } from "../schemas/subject.js";

export class subjectController {
    static async getSubjects(req, res) {
        try {
            const result = await subjectModel.getSubjects();

            if (!result.success) {
                return res.status(404).json({ message: "No hay materias registradas" });
            }

            res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async getSubjectPerId(req, res) {
        try {
            const { subjectId } = req.params;

            const result = await subjectModel.getSubjectPerId(subjectId);

            if (!result.success) {
                return res.status(404).json({ 
                    message: "No se ha encontrado información de la materia solicitada" 
                });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async createSubject(req, res) {
        try {
            const subjectValidation = validateSubject(req.body);

             if (!subjectValidation.success) {
                return res.status(400).json({ 
                    message: "Datos incorrectos", 
                    errors: subjectValidation.error.flatten().fieldErrors 
                });
            }

            const result = await subjectModel.createSubject({
                name: subjectValidation.data.name,
                code: subjectValidation.data.code,
                description: subjectValidation.data.description,
                credits: subjectValidation.data.credits,
                hours: subjectValidation.data.hours,
                semester: subjectValidation.data.semester,
                plan_year: subjectValidation.data.plan_year,
                career_id: subjectValidation.data.career_id,
                active: subjectValidation.data.active
            });

            if (!result.success) {
                return res.status().json({ message: "Ocurrió un error al guardar la materia "});
            }
            
            return res.status(201).json({ message: "Materia guardada con éxito "});
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async updateSubjetc(req, res) {
        try {
            const { subjectId } = req.params;

            const result = await subjectModel.updateSubjetc(subjectId);

            if (!result.success) {
                return res.status(404).json({ 
                    message: "Ocurrió un error al actualizar los datos de la materia" 
                });
            }

            return res.status(201).json({ message: "Datos actualizados éxitosamente" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
    static async deleteSubject(req, res) {
        try {
            const { subjectId } = req.params;

            const result = await subjectModel.deleteSubject(subjectId);

            if (!result.success) {
                if (result.type === 'not_found') {
                    return res.status(404).json({ message: "La materia no existe" });
                }
                if (result.type === 'conflict') {
                    return res.status(409).json({ message: "No se puede eliminar la materia porque tiene registros asociados" });
                }
                // Error genérico
                return res.status(500).json({ message: "Error al eliminar la materia" });
            }
            
            return res.sendStatus(204); 
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}