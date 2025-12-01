import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { PORT } from "./app/config/config.js";

// Rutas
import { authRouter } from "./app/routes/auth.routes.js";
import { userRouter } from "./app/routes/users.routes.js";
import { adminRouter } from "./app/routes/admin.routes.js";
import { postRouter } from "./app/routes/post.routes.js";
import { studentRouter } from "./app/routes/student.routes.js";

// Middlewares
import { corsMiddleware } from "./app/middlewares/cors.js";


const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.disable('x-powered-by');

app.use('/auth', authRouter);
// app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/posts', postRouter);
app.use('/students', studentRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
