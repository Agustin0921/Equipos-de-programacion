// ==============================
// 🎯 Expansión de cards (Equipo 2)
// ==============================
document.querySelectorAll(".card-azul").forEach(card => {
  card.addEventListener("click", () => {
    const expanded = card.classList.contains("expanded");
    document.querySelectorAll(".card-azul").forEach(c => c.classList.remove("expanded"));
    if (!expanded) card.classList.add("expanded");
  });
});

// ==============================
// 🧾 Gestor de tareas
// ==============================
const input = document.getElementById("nuevaTarea");
const btnAgregar = document.getElementById("agregarTarea");
const lista = document.getElementById("listaTareas");

function agregarTarea() {
  const texto = input.value.trim();
  if (!texto) return;

  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = texto;

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "🗑️";

  span.addEventListener("click", () => li.classList.toggle("completada"));
  btnEliminar.addEventListener("click", () => li.remove());

  li.appendChild(span);
  li.appendChild(btnEliminar);
  lista.appendChild(li);

  input.value = "";
}

btnAgregar.addEventListener("click", agregarTarea);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") agregarTarea();
});
