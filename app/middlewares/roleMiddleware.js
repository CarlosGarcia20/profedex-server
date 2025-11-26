export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        
        if (!req.user || !req.user.role) {
            return res.status(500).json({ message: "Error: No se validó el token antes de verificar el rol" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Acceso denegado: No tienes permisos de Administrador" 
            });
        }

        next();
    };
};