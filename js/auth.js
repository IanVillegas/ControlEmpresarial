function mostrarAlerta(mensaje) {
    document.getElementById("alertaMensaje").innerText = mensaje;
    let alertaModal = new bootstrap.Modal(document.getElementById("alertaModal"));
    alertaModal.show();
}
// Función para iniciar sesión
function login(event) {
    event.preventDefault();

    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // Credenciales de prueba
    const validUser = "admin";
    const validPass = "1234";

    if (username === validUser && password === validPass) {
        localStorage.setItem("auth", "true");

        let redirectPath = window.location.pathname.includes("/empleado/") || window.location.pathname.includes("/empresa/")
            ? "../index.html"
            : "index.html";

        window.location.href = redirectPath; // Redirigir a la página principal
    } else {
        mostrarAlerta("Usuario o contraseña incorrectos.");
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
        mostrarAlerta("Tu sesión ha expirado. Inicia sesión nuevamente.");

        setTimeout(() => {
            let loginPath = window.location.pathname.includes("/empleado/") || window.location.pathname.includes("/empresa/")
                ? "../login.html"
                : "login.html";

            window.location.href = loginPath;
        }, 2000);
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
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var forms = document.querySelectorAll('.needs-validation');

        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();  // Evita el envío si no es válido
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
    });
})();
