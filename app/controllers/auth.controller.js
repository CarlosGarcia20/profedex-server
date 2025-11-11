import { token } from "../middlewares/token.js";
import { authModel } from "../models/auth.models.js";
import { validateLogin } from "../schemas/auth.js";

export class authController {
    static async login(req, res) {
        try {
            const authValidation = await validateLogin(req.body);

           if (!authValidation.success) {
                return res.status(400).json({ message: JSON.parse(authValidation.error.message) });
            }

            const { username, password } = authValidation.data;

            const result = await authModel.login({ username, password });

            if(!result.success) return res.status(404).json({ message: result.message });

            const tokensss = await token.generateToken({ nickname: result.data.nickname })

            console.log(tokensss)

        } catch (error) {
            console.log(error);
            
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}