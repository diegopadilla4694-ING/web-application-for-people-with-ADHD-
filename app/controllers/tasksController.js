import { pool } from "../db/conexion.js";

export const getTasks = async (req, res) => {
    try {
        const user = req.cookies.sessionUser;

        const [rows] = await pool.query(
            "SELECT * FROM tasks WHERE user_email=?",
            [user]
        );

        res.json(rows); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener tareas" }); 
    }
};

//crear tarea
export const createTask = async (req, res) => {
    try {
        const { text, priority } = req.body;
        const user = req.cookies.sessionUser;

        if (!text) {
            return res.status(400).json({ error: "Texto vacío" });
        }

        // contar tareas pendientes
        const [rows] = await pool.query(
            "SELECT COUNT(*) as total FROM tasks WHERE completed = 0 AND user_email = ?",
            [user]
        );

        const total = parseInt(rows[0].total); 

        console.log("🧠 Pendientes:", total);

        // bloqueo
        if (total >= 3) {
            console.log("🚫 BLOQUEADO");

            return res.status(400).json({
                error: "Solo puedes tener máximo 3 tareas activas"
            });
        }

        // insertar
       await pool.query(
    `INSERT INTO tasks (task, user_email, priority)
     VALUES (?, ?, ?)`,
    [text, user, priority]
);

        console.log("✅ TAREA AGREGADA");

        res.json({ success: true });

    } catch (error) {
        console.error("ERROR CREATE:", error);
        res.status(500).json({ error: "Error al crear tarea" });
    }
};

export const toggleTask = async (req, res) => {
    try {
        const { id, completed } = req.body;
        const user = req.cookies.sessionUser;

        // 🔹 actualizar tarea
        await pool.query(
            "UPDATE tasks SET completed=? WHERE id=? AND user_email=?",
            [completed, id, user]
        );

        // solo si se completa
        if (completed) {

            //obtener datos
            const [data] = await pool.query(
                "SELECT xp, streak, last_completed FROM user_progress WHERE user_email=?",
                [user]
            );

            let xp;
            let streak;
            let lastDate;

            // si no existe se crea
            if (data.length === 0) {

                xp = 10;
                streak = 1;
                lastDate = new Date().toISOString().slice(0, 10);

                await pool.query(
                    "INSERT INTO user_progress (user_email, xp, streak, last_completed, level) VALUES (?, ?, ?, ?, 1)",
                    [user, xp, streak, lastDate]
                );

            } else {

                xp = data[0].xp + 10;//suma xp
                streak = data[0].streak;
                lastDate = data[0].last_completed;

                // actualizar xp
                await pool.query(
                    "UPDATE user_progress SET xp=? WHERE user_email=?",
                    [xp, user]
                );
            }

            //calcular nivel
            const levels = [0, 100, 250, 500, 1000];
            let level = 1;

            for (let i = 0; i < levels.length; i++) {
                if (xp >= levels[i]) {
                    level = i + 1;
                }
            }

            await pool.query(
                "UPDATE user_progress SET level=? WHERE user_email=?",
                [level, user]
            );

            // racha por dia
            const today = new Date().toISOString().slice(0, 10);

            if (!lastDate) {
                streak = 1;
            } else if (lastDate === today) {
                // mismo día → no cambia
            } else {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yDate = yesterday.toISOString().slice(0, 10);

                if (lastDate === yDate) {
                    streak += 1;
                } else {
                    streak = 1;
                }
            }

            // actualizar racha
            await pool.query(
                "UPDATE user_progress SET streak=?, last_completed=? WHERE user_email=?",
                [streak, today, user]
            );
        }

        res.sendStatus(200);

    } catch (error) {
        console.error("TOGGLE ERROR:", error);
        res.status(500).json({ error: "Error toggle" });
    }
};

//editar
export const editTask = async (req, res) => {
    try {
        const { id, text } = req.body;
        const user = req.cookies.sessionUser;

        if (!id || !text) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        await pool.query(
            "UPDATE tasks SET task=? WHERE id=? AND user_email=?",
            [text, id, user]
        );

        res.sendStatus(200);

    } catch (error) {
        console.error("EDIT ERROR:", error);
        res.status(500).json({ error: "Error al editar" });
    }
};

//eliminar
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.cookies.sessionUser;

        if (!id) {
            return res.status(400).json({ error: "ID requerido" });
        }

        await pool.query(
            "DELETE FROM tasks WHERE id=? AND user_email=?",
            [id, user]
        );

        res.sendStatus(200);

    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ error: "Error al eliminar" });
    }
};

//progreso
export const getProgress = async (req, res) => {
    try {
        const user = req.cookies.sessionUser;

        const [totalRows] = await pool.query(
            "SELECT COUNT(*) as total FROM tasks WHERE user_email=?",
            [user]
        );

        const [completedRows] = await pool.query(
            "SELECT COUNT(*) as completed FROM tasks WHERE completed=1 AND user_email=?",
            [user]
        );

        res.json({
            total: totalRows[0].total,
            completed: completedRows[0].completed
        });

    } catch (error) {
        console.error("PROGRESS ERROR:", error);
        res.status(500).json({ error: "Error en progreso" });
    }
};

export const getStats = async (req, res) => {
    try {
        const user = req.cookies.sessionUser;

        const [rows] = await pool.query(
            "SELECT xp, level, streak FROM user_progress WHERE user_email=?",
            [user]
        );

        res.json(rows[0] || { xp: 0, level: 1, streak: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error stats" });
    }
};

export const getUser = (req, res) => {
    const user = req.cookies.sessionUser;

    if (!user) {
        return res.json({ user: null });
    }

    res.json({ user });
};