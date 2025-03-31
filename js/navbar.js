document.addEventListener('DOMContentLoaded', function () {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && document.getElementById("bienvenida")) {
        // Capitalizar primera letra del nombre
        const nombreCapitalizado = usuario.nombre.charAt(0).toUpperCase() + usuario.nombre.slice(1);
        document.getElementById("bienvenida").textContent = `${nombreCapitalizado} (${usuario.rol})`;
    }
    if (!usuario) return;

    if (usuario.rol === "registrador") {
        ocultarMenu(["Empleado", "Empresa"]);
    } else if (usuario.rol === "visor") {
        desactivarCRUD();
    }
});

function ocultarMenu(nombres) {
    nombres.forEach(nombre => {
        const enlaces = document.querySelectorAll(`a.nav-link, a.dropdown-item`);
        enlaces.forEach(link => {
            if (link.textContent.includes(nombre)) {
                link.style.display = "none";
            }
        });
    });
}

function desactivarCRUD() {
    const botones = document.querySelectorAll("button, a");
    botones.forEach(btn => {
        if (btn.textContent.match(/(Editar|Eliminar|Registrar|Guardar|Crear)/i)) {
            btn.style.display = "none";
        }
    });
}
