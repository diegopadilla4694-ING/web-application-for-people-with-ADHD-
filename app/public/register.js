document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ register.js cargado");

    const form = document.getElementById("registerForm");
    const message = document.getElementById("registerMessage");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("📤 Enviando registro...");

        const user = document.getElementById("nombre").value;
        const email = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        console.log("Datos:", user, email, password);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, email, password })
            });

            const data = await res.json();

            console.log("📥 Respuesta:", data);

            // 🔥 LIMPIAR CLASES
            message.className = "message";

            // 🔥 SI ES ERROR
            if (!res.ok || data.message.toLowerCase().includes("error")) {
                message.classList.add("error");
                message.textContent = data.message || "Error al registrar";
                return;
            }

            // 🔥 ÉXITO
            message.classList.add("success");
            message.textContent = "Registro exitoso";

            console.log("✅ Registro exitoso");

            form.reset();

            // opcional redirección
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);

        } catch (error) {
            console.error("🔥 Error:", error);

            message.className = "message error";
            message.textContent = "Error del servidor";
        }
    });

});