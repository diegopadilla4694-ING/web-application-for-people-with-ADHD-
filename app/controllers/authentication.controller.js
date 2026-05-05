import { pool } from "../db/conexion.js";
import bcrypt from "bcrypt";

// usuario admin
const DEFAULT_USER = "admin";
const DEFAULT_PASSWORD = "graficos";

// registro
export async function register(req, res) {
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE user = ?",
            [user]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("🔐 HASH:", hashedPassword);

        await pool.query(
            "INSERT INTO users (user, email, password) VALUES (?, ?, ?)",
            [user, email, hashedPassword]
        );

        // progreso
        await pool.query(
            "INSERT INTO user_progress (user_email) VALUES (?)",
            [email]
        );

        res.json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error("ERROR REGISTER:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

// login
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        // login admin
        if (email === DEFAULT_USER && password === DEFAULT_PASSWORD) {
            res.cookie("sessionUser", DEFAULT_USER, {
                httpOnly: false, 
                sameSite: "lax",
            secure: true,
                path: "/"
            });

            return res.json({ message: "Login como admin" });
        }

        // buscar email
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Correo no encontrado" });
        }

        const dbUser = rows[0];

        // comparar contraseña
        const isValid = await bcrypt.compare(password, dbUser.password);

        if (!isValid) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // guardar cookie
        res.cookie("sessionUser", dbUser.email, {
            httpOnly: false, 
            sameSite: "lax",
            secure: true,
            path: "/"
        });

        res.json({ message: "Login exitoso" });

    } catch (error) {
        console.error("ERROR LOGIN:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}