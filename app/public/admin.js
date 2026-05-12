const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const toastContainer = document.getElementById('toast-container');
const suggestionsBox = document.getElementById("suggestions-box");
const modal = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const closeModal = document.getElementById("close-modal");
const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const completedList = document.getElementById("completed-list");



menuBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evitar que se cierre
    sideMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && e.target !== menuBtn) {
        sideMenu.classList.remove("active");
    }
});


let tasks = [];

//mensajes
const congratsMessages = [
    "¡Excelente trabajo!",
    "¡Una menos, sigue así!",
    "¡Lo estás haciendo genial!",
    "¡Paso a paso!",
    "¡Bien hecho!"
];

function randomMsg() {
    return congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
}

// sugerencias (tdha) 
const suggestions = {

    ejercicio: [
        "caminar 10 minutos",
        "estirarse 5 minutos",
        "hacer 5 sentadillas"
    ],

    estudio: [
        "leer 5 páginas",
        "repasar apuntes 10 min",
        "resolver 3 ejercicios"
    ],

    tarea: [
        "hacer tarea 15 min",
        "responder preguntas",
        "revisar trabajo"
    ],

    limpiar: [
        "ordenar escritorio",
        "acomodar ropa",
        "tirar basura"
    ],

    casa: [
        "hacer la cama",
        "limpiar mesa",
        "barrer cuarto"
    ],

    enfoque: [
        "trabajar 10 min sin distracciones",
        "cerrar redes sociales",
        "activar temporizador"
    ],

    personal: [
        "beber agua",
        "lavarse la cara",
        "descansar 5 min"
    ],

    salud: [
        "comer algo saludable",
        "hidratarse",
        "estirarse"
    ],

    mental: [
        "respirar profundo",
        "cerrar ojos 2 min",
        "relajarse"
    ],

    social: [
        "enviar mensaje a un amigo",
        "hablar con alguien",
        "hacer una llamada"
    ],

    organizacion: [
        "planear el día",
        "hacer lista de tareas",
        "ordenar pendientes"
    ],

    productividad: [
        "terminar una tarea",
        "avanzar 10 minutos",
        "revisar progreso"
    ],

    descanso: [
        "cerrar ojos 5 min",
        "respirar profundo",
        "escuchar música"
    ],

    creatividad: [
        "dibujar algo rápido",
        "escribir ideas",
        "imaginar soluciones"
    ],

    tecnologia: [
        "limpiar archivos",
        "organizar carpetas",
        "borrar fotos innecesarias"
    ],

    finanzas: [
        "revisar gastos",
        "anotar ingresos",
        "organizar dinero"
    ],

    alimentacion: [
        "preparar snack saludable",
        "comer fruta",
        "tomar agua"
    ],

    higiene: [
        "cepillarse dientes",
        "lavarse manos",
        "cambiarse ropa"
    ],

    rutina: [
        "levantarse temprano",
        "prepararse",
        "empezar actividad"
    ],

    motivacion: [
        "recordar objetivo",
        "pensar positivo",
        "empezar pequeño"
    ],

    energia: [
        "moverse un poco",
        "respirar profundo",
        "tomar agua"
    ],

    lectura: [
        "leer 3 páginas",
        "subrayar ideas",
        "resumir"
    ],

    escritura: [
        "escribir 5 líneas",
        "anotar ideas",
        "hacer lista"
    ],

    revision: [
        "revisar tarea",
        "corregir errores",
        "mejorar detalles"
    ]

};
//sugerencias
const quickTasks = [
    "caminar 5 minutos",
    "beber agua",
    "ordenar escritorio",
    "respirar profundo 2 min",
    "estirarse 3 minutos",
    "hacer 5 sentadillas",
    "leer 2 páginas",
    "organizar mochila",
    "limpiar mesa",
    "cerrar redes sociales",
    "trabajar 5 minutos",
    "anotar pendientes",
    "lavarse la cara",
    "escuchar música tranquila",
    "tomar un descanso corto"
];

async function init() {
    try {
        const res = await fetch("/api/tasks");

        if (!res.ok) {
            console.error("Error servidor:", res.status);
            return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("No es un array:", data);
            return;
        }

        tasks = data;
        renderTasks();

    } catch (error) {
        console.error("Error en init:", error);
    }
}

// render

