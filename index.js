import express from "express";
import morgan from "morgan";
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cookieParser from "cookie-parser";
import { PORT } from "./app/config/config.js";
import locationSocket from "./app/sockets/locationSocket.js";

// Rutas
import { authRouter } from "./app/routes/auth.routes.js";
import { userRouter } from "./app/routes/users.routes.js";
import { adminRouter } from "./app/routes/admin.routes.js";
import { postRouter } from "./app/routes/post.routes.js";
import { studentRouter } from "./app/routes/student.routes.js";
import { teacherRouter } from "./app/routes/teacher.routes.js";

// Middlewares
import { corsMiddleware } from "./app/middlewares/cors.js";
import { verifySocketToken } from "./app/middlewares/socketAuth.js";

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use(verifySocketToken)

locationSocket(io);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/auth', authRouter);
// app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/posts', postRouter);
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
