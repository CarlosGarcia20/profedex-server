import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

console.log("Hola Mundo");


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Conexión exitosa a PostgreSQL! Fecha del servidor: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error conectando a la base de datos");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