function renderTasks() {

    taskList.innerHTML = "";

    // ===== TAREA DESTACADA =====

    const featuredContainer =
    document.getElementById(
        "featured-task-container"
    );

    // limpiar contenedor

    featuredContainer.innerHTML = "";

    // buscar prioridad alta

    const featuredTask = tasks.find(task =>

        task.priority === "alta"
        &&
        task.completed == 0

    );

    // mostrar destacada

    if(featuredTask){

        featuredContainer.innerHTML = `

            <div class="featured-task">

                <div class="featured-header">

                    🔥
                    <span>
                        Tarea principal del día
                    </span>

                </div>

                <div class="featured-task-body">

                    <label class="task-checkbox">

                        <input
                            type="checkbox"
                            id="featured-checkbox"
                        >

                        <span class="checkmark"></span>

                    </label>

                    <div class="featured-task-text">

                        ${featuredTask.task}

                    </div>

                    <button
                        class="delete-btn"
                        id="featured-delete"
                    >

                        ✕

                    </button>

                </div>

                <div class="featured-priority">

                    Alta prioridad

                </div>

            </div>

        `;

        // eventos

        const featuredCheckbox =
        document.getElementById(
            "featured-checkbox"
        );

        const featuredDelete =
        document.getElementById(
            "featured-delete"
        );

        featuredCheckbox.checked =
        featuredTask.completed == 1;

        featuredCheckbox.addEventListener(
            "change",
            () => toggleTask(featuredTask.id)
        );

        featuredDelete.addEventListener(
            "click",
            () => deleteTask(featuredTask.id)
        );

    }

    // ===== TAREAS PENDIENTES =====

    tasks

        .filter(task => {

            // solo pendientes

            if(task.completed != 0){

                return false;
            }

            // ocultar destacada

            if(
                featuredTask
                &&
                task.id === featuredTask.id
            ){

                return false;
            }

            return true;

        })

        .forEach(task => {

            const li = document.createElement("li");

            li.className =
            `task-item priority-${task.priority}`;

            li.innerHTML = `

                <label class="task-checkbox">

                    <input type="checkbox">

                    <span class="checkmark"></span>

                </label>

                <input
                    class="task-text"
                    type="text"
                    value="${task.task}"
                >

                <button class="delete-btn">

                    ✕

                </button>

            `;

            const checkbox =
            li.querySelector(
                "input[type=checkbox]"
            );

            const text =
            li.querySelector(
                "input[type=text]"
            );

            const del =
            li.querySelector(".delete-btn");

            checkbox.checked =
            task.completed == 1;

            checkbox.addEventListener(
                "change",
                () => toggleTask(task.id)
            );

            text.addEventListener(
                "blur",
                () => editTask(task.id, text.value)
            );

            del.addEventListener(
                "click",
                () => deleteTask(task.id, li)
            );

            taskList.appendChild(li);

        });

    // ===== HISTORIAL =====

    completedList.innerHTML = "";

    const completedTasks = tasks.filter(
        task => task.completed == 1
    );

    // contador

    document.getElementById("history-count")
    .textContent =
    `${completedTasks.length} tareas`;

    completedTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "completed-task";

        li.innerHTML = `

            <div class="completed-task-icon">
                ✓
            </div>

            <div class="completed-task-content">

                <span class="completed-task-text">

                    ${task.task}

                </span>

                <span class="completed-task-date">

                    ${new Date()
                        .toLocaleDateString()}

                </span>

            </div>

        `;

        completedList.appendChild(li);

    });

    updateProgress();
}



// historial

completedList.innerHTML = "";

const completedTasks = tasks.filter(
    task => task.completed == 1
);

// contador historial

document.getElementById("history-count")
.textContent =
`${completedTasks.length} tareas`;

completedTasks.forEach(task => {

    const li = document.createElement("li");

    li.className = "completed-task";

    li.innerHTML = `

        <div class="completed-task-icon">
            ✓
        </div>

        <div class="completed-task-content">

            <span class="completed-task-text">

                ${task.task}

            </span>

            <span class="completed-task-date">

                ${new Date().toLocaleDateString()}

            </span>

        </div>

    `;

    completedList.appendChild(li);

});

updateProgress();
// agregar
async function addTask() {
    const text = newTaskInput.value.trim();
    const priority =
document.getElementById("priority-select").value;
    if (!text) return;

    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
    text,
    priority
})
    });

    // por si existe error
    if (!res.ok) {
        const err = await res.json(); 
        showModal("⚠️ Atención", err.error);
        return;
    }

    // limpiar imput
    newTaskInput.value = "";
    suggestionsBox.innerHTML = "";

    // reset mensajes
    window.startMessage = false;
    window.midMessage = false;
    window.celebrated = false;

    // recargar
    init();
    loadStats();
}

// toglee
async function toggleTask(id) {
    const task = tasks.find(t => t.id == id);

    await fetch("/api/tasks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id,
            completed: !task.completed
        })
    });
   
    if (!task.completed) {
    showModal("🎉 ¡Bien hecho!", randomMsg());
}

    init();
    loadStats(); 
}

// edit
async function editTask(id, text) {
    if (!text.trim()) return;

    await fetch("/api/tasks/edit", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ id, text })
    });
}

// eliminar
async function deleteTask(id, el) {
    el.remove();

    await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    init();
    loadStats();
}

// progreso
async function updateProgress() {
    try {
        const res = await fetch("/api/progress");
        const data = await res.json();

        const total = data.total;
        const completed = data.completed;

        const percent = total ? Math.round((completed / total) * 100) : 0;

        //barra
        progressBar.style.width = percent + "%";

        // texto
        progressText.textContent = percent + "%";

        //modal + confetti
        if (percent === 100 && !window.celebrated) {
    showModal(
        "🎉 ¡Felicidades!",
        "Has completado todas tus tareas 💪",
        true
    );
    window.celebrated = true;
}

// inicio
if (percent > 0 && percent < 50 && !window.startMessage) {
    showModal(
        "💪 ¡Buen comienzo!",
        "Ya diste el primer paso 🚀"
    );
    window.startMessage = true;
}

// mitad
if (percent >= 50 && percent < 100 && !window.midMessage) {
    showModal(
        "🔥 ¡Vas muy bien!",
        "Ya llevas más de la mitad 💪"
    );
    window.midMessage = true;
}

    } catch (error) {
        console.error("Error progreso:", error);
    }
}

// xp nivel
async function loadStats() {
    try {
        const res = await fetch("/api/stats");
        const data = await res.json();

        const levels = [0, 100, 250, 500, 1000];

        const currentLevel = data.level;
        const xp = data.xp;

        const minXP = levels[currentLevel - 1];
        const maxXP = levels[currentLevel] || (minXP + 100);

        const progress = ((xp - minXP) / (maxXP - minXP)) * 100;

        // ui
        document.getElementById("level").textContent = currentLevel;
        document.getElementById("xp").textContent =xp + " XP";
        document.getElementById("streak").textContent = data.streak;

        document.getElementById("xp-fill").style.width = progress + "%";

        // txt dinamico
        const faltante = maxXP - xp;

        document.getElementById("xp-text").textContent =
            `${xp} / ${maxXP} XP (te faltan ${faltante})`;

    } catch (error) {
        console.error("Error stats:", error);
    }
}



// autocompletado
newTaskInput.addEventListener("input", () => {
    const value = newTaskInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    for (let key in suggestions) {
        if (value.includes(key)) {
            suggestions[key].forEach(s => {
                const div = document.createElement("div");
                div.className = "suggestion-item";
                div.textContent = s;

                div.onclick = () => {
                    newTaskInput.value = s;
                    suggestionsBox.innerHTML = "";
                };

                suggestionsBox.appendChild(div);
            });
        }
    }
});

// boton sugerencia
function setupHelpButton() {

    const btn = document.getElementById("help-btn");

    if (!btn) return; 

    btn.onclick = () => {
        const random = quickTasks[Math.floor(Math.random() * quickTasks.length)];
        newTaskInput.value = random;

        // limpiar sugerencias
        suggestionsBox.innerHTML = "";
    };
}
// evento
addTaskBtn.addEventListener("click", addTask);

newTaskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

function showModal(title, text, withConfetti = false) {

    modalTitle.textContent = title;
    modalText.textContent = text;

    modal.classList.add("active");

    if (withConfetti) {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
}

async function loadUser() {
    try {
        const res = await fetch("/api/user", {
            credentials: "include"
        });

        const data = await res.json();

        const el = document.getElementById("user-email");

        if (data.user) {
            el.textContent = "👤 " + data.user;
        } else {
            el.textContent = "👤 No identificado";
        }

    } catch (error) {
        console.error("Error cargando usuario:", error);
    }
}

closeModal.onclick = () => {
    modal.classList.remove("active");
};

init();
loadStats();
setupHelpButton(); 

document.addEventListener("DOMContentLoaded", () => {
    loadUser();
});

