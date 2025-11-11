import jwt from 'jsonwebtoken';
import 'dotenv/config';
import config from '../config/config.js';

export class token {
    static generateToken(userData) {
        const accessToken = jwt.sign(
            {
                // userId: userData.userId
                nickname: userData.nickname
            },
            config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            }
        );

        return { accessToken };
    }

    static async validateToken(req, res, next) {
        const accessToken = req.headers['authorization'];

        if(!accessToken) res.send("Access denied");

        jwt.verify(accessToken, process.env.SECRET, )
    }
}