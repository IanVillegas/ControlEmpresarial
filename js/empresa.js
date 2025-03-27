let empresaAEliminarIndex = null;
document.addEventListener("DOMContentLoaded", function () {
    cargarEmpresas();
    localStorage.removeItem("editIndex");
    document.getElementById("confirmarEliminacionBtn").addEventListener("click", confirmarEliminacion);
});

function guardarEmpresa(event) {

    event.preventDefault();
    let form = event.target;
    if(!form.checkValidity()){
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let nombre = document.getElementById("nombre").value;
    let ubicacion = document.getElementById("ubicacion").value;
    let cantPersonas = document.getElementById("cantPersonas").value;

    if (!nombre || !ubicacion || !cantPersonas) {
        alert("Todos los campos son obligatorios");
        return;
    } else {
        let empresa = {nombre, ubicacion, cantPersonas};
        let empresas = JSON.parse(localStorage.getItem("empresas")) || [];

        let index = localStorage.getItem("editIndex");
        if (index !== null) {
            empresas[index] = empresa;
        } else {
            empresas.push(empresa);
        }
        localStorage.setItem("empresas", JSON.stringify(empresas));
        window.location.href = "indexEmpresa.html";
    }
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
            let fila = `<tr>
                    <td>${empresa.nombre}</td>
                    <td>${empresa.ubicacion}</td>
                    <td>${empresa.cantPersonas}</td>
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

    if (index >= 0 && index < empresas.length) {
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
