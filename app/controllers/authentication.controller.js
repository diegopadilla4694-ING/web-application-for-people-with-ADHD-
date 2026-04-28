let users = [];

const DEFAULT_USER = "admin";
const DEFAULT_PASSWORD = "graficos";

export async function register(req, res) {
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const exist = users.find(u => u.user === user);

    if (exist) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }

    users.push({ user, email, password });

    res.json({ message: "Usuario registrado correctamente" });
}

export async function login(req, res) {
    const { user, password } = req.body;

    const exist = users.find(u => u.user === user);

    if (user === DEFAULT_USER && password === DEFAULT_PASSWORD) {
        res.cookie("sessionUser", DEFAULT_USER, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/"
        });

        return res.json({ message: "Login como admin" });
    }

    if (exist && exist.password === password) {
        res.cookie("sessionUser", exist.user, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/"
        });

        return res.json({ message: "Login exitoso" });
    }

    return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
}

export { users };

