import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export class token {
    static generateToken(userData) {
        const accessToken = jwt.sign(
            {
                userIdRol: userData.userIdRol
            },
            config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            }
        );

        return { accessToken };
    }

    static generateRefreshToken(userData) {
        const refreshToken = jwt.sign(
            {
                userIdRol: userData.userIdRol
            },
            config.jwtRefreshSecret, {
                expiresIn: config.jwtRefreshExpiresIn
            }
        )

        return { refreshToken };
    }

    static async validateToken(req, res, next) {
        const accessToken = req.headers.authorization?.split(' ')[1]

        if(!accessToken) res.send("Access denied");

        jwt.verify(accessToken, config.jwtSecret, (err, user) => {
            if(err) {
                res.send("Access denied, token expired or incorrect");
            }

            req.user = user;
            next();
        });
    }
}