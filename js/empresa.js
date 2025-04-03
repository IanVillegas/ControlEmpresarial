let empresaAEliminarIndex = null;
document.addEventListener("DOMContentLoaded", function () {
    cargarEmpresas();
    localStorage.removeItem("editIndex");
    document.getElementById("confirmarEliminacionBtn").addEventListener("click", confirmarEliminacion);
});

function guardarEmpresa(event) {
    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let nombre = document.getElementById("nombre").value;
    let capacidadMaxima = document.getElementById("capacidadMaxima").value;
    let latitud = document.getElementById("latitud").value;
    let longitud = document.getElementById("longitud").value;

    if (!nombre || !capacidadMaxima || !latitud || !longitud) {
        mostrarToast("Todos los campos son obligatorios", "danger");
        return;
    }

    let empresas = JSON.parse(localStorage.getItem("empresas")) || [];
    let index = localStorage.getItem("editIndex");

    // Validar duplicado (excepto si es edición del mismo registro)
    let nombreDuplicado = empresas.some((emp, i) =>
        emp.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() && i != index
    );

    if (nombreDuplicado) {
        mostrarToast("Ya existe una empresa con ese nombre. Por favor elige otro.", "danger");

        return;
    }

    // Crear objeto empresa
    let empresa = {nombre, capacidadMaxima, latitud, longitud};

    if (index !== null) {
        empresas[index] = empresa;
    } else {
        empresas.push(empresa);
    }

    localStorage.setItem("empresas", JSON.stringify(empresas));
    window.location.href = "indexEmpresa.html";
}


function cargarEmpresas() {
    let empresas = JSON.parse(localStorage.getItem("empresas")) || [];
    let tbody = document.getElementById("empresas-list");
    tbody.innerHTML = "";
    if (empresas.length === 0) { // Verificar si no hay empleados
        // Generar un modal (de bootstrap) para mostrar el mensaje de que no hay empleados
        let noEmpresasModal = new bootstrap.Modal(document.getElementById("sinEmpresas"));
        noEmpresasModal.show();
    } else {
        empresas.forEach((empresa, index) => {
            const staticMapUrl
                = `https://maps.googleapis.com/maps/api/staticmap?center=${empresa.latitud},${empresa.longitud}&zoom=15&size=200x150&markers=color:red%7C${empresa.latitud},${empresa.longitud}&key=AIzaSyB4cUgCX8WiVbCJ4_tLGtieh08W5lVTTjU`;
            let fila = `<tr>
                    <td>${index + 1}</td>
                    <td>${empresa.nombre}</td>
                    <td>${empresa.capacidadMaxima}</td>
                    <td>
                         <img src="${staticMapUrl}" 
                         alt="Ubicación de la oficina" 
                         class="img-fluid rounded shadow-sm mb-2" 
                         style="cursor:pointer; width: 120px; height: 90px;"
                         onclick="abrirMapaInteractivo(${empresa.latitud}, ${empresa.longitud})">
                        <br><small class="coordenadasPeq" style="font-size: 10px; color: grey">(${empresa.latitud}, ${empresa.longitud})</small>
                    </td>
                    <td class="acciones">
                    <div class="d-flex"> <!-- Con esta clase los botones no se colocan uno encima del otro, se veía feo-->
                        <button onclick="editarEmpresa(${index})" class="btn btn-outline-success me-2">
                        <i class="bi bi-pen-fill"></i>Editar</button>
                        <button onclick="mostrarConfirmacionEliminacion(${index})" class="btn btn-outline-danger">
                        <i class="bi bi-trash2-fill"></i>Eliminar</button>
                    </div>
                    </td>
                </tr>`;
            tbody.innerHTML += fila;
        });
    }
}

// Pertenece al Modal de Google Maps
function abrirMapaInteractivo(lat, lng) {
    const modal = new bootstrap.Modal(document.getElementById("mapaModal"));
    modal.show();

    // Esperar un poquito para asegurar que el modal se haya renderizado
    setTimeout(() => {
        const ubicacion = {lat: lat, lng: lng};
        const map = new google.maps.Map(document.getElementById("modalMap"), {
            zoom: 15,
            center: ubicacion,
        });

        new google.maps.Marker({
            position: ubicacion,
            map: map,
        });
    }, 300);
}


function mostrarConfirmacionEliminacion(index) {
    empresaAEliminarIndex = index;
    let confirmarEliminacionModal = new bootstrap.Modal(document.getElementById("confirmarEliminacion"));
    confirmarEliminacionModal.show();
}

function confirmarEliminacion() {
    if (empresaAEliminarIndex !== null) {
        eliminarEmpresa(empresaAEliminarIndex);
        // Cerrar el modal después de eliminar
        let modalElement = document.getElementById("confirmarEliminacion");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

function eliminarEmpresa(index) {
    let empresas = JSON.parse(localStorage.getItem("empresas")) || [];
    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    if (index >= 0 && index < empresas.length) {
        const empresa = empresas[index];

        // Verificar si hay empleados asociados a esta empresa
        const empleadosAsociados = empleados.filter(emp => emp.empresa === empresa.nombre);

        if (empleadosAsociados.length > 0) {
            mostrarToast(`No se puede eliminar. Hay ${empleadosAsociados.length} empleado(s) registrados en esta oficina.`, "warning");
            return;
        }

        // Si no hay empleados, continuar con la eliminación
        empresas.splice(index, 1);
        localStorage.setItem("empresas", JSON.stringify(empresas));
        cargarEmpresas();
    } else {
        console.error("Índice no válido:", index);
    }
}


function editarEmpresa(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "frmEmpresa.html";
}

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
