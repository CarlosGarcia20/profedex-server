import express from "express";
import morgan from "morgan";

// Archivos de configuración
import { PORT } from "./app/config/config.js";
import { authRouter } from "./app/routes/auth.routes.js";
import { userRouter } from "./app/routes/users.routes.js";

// Middlewares
import { corsMiddleware } from "./app/middlewares/cors.js";


const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(morgan('dev'));
app.disable('x-powered-by');

app.use('/auth', authRouter);
app.use('/users', userRouter);
// app.use('/administrator', administratorRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
