document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ login.js cargado");

    const form = document.getElementById("loginForm");
    const params = new URLSearchParams(window.location.search);
const msg = params.get("msg");

if (msg === "unauthorized") {
    document.getElementById("authMessage").textContent = "Debes iniciar sesión primero";
}

    if (!form) {
        console.error("❌ No se encontró el formulario");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("📤 Enviando formulario...");

        // obtener inputs
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        // validacion
        if (!emailInput || !passwordInput) {
            console.error("❌ Inputs no encontrados");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include" 
});

            const data = await res.json();

            console.log("📥 Respuesta del servidor:", data);

            const msg = document.getElementById("loginMessage");
            if(msg){

    msg.textContent = data.message;

    msg.classList.add("message-box");

    // exito
    if(res.ok){

        msg.classList.remove("error-message");
        msg.classList.add("success-message");

    }else{

        msg.classList.remove("success-message");
        msg.classList.add("error-message");
    }

}

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

    const togglePassword = document.getElementById("togglePassword");

const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

    }else{

        passwordInput.type = "password";
    }

});

});