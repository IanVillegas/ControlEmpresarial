function mostrarAlerta(mensaje) {
    const alertaMensaje = document.getElementById("alertaMensaje");
    const alertaModal = new bootstrap.Modal(document.getElementById("alertaModal"));
    if (alertaMensaje && alertaModal) {
        alertaMensaje.textContent = mensaje;
        alertaModal.show();
    } else {
        alert(mensaje);
    }
}

// Función para iniciar sesión

function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const usuarios = [
        {usuario: "admin", password: "1", rol: "admin"},
        {usuario: "registrador", password: "12", rol: "registrador"},
        {usuario: "visor", password: "123", rol: "visor"}
    ];

    const usuarioEncontrado = usuarios.find(user =>
        user.usuario === username && user.password === password
    );

    if (!usuarioEncontrado) {
        mostrarAlerta("Usuario o contraseña incorrectos.");
        return;
    }
    if (usuarioEncontrado.rol === "sinRol") {
        mostrarAlerta("No tiene permisos para ingresar a la aplicación.");
        return;
    }

    localStorage.setItem("usuario", JSON.stringify({
        nombre: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.rol
    }));

    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    aplicarPermisos(usuario.rol);
}

function aplicarPermisos(rol) {
    if (rol === "registrador") {
        deshabilitarAcceso([
            "indexEmpleado.html",
            "frmEmpleado.html",
            "indexEmpresa.html",
            "frmEmpresa.html",
            "reporte.html"
        ]);
    } else if (rol === "visor") {
        deshabilitarBotonesCRUD();
    }
}

function deshabilitarAcceso(paginasRestringidas) {
    const actual = window.location.pathname.split("/").pop();
    if (paginasRestringidas.includes(actual)) {
        mostrarAlerta("No tiene permiso para acceder a esta página.");
        setTimeout(() => window.location.href = "index.html", 2500);
    }
}

function deshabilitarBotonesCRUD() {
    const botones = document.querySelectorAll(".btn, .dropdown-item, .acciones button");
    botones.forEach(btn => {
        if (btn.textContent.match(/(editar|eliminar|registrar|crear|guardar)/i)) {
            btn.style.display = "none";
        }
    });

    const enlaces = document.querySelectorAll("a[href*='frm']");
    enlaces.forEach(link => link.style.display = "none");
}

function mostrarToast(mensaje, tipo = "success") {
    const toastEl = document.getElementById("toast-mensaje");
    const toastTexto = document.getElementById("toast-texto");

    toastTexto.textContent = mensaje;

    // Cambiar color según tipo
    const clases = {
        success: "bg-success",
        danger: "bg-danger",
        warning: "bg-warning",
        info: "bg-info"
    };

    toastEl.className = `toast align-items-center text-white border-0 ${clases[tipo] || "bg-success"}`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
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
