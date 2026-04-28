document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password })
    });

    const data = await res.json();
    document.getElementById("loginMessage").textContent = data.message;

    if (res.ok) {
        window.location.href = "/admin";
    }
});