import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { register, login, users } from "./controllers/authentication.controller.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "pages/admin")));

// milweres seccion
function verifySession(req, res, next) {
    const sessionUser = req.cookies.sessionUser;

    if (!sessionUser) {
        return res.redirect("/login");
    }

    const isRegistered = users.some(u => u.user === sessionUser);
    const isDefault = sessionUser === "admin";

    if (!isRegistered && !isDefault) {
        return res.redirect("/login");
    }

    next();
}

// Rutas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});

app.get("/login", (req, res) => {
    res.redirect("/");
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "register.html"));
});

app.get("/admin", verifySession, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/admin", "admin.html"));
});

// APIs
app.post("/api/login", login);
app.post("/api/register", register);

//LOGOUT
app.get("/logout", (req, res) => {
    res.clearCookie("sessionUser", { path: "/" });
    res.redirect("/login");
});

// Servidor
app.listen(PORT, () => {
    console.log("Servidor en http://localhost:" + PORT);
});