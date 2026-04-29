document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ login.js cargado");

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("📤 Enviando formulario...");

        const user = document.getElementById("user").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, password })
            });

            const data = await res.json();

            console.log("📥 Respuesta del servidor:", data);

            document.getElementById("loginMessage").textContent = data.message;

            if (res.ok) {
                console.log("✅ Login correcto, redirigiendo...");
                window.location.href = "/admin";
            } else {
                console.log("❌ Login fallido");
            }

        } catch (error) {
            console.error("🔥 Error en fetch:", error);
        }
    });

});

