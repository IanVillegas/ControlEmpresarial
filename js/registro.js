document.addEventListener("DOMContentLoaded", function () {
    cargarPersonas();
    establecerFechaHoraActual();
    cargarRegistros();
});

// Variable global para eliminación de registro
let registroAEliminarIndex = null;

function cargarPersonas() {
    const personas = JSON.parse(localStorage.getItem("empleados")) || [];
    const select = document.getElementById("persona");

    if (!select) return;

    personas.forEach((persona, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${persona.nombre} ${persona.apellido}`;
        select.appendChild(option);
    });
}

function mostrarOficinaAsociada() {
    const personas = JSON.parse(localStorage.getItem("empleados")) || [];
    const indexSeleccionado = document.getElementById("persona").value;
    const oficina = document.getElementById("oficina");

    if (indexSeleccionado !== "") {
        oficina.value = personas[indexSeleccionado].empresa;
    } else {
        oficina.value = "";
    }
}

function establecerFechaHoraActual() {
    const fechaHoraInput = document.getElementById("fechaHora");
    if (fechaHoraInput) {
        const ahora = new Date();
        const year = ahora.getFullYear();
        const month = String(ahora.getMonth() + 1).padStart(2, '0');
        const day = String(ahora.getDate()).padStart(2, '0');
        const hours = String(ahora.getHours()).padStart(2, '0');
        const minutes = String(ahora.getMinutes()).padStart(2, '0');

        const fechaHoraLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
        fechaHoraInput.value = fechaHoraLocal;
    }
}

function guardarRegistro(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    const personas = JSON.parse(localStorage.getItem("empleados")) || [];
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const empresas = JSON.parse(localStorage.getItem("empresas")) || [];

    const indexPersona = document.getElementById("persona").value;
    const tipo = document.getElementById("tipo").value;
    const fechaHora = document.getElementById("fechaHora").value;

    const persona = personas[indexPersona];
    const oficina = persona.empresa;

    const nuevoRegistro = {
        persona: `${persona.nombre} ${persona.apellido}`,
        oficina: oficina,
        tipo: tipo,
        fechaHora: fechaHora,
    };

    // Validación de flujo
    const registrosPersona = registros.filter(r => r.persona === nuevoRegistro.persona);
    const ultimo = registrosPersona[registrosPersona.length - 1];
    if (ultimo && ultimo.tipo === tipo) {
        //alert(`La persona ya tiene un registro de tipo "${tipo}" como último movimiento.`);
        mostrarToast(`La persona ya tiene un registro de tipo "${tipo}" como último movimiento.`, "danger");
        return;
    }

    // Validación de capacidad máxima
    const oficinaActual = empresas.find(emp => emp.nombre === oficina);
    const personasDentro = registros.filter(r =>
        r.oficina === oficina &&
        r.tipo === "Ingreso" &&
        !registros.some(s =>
            s.persona === r.persona &&
            s.oficina === r.oficina &&
            s.tipo === "Salida" &&
            new Date(s.fechaHora) > new Date(r.fechaHora)
        )
    );

    if (tipo === "Ingreso" && personasDentro.length >= oficinaActual.capacidadMaxima) {
        //alert(`La oficina "${oficina}" ya alcanzó su capacidad máxima (${oficinaActual.capacidadMaxima} personas).`);
        mostrarToast(`La oficina "${oficina}" ya alcanzó su capacidad máxima (${oficinaActual.capacidadMaxima} personas).`, "danger");
        return;
    }

    registros.push(nuevoRegistro);
    localStorage.setItem("registros", JSON.stringify(registros));
    window.location.href = "indexRegistro.html";
}

function exportarPDF() {
    $('#tablaRegistros').DataTable().button('.buttons-pdf').trigger();
}

function exportarExcel() {
    $('#tablaRegistros').DataTable().button('.buttons-excel').trigger();
}


function cargarRegistros() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const tbody = document.getElementById("registros-list");
    if (!tbody) return;

    tbody.innerHTML = "";

    registros.forEach((registro, index) => {
        const fila = `<tr>
      <td>${index + 1}</td>
      <td>${registro.persona}</td>
      <td>${registro.oficina}</td>
      <td>${registro.tipo}</td>
      <td>${registro.fechaHora.replace("T", " ")}</td>
   <td>
  <button onclick="mostrarConfirmacionEliminacionRegistro(${index})" class="btn btn-outline-danger btn-sm">
    <i class="bi bi-trash-fill"></i>
  </button>
</td>

    </tr>`;
        tbody.innerHTML += fila;
    });

    if ($.fn.dataTable.isDataTable('#tablaRegistros')) {
        $('#tablaRegistros').DataTable().destroy();
    }

    $('#tablaRegistros').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                className: 'd-none buttons-pdf'
            },
            {
                extend: 'excelHtml5',
                className: 'd-none buttons-excel'
            }
        ],
        pageLength: 3,
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
            }
        }
    });

}

function mostrarConfirmacionEliminacionRegistro(index) {
    registroAEliminarIndex = index;
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarRegistro"));
    modal.show();
}

function confirmarEliminacionRegistro() {
    if (registroAEliminarIndex === null) return;

    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    const registroActual = registros[registroAEliminarIndex];

    if (registroActual.tipo === "Ingreso") {
        // Buscar y eliminar la salida posterior
        const salidaIndex = registros.findIndex(r =>
            r.persona === registroActual.persona &&
            r.oficina === registroActual.oficina &&
            r.tipo === "Salida" &&
            new Date(r.fechaHora) > new Date(registroActual.fechaHora)
        );
        if (salidaIndex !== -1) {
            registros.splice(salidaIndex, 1);
        }
    }

    registros.splice(registroAEliminarIndex, 1);
    localStorage.setItem("registros", JSON.stringify(registros));
    cargarRegistros();
    mostrarToast("Registro eliminado correctamente", "success");

    // Cerrar modal y resetear índice
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEliminarRegistro"));
    if (modal) modal.hide();
    registroAEliminarIndex = null;
}
