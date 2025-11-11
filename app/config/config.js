import 'dotenv/config';
export const PORT = process.env.PORT || 4000;

const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: '5m',
    jwtRefreshExpiresIn: '7d'
};

export default config;