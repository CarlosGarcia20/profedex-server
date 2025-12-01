import { groupModel } from "../models/group.model.js";
import { validateGroup } from "../schemas/group.js";

export class groupController {
    static async getGroups(req, res) {
        try {
            const result = await groupModel.getGroups();

            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json({ data: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getGroupPerId(req, res) {
        try {
            const { groupId } = req.params;

            const result = await groupModel.getGroupPerId(groupId);

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

    static async createGroup(req, res) {
        try {
            const groupValidation = validateGroup(req.body);

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
                return res.status().json({ message: "Ocurrió un error al guardar el grupo " });
            }

            return res.status(201).json({ message: "Grupo guardado con éxito" });
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