import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const parseCookies = (str) => {
    if (!str) return {};
    return str.split(';').reduce((acc, item) => {
        const [key, val] = item.trim().split('=');
        acc[key] = val;
        return acc;
    }, {});
};

export const verifySocketToken = (socket, next) => {
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers.cookie) {
        const cookies = parseCookies(socket.handshake.headers.cookie);
        token = cookies.accessToken;
    }

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
        
        socket.user = decoded;
        next();
    });
};