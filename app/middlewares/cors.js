import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:4000',
    process.env.FRONTEND_URL
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        if (acceptedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log('BLOQUEADO POR CORS. Origen recibido:', origin);
        console.log('Orígenes aceptados:', acceptedOrigins);

        return callback(new Error('Not Allowed by CORS'));
    },
    credentials: true
});