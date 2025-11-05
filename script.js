/* Datos de ejemplo: códigos de ética y sus principios.
   Edite, agregue o elimine elementos según necesite. */
const CODES = [
{
    id: "acm",
    title: "ACM — Código de Ética y Conducta Profesional",
    source: "Association for Computing Machinery",
    summary: "Responsabilidad profesional, respeto por la privacidad y compromiso con el bien público.",
    principles: [
    { title: "Actuar en el interés público", text: "Anteponer el bienestar del público y de los usuarios en las decisiones profesionales." },
    { title: "Honestidad e integridad", text: "Ser honesto sobre capacidades, limitaciones y resultados." },
    { title: "Privacidad y confidencialidad", text: "Proteger la información personal y respetar la privacidad." },
    { title: "Competencia", text: "Mantener y mejorar la competencia profesional mediante educación continua." }
    ]
},
{
    id: "ieee",
    title: "IEEE — Código de Ética",
    source: "Institute of Electrical and Electronics Engineers",
    summary: "Actuar con honestidad y responsabilidad en el ejercicio profesional.",
    principles: [
    { title: "Seguridad, salud y bienestar", text: "Considerar la seguridad y el bienestar de la sociedad en las labores técnicas." },
    { title: "Honestidad en reportes", text: "Informar con honestidad resultados y riesgos." },
    { title: "No discriminación", text: "Evitar prácticas discriminatorias y promover la inclusión." },
    { title: "Respeto por la propiedad intelectual", text: "Respetar derechos de autor y licencias." }
    ]
},
{
    id: "institucional",
    title: "Código institucional / local",
    source: "Norma institucional",
    summary: "Principios adaptados a la institución o país; puede incluir confidencialidad y uso responsable de recursos.",
    principles: [
    { title: "Uso responsable de recursos", text: "Utilizar recursos tecnológicos conforme a las políticas de la organización." },
    { title: "Confidencialidad institucional", text: "Proteger la información sensible de la organización y de clientes." },
    { title: "Transparencia", text: "Actuar con claridad ante conflictos de interés." }
    ]
}
];

/* Elementos DOM */
const selectEl = document.getElementById("code-select");
const detailsEl = document.getElementById("code-details");
const principlesEl = document.getElementById("principles");
const searchInput = document.getElementById("search-input");
const addCompareBtn = document.getElementById("add-compare");
const clearCompareBtn = document.getElementById("clear-compare");
const compareArea = document.getElementById("compare-area");

let compareSet = [];

/* Inicialización: llenar select */
function init(){
CODES.forEach(code => {
    const opt = document.createElement("option");
    opt.value = code.id;
    opt.textContent = code.title;
    selectEl.appendChild(opt);
});
  // seleccionar el primero y renderizar
selectEl.value = CODES[0].id;
renderSelected();
}

/* Obtener código por id */
function getCodeById(id){
return CODES.find(c => c.id === id);
}

/* Renderizar detalles del código seleccionado */
function renderSelected(){
const code = getCodeById(selectEl.value);
detailsEl.innerHTML = `
    <h3>${code.title}</h3>
    <p class="muted"><strong>Fuente:</strong> ${code.source}</p>
    <p class="muted"><strong>Resumen:</strong> ${code.summary}</p>
    <p class="muted"><small>Principios: ${code.principles.length}</small></p>
`;
renderPrinciples(code.principles);
}

/* Renderizar principios (con búsqueda aplicada) */
function renderPrinciples(principles){
const query = searchInput.value.trim().toLowerCase();
principlesEl.innerHTML = "";
const filtered = principles.filter(p => {
    if(!query) return true;
    return (p.title + " " + p.text).toLowerCase().includes(query);
});

if(filtered.length === 0){
    principlesEl.innerHTML = `<p class="muted">No se encontraron principios que coincidan.</p>`;
    return;
}

filtered.forEach((p, idx) => {
    const card = document.createElement("article");
    card.className = "principle card";
    card.innerHTML = `
    <h3>${p.title}</h3>
    <p class="muted short">${truncate(p.text, 140)}</p>
    <button class="expand" data-idx="${idx}">Leer más</button>
    `;
    // Expansión al hacer clic
    const btn = card.querySelector(".expand");
    btn.addEventListener("click", () => {
    const expanded = card.querySelector(".full");
    if(expanded){
        expanded.remove();
        btn.textContent = "Leer más";
    } else {
        const full = document.createElement("p");
        full.className = "full muted";
        full.textContent = p.text;
        card.appendChild(full);
        btn.textContent = "Cerrar";
    }
    });

    principlesEl.appendChild(card);
});
}

/* Truncar texto */
function truncate(str, n){
if(str.length <= n) return str;
return str.slice(0, n-1) + "…";
}

/* Comparación: agregar el código actual */
function addToCompare(){
const id = selectEl.value;
if(compareSet.includes(id)) {
    alert("Ese código ya está en el panel de comparación.");
    return;
}
compareSet.push(id);
renderCompare();
}

/* Limpiar comparación */
function clearCompare(){
compareSet = [];
renderCompare();
}

/* Renderizar panel de comparación */
function renderCompare(){
compareArea.innerHTML = "";
if(compareSet.length === 0){
    compareArea.innerHTML = `<p class="muted">No hay códigos en comparación.</p>`;
    return;
}

  // Crear columnas por cada código
const row = document.createElement("div");
row.style.display = "flex";
row.style.gap = "12px";
row.style.flexWrap = "wrap";

compareSet.forEach(id => {
    const c = getCodeById(id);
    const card = document.createElement("div");
    card.className = "compare-card";
    card.style.minWidth = "220px";
    card.innerHTML = `
    <h3 style="margin-bottom:6px; font-size:0.95rem">${c.title}</h3>
    <p class="muted"><strong>Fuente:</strong> ${c.source}</p>
    <p class="muted"><strong>Principios:</strong> ${c.principles.length}</p>
    <ul style="margin-top:8px; padding-left:18px;">
        ${c.principles.map(p => `<li title="${escapeHtml(p.text)}">${p.title}</li>`).join("")}
    </ul>
    <button class="remove" data-id="${id}" style="margin-top:8px;">Eliminar</button>
    `;
    card.querySelector(".remove").addEventListener("click", e => {
    const rid = e.currentTarget.dataset.id;
    compareSet = compareSet.filter(x => x !== rid);
    renderCompare();
    });
    row.appendChild(card);
});

compareArea.appendChild(row);
}

/* Escape HTML (para usar en title) */
function escapeHtml(s){
return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* Eventos */
selectEl.addEventListener("change", () => {
renderSelected();
});
searchInput.addEventListener("input", () => {
  // re-render con filtro para el código seleccionado
const code = getCodeById(selectEl.value);
renderPrinciples(code.principles);
});
addCompareBtn.addEventListener("click", addToCompare);
clearCompareBtn.addEventListener("click", clearCompare);

/* Inicializar */
init();
