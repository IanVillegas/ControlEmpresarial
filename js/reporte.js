document.addEventListener("DOMContentLoaded", function () {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];

    generarGraficoIngresos(registros);
    generarGraficoOficinas(registros);
    listarPersonasDentro(registros);
});

// Personas con más ingresos
function generarGraficoIngresos(registros) {
    const conteo = {};

    registros.forEach(reg => {
        if (reg.tipo === "Ingreso") {
            conteo[reg.persona] = (conteo[reg.persona] || 0) + 1;
        }
    });

    const personas = Object.keys(conteo);
    const ingresos = Object.values(conteo);

    new Chart(document.getElementById("graficoIngresos"), {
        type: "bar",
        data: {
            labels: personas,
            datasets: [{
                label: "Cantidad de Ingresos",
                data: ingresos,
                backgroundColor: "rgba(13, 110, 253, 0.7)",
                borderColor: "rgba(13, 110, 253, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Ingresos' }
                },
                x: {
                    title: { display: true, text: 'Personas' }
                }
            }
        }
    });
}

// Oficinas más utilizadas
function generarGraficoOficinas(registros) {
    const conteo = {};

    registros.forEach(reg => {
        if (reg.tipo === "Ingreso") {
            conteo[reg.oficina] = (conteo[reg.oficina] || 0) + 1;
        }
    });

    const oficinas = Object.keys(conteo);
    const ingresos = Object.values(conteo);

    new Chart(document.getElementById("graficoOficinas"), {
        type: "doughnut",
        data: {
            labels: oficinas,
            datasets: [{
                label: "Uso de oficinas",
                data: ingresos,
                backgroundColor: oficinas.map(() => generarColorAleatorio())
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' },
                tooltip: { callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.parsed} ingresos`
                    }}
            }
        }
    });
}

function generarColorAleatorio() {
    const r = Math.floor(Math.random() * 155) + 100;
    const g = Math.floor(Math.random() * 155) + 100;
    const b = Math.floor(Math.random() * 155) + 100;
    return `rgba(${r},${g},${b},0.8)`;
}

// Personas actualmente dentro (ingreso sin salida posterior)
function listarPersonasDentro(registros) {
    const personasDentro = [];

    const ingresos = registros.filter(r => r.tipo === "Ingreso");

    ingresos.forEach(ingreso => {
        const salidaPosterior = registros.find(r =>
            r.persona === ingreso.persona &&
            r.oficina === ingreso.oficina &&
            r.tipo === "Salida" &&
            new Date(r.fechaHora) > new Date(ingreso.fechaHora)
        );

        if (!salidaPosterior) {
            personasDentro.push(ingreso);
        }
    });

    const lista = document.getElementById("listaPersonasDentro");
    if (personasDentro.length === 0) {
        lista.innerHTML = `<li class="list-group-item">No hay personas actualmente dentro.</li>`;
        return;
    }

    personasDentro.forEach(p => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${p.persona} en ${p.oficina} desde ${p.fechaHora.replace("T", " ")}`;
        lista.appendChild(li);
    });
}
