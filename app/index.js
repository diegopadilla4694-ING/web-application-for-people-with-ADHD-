import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// 
import { register, login } from "./controllers/authentication.controller.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4000;

// =====================
// MIDDLEWARES
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================
// ARCHIVOS ESTÁTICOS
// =====================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "pages/admin")));

// =====================
// VERIFICAR SESIÓN
// =====================
function verifySession(req, res, next) {
    const sessionUser = req.cookies.sessionUser;

    if (!sessionUser) {
        return res.redirect("/login");
    }

    next();
}

// =====================
// RUTAS
// =====================

// HOME (puedes cambiar luego a home.html si quieres)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});

// LOGIN
app.get("/login", (req, res) => {
    res.redirect("/");
});

// REGISTER
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "register.html"));
});

// ADMIN (PROTEGIDO)
app.get("/admin", verifySession, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/admin", "admin.html"));
});

// =====================
// APIs
// =====================
app.post("/api/login", login);
app.post("/api/register", register);

// =====================
// LOGOUT
// =====================
app.get("/logout", (req, res) => {
    res.clearCookie("sessionUser", { path: "/" });
    res.redirect("/login");
});

// =====================
// SERVIDOR
// =====================
app.listen(PORT, () => {
    console.log("Servidor en http://localhost:" + PORT);
});