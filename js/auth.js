// Función para iniciar sesión
function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // Credenciales de prueba
    const validUser = "admin";
    const validPass = "1234";

    if (username === validUser && password === validPass) {
        localStorage.setItem("auth", "true");

        // Verificar desde dónde se está ejecutando el login
        let redirectPath = window.location.pathname.includes("/empleado/") || window.location.pathname.includes("/empresa/")
            ? "../index.html"
            : "index.html";

        window.location.href = redirectPath; // Redirigir a la página principal
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem("auth");

    let loginPath = window.location.pathname.includes("/empleado/") || window.location.pathname.includes("/empresa/")
        ? "../login.html"
        : "login.html";

    window.location.href = loginPath;
}

// Función para verificar autenticación
function verificarAutenticacion() {
    if (localStorage.getItem("auth") !== "true") {
        let loginPath = window.location.pathname.includes("/empleado/") || window.location.pathname.includes("/empresa/")
            ? "../login.html"
            : "login.html";

        alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
        window.location.href = loginPath;
    }
}

/*
// Función para iniciar sesión
function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Credenciales de prueba (puedes cambiarlo a un sistema con backend)
    const validUser = "admin";
    const validPass = "1234";

    if (username === validUser && password === validPass) {
        localStorage.setItem("auth", "true");
        window.location.href = "../index.html"; // Redirigir a la página principal
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem("auth");
    window.location.href = "../login.html";
}

// Función para verificar autenticación
function verificarAutenticacion() {
    if (localStorage.getItem("auth") !== "true") {
        window.location.href = "../login.html";
    }
}*/