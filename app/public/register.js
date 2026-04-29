document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ register.js cargado");

    const form = document.getElementById("registerForm");

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

            document.getElementById("registerMessage").textContent = data.message;

            if (res.ok) {
                console.log("✅ Registro exitoso");
            }

        } catch (error) {
            console.error("🔥 Error:", error);
        }
    });

});