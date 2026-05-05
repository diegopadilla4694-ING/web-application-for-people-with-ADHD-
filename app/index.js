import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { register, login } from "./controllers/authentication.controller.js";
import { getStats, getUser } from "./controllers/tasksController.js";

import {
    getTasks,
    createTask,
    toggleTask,
    editTask,
    deleteTask,
    getProgress
} from "./controllers/tasksController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// puerto
const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//verificar seccion
function verifySession(req, res, next) {
    const sessionUser = req.cookies.sessionUser;

    if (!sessionUser) {
        return res.redirect("/?msg=unauthorized");
    }

    next();
}

//apis
app.post("/api/login", login);
app.post("/api/register", register);

app.get("/api/tasks", verifySession, getTasks);
app.post("/api/tasks", verifySession, createTask);
app.post("/api/tasks/toggle", verifySession, toggleTask);
app.post("/api/tasks/edit", verifySession, editTask);
app.delete("/api/tasks/:id", verifySession, deleteTask);
app.get("/api/progress", verifySession, getProgress);
app.get("/api/stats", verifySession, getStats);
app.get("/api/user", verifySession, getUser);

//archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//vistas

//login principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});

// Registro
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "register.html"));
});

//admin (protegido)
app.get("/admin", verifySession, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/admin", "admin.html"));
});

// salir interfaz
app.get("/logout", (req, res) => {
    res.clearCookie("sessionUser", { path: "/" });
    res.redirect("/");
});

// Manejo existente
app.get("*", (req, res) => {
    res.redirect("/");
});

// servidor
app.listen(PORT, () => {
    console.log("Servidor en http://localhost:" + PORT);
});