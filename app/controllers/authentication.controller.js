import { pool } from "../db/conexion.js";

const DEFAULT_USER = "admin";
const DEFAULT_PASSWORD = "graficos";

// REGISTRO
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

        await pool.query(
            "INSERT INTO users (user, email, password) VALUES (?, ?, ?)",
            [user, email, password]
        );

        res.json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

// LOGIN
export async function login(req, res) {
    const { user, password } = req.body;

    try {
        // LOGIN ADMIN (OPCIONAL)
        if (user === DEFAULT_USER && password === DEFAULT_PASSWORD) {
            res.cookie("sessionUser", DEFAULT_USER, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/"
            });

            return res.json({ message: "Login como admin" });
        }

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE user = ?",
            [user]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const dbUser = rows[0];

        if (dbUser.password !== password) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        res.cookie("sessionUser", dbUser.user, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/"
        });

        res.json({ message: "Login exitoso" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
}
