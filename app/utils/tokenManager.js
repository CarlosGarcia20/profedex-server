import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export class tokenManager {
    static generateToken(userData) {
        return jwt.sign(
            {
                userId: userData.userId,
                userIdRol: userData.userIdRol
            },
            config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            }
        );
    }

    static generateRefreshToken(userData) {
        return jwt.sign(
            {
                userId: userData.userId
            },
            config.jwtRefreshSecret, {
                expiresIn: config.jwtRefreshExpiresIn
            }
        )
    }

    static verifyRefreshToken(token) {
        return jwt.verify(token, config.jwtRefreshSecret);
    } 
}