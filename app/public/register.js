document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = document.getElementById("nombre").value;
    const email = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, email, password })
    });

    const data = await res.json();
    document.getElementById("registerMessage").textContent = data.message;

    if (res.ok) {
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    }
});