let empleadoAEliminarIndex = null;
document.addEventListener("DOMContentLoaded", function () {
    cargarEmpleado();
    localStorage.removeItem("editIndex");
    document.getElementById("confirmarEliminacionBtn").addEventListener("click", confirmarEliminacion);
});

function cargarEmpleado(){
    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    let tbody = document.getElementById("empleados-list");
    tbody.innerHTML = "";
    if (empleados.length === 0) { // Verificar si no hay empleados
        // Generar un modal (de bootstrap) para mostrar el mensaje de que no hay empleados
        let noEmpleadosModal = new bootstrap.Modal(document.getElementById("sinEmpleados"));
        noEmpleadosModal.show();
    } else {
        empleados.forEach((empleado, index) => {
            let fila = `<tr>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.apellido}</td>
                    <td>${empleado.id}</td>
                    <td>${empleado.correo}</td>
                    <td>${empleado.direccion}</td>
                    <td>${empleado.nacimiento}</td>
                    <td>
                        <button onclick="editarEmpleado(${index})" class="btn btn-outline-success me-2">
                        <i class="bi bi-pen-fill"></i>Editar</button>
                        <button onclick="mostrarConfirmacionEliminacion(${index})" class="btn btn-outline-danger">
                        <i class="bi bi-trash2-fill"></i>Eliminar</button>
                    </td>
                </tr>`;
            tbody.innerHTML += fila;
        });
    }
}

function mostrarConfirmacionEliminacion(index) {
    empleadoAEliminarIndex = index;
    let confirmarEliminacionModal = new bootstrap.Modal(document.getElementById("confirmarEliminacion"));
    confirmarEliminacionModal.show();
}

function confirmarEliminacion() {
    if (empleadoAEliminarIndex !== null) {
        eliminarEmpleado(empleadoAEliminarIndex);
        // Cerrar el modal después de eliminar
        let modalElement = document.getElementById("confirmarEliminacion");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

function eliminarEmpleado(index) {
    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    if (index >= 0 && index < empleados.length) {
        empleados.splice(index, 1);
        localStorage.setItem("empleados", JSON.stringify(empleados));
        cargarEmpleado();
    } else {
        console.error("Índice no válido:", index);
    }
}
function editarEmpleado(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "frmEmpleado.html";
}

function guardarEmpleado(event) {
    event.preventDefault(); // Evitar la recarga del formulario
    let form = event.target;
    if(!form.checkValidity()){
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let id = document.getElementById("id").value;
    let correo = document.getElementById("correo").value;
    let direccion = document.getElementById("direccion").value;
    let nacimiento = document.getElementById("nacimiento").value;

    if (!nombre || !apellido || !id || !correo || !direccion || !nacimiento) {
        alert("Todos los campos son obligatorios");
        return;
    } else {
        let empleado = { nombre, apellido, id, correo, direccion, nacimiento };
        let empleados = JSON.parse(localStorage.getItem("empleados")) || [];

        let index = localStorage.getItem("editIndex");
        if (index !== null) {
            empleados[index] = empleado;
        } else {
            empleados.push(empleado);
        }
        localStorage.setItem("empleados", JSON.stringify(empleados));
        window.location.href = "indexEmpleado.html";
    }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
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