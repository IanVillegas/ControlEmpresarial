let empleadoAEliminarIndex = null;
document.addEventListener("DOMContentLoaded", function () {
    cargarEmpleado();
    localStorage.removeItem("editIndex");
    document.getElementById("confirmarEliminacionBtn").addEventListener("click", confirmarEliminacion);
});

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
    let telefono = document.getElementById("telefono").value;
    let cargo = document.getElementById("cargo").value;
    let rol = document.getElementById("rol").value;
    let estado = document.getElementById("estado").value;
    let empresa = document.getElementById("empresaAsociada").value;

    if (!nombre || !apellido || !id || !correo || !direccion || !nacimiento || !telefono || !cargo || !rol || !estado || !empresa) {
        mostrarToast("Todos los campos son obligatorios", "danger");

        return;
    } else {
        let empleado = { nombre, apellido, id, correo, direccion, nacimiento, telefono, cargo, rol , estado, empresa};
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
/* Para cargar empresas automáticamente en el select de frm */
function cargarEmpresasEnSelect() {
    let empresas = JSON.parse(localStorage.getItem("empresas")) || [];
    let select = document.getElementById("empresaAsociada");

    empresas.forEach(emp => {
        let option = document.createElement("option");
        option.value = emp.nombre;
        option.textContent = emp.nombre;
        select.appendChild(option);
    });
}
cargarEmpresasEnSelect();


function cargarEmpleado() {
    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    let tbody = document.getElementById("empleados-list");
    tbody.innerHTML = "";

    if (empleados.length === 0) {
        let noEmpleadosModal = new bootstrap.Modal(document.getElementById("sinEmpleados"));
        noEmpleadosModal.show();
    } else {
        empleados.forEach((empleado, index) => {
            let fila = `<tr>
                <td>${index+1}</td>
                <td>${empleado.nombre}</td>
                <td>${empleado.apellido}</td>
                <td>${empleado.id}</td>
                <td>${empleado.correo}</td>
                <td>${empleado.direccion}</td>
                <td>${empleado.nacimiento}</td>
                <td>${empleado.telefono}</td>
                <td>${empleado.cargo}</td>
                <td>${empleado.rol}</td>
                <td>${empleado.estado}</td>
                <td>${empleado.empresa}</td>
                <td>
                    <button onclick="editarEmpleado(${index})" class="btn btn-outline-success me-2">
                        <i class="bi bi-pen-fill"></i>
                    </button>
                    <button onclick="mostrarConfirmacionEliminacion(${index})" class="btn btn-outline-danger">
                        <i class="bi bi-trash2-fill"></i>
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += fila;
        });

        // Activar DataTable (con exportación)
        let tabla = $('.table');
        if ($.fn.dataTable.isDataTable(tabla)) {
            tabla.DataTable().destroy();
        }

        tabla.DataTable({
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'collection',
                    text: '<i class="bi bi-file-arrow-down"></i>  Descargar',
                    className: 'btn-descargar',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="bi bi-file-spreadsheet"></i> Excel',
                            className: 'dropdown-item'
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="bi bi-filetype-pdf"></i> PDF',
                            className: 'dropdown-item'
                        }
                    ]
                }
            ],
            pageLength: 3,
            destroy: true,
            language: {
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
                loadingRecords: "Cargando...",
                zeroRecords: "No se encontraron coincidencias",
                infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    previous: "Anterior",
                    next: "Siguiente"
                },

            }
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