document.addEventListener("DOMContentLoaded", () => {

    // Navegación
    document.querySelectorAll(".menu-item").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            let target = btn.dataset.target;

            document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
            document.getElementById(`sec-${target}`).classList.remove("hidden");
        });
    });

    //login
    document.getElementById("logoutBtn").addEventListener("click", () => {
        fetch("/logout")
            .then(() => {
                window.location.href = "/";
            });
    });
});
