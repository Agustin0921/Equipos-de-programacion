const btn = document.getElementById('menuBtn'); // selecciona el botón
const menu = document.getElementById('menu');   // selecciona la lista de enlaces

if (btn && menu) {
    btn.addEventListener('click', () => {
        const shown = menu.classList.toggle('show'); // agrega o quita la clase "show"
        btn.setAttribute('aria-expanded', String(shown)); // accesibilidad
    });

    // 🔹 Nuevo: cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('show'); // cierra el menú
            btn.setAttribute('aria-expanded', 'false'); // actualiza accesibilidad
        });
    });
}

// Seleccionamos el header
const header = document.querySelector('.header');

// Escuchamos el scroll de la ventana
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');  // agrega la clase si bajó más de 20px
    } else {
        header.classList.remove('scrolled'); // quita la clase si vuelve arriba
    }
});

// ============================
// 🔽 Animaciones de section-dos
// ============================

// ============================
// 🔽 Animaciones de secciones
// ============================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
        if (entry.target.classList.contains('left')) {
            entry.target.classList.add('animate-left');
        }
        if (entry.target.classList.contains('right')) {
            entry.target.classList.add('animate-right');
        }
        if (entry.target.classList.contains('section-title') || entry.target.classList.contains('section-text')) {
            entry.target.classList.add('animate-up');
        }
        if (entry.target.classList.contains('service-card')) {
            entry.target.classList.add('animate-zoom');
        }
        if (entry.target.classList.contains('title-services') || entry.target.classList.contains('text-services')) {
            entry.target.classList.add('animate-up');
        }
        if (entry.target.classList.contains('service-card')) {
            const index = [...document.querySelectorAll('.service-card')].indexOf(entry.target);
            if (index % 2 === 0) {
                entry.target.classList.add('animate-left');
            } else {
                entry.target.classList.add('animate-right');
            }
        }
    }
  });
}, { 
  threshold: 0.1, 
   // 🔹 se activa 100px ANTES de entrar en pantalla
});

// Observar elementos de About + Services
document.querySelectorAll(
  '.section-dos .card.left, .section-dos .card.right, .section-dos .section-title, .section-dos .section-text,  .services .title-services, .services .text-services, .services .service-card'
).forEach(el => observer.observe(el));

// ============================
// 🔽 Formulario de contacto
// ============================

const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formResponse.textContent = "✅ ¡Gracias por contactarte! Te responderemos pronto.";
        contactForm.reset();
    });
}

// Ejemplo de actualización simulada
const metrics = {
  activeProjects: 5,
  completedTasks: 34,
  openBugs: 8
};

Object.keys(metrics).forEach(key => {
  const el = document.getElementById(key);
  if (el) el.textContent = metrics[key];
});


// ============================
// LOGIN, REGISTRO Y RECUPERACIÓN (BACKEND CON FLASK)
// ============================

const API_URL = "http://127.0.0.1:5000"; // tu backend local en Python

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const forgotSection = document.getElementById("forgotSection");
const resetSection = document.getElementById("resetSection");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotForm = document.getElementById("forgotForm");
const resetForm = document.getElementById("resetForm");

const loginError = document.getElementById("loginError");
const registerMessage = document.getElementById("registerMessage");
const forgotMessage = document.getElementById("forgotMessage");
const resetMessage = document.getElementById("resetMessage");

const userName = document.getElementById("userName");
const dashboardContent = document.getElementById("dashboardContent");
const logoutBtn = document.getElementById("logoutBtn");

// 🔹 Mostrar/Ocultar secciones
document.getElementById("showRegister")?.addEventListener("click", e => {
  e.preventDefault();
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
});
document.getElementById("backToLogin")?.addEventListener("click", e => {
  e.preventDefault();
  registerSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// ============================
// 🔐 LOGIN
// ============================
loginForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    // ✅ LOGIN EXITOSO
    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    userName.textContent = data.user;

    // 🧩 GUARDAR SESIÓN Y CARGAR PROYECTOS
    localStorage.setItem("user", username);
    loadProjects(); // <-- llama a la función del CRUD para listar proyectos

    // opcional: mantiene las tarjetas básicas
  } else {
    loginError.textContent = "❌ " + data.error;
  }
});


// ============================
// 🧾 REGISTRO
// ============================
registerForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("newUsername").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    registerMessage.textContent = "✅ Usuario registrado correctamente.";
    setTimeout(() => {
      registerSection.classList.add("hidden");
      loginSection.classList.remove("hidden");
    }, 1500);
  } else {
    registerMessage.textContent = "❌ " + data.error;
  }
});

// ============================
// 📧 OLVIDÉ CONTRASEÑA
// ============================
forgotForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value;

  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (res.ok) {
    forgotMessage.textContent = "📩 Código enviado al correo.";
    setTimeout(() => {
      forgotSection.classList.add("hidden");
      resetSection.classList.remove("hidden");
    }, 1500);
  } else {
    forgotMessage.textContent = "❌ " + data.error;
  }
});

// ============================
// 🔁 RESTABLECER CONTRASEÑA
// ============================
resetForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value;
  const code = document.getElementById("resetCode").value;
  const new_password = document.getElementById("newPassword").value;

  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, new_password }),
  });

  const data = await res.json();

  if (res.ok) {
    resetMessage.textContent = "✅ Contraseña actualizada correctamente.";
    setTimeout(() => {
      resetSection.classList.add("hidden");
      loginSection.classList.remove("hidden");
    }, 1500);
  } else {
    resetMessage.textContent = "❌ " + data.error;
  }
});

logoutBtn?.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  loginSection.classList.remove("hidden");
  loginForm.reset();
});

function renderUserDashboard() {
  dashboardContent.innerHTML = `
    <div class="dashboard-cards">
      <div class="dash-card"><h3>Proyectos</h3><p>3</p></div>
      <div class="dash-card"><h3>Tareas</h3><p>15</p></div>
      <div class="dash-card"><h3>Bugs</h3><p>1</p></div>
    </div>
    <div class="progress-table">
      <p>Progreso total: 70%</p>
      <progress value="70" max="100"></progress>
    </div>
  `;
}

// ============================
// 🧱 CRUD DE PROYECTOS
// ============================

const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");

// 📋 Cargar proyectos del usuario
async function loadProjects() {
  const user = localStorage.getItem("user");
  if (!user) return;

  const res = await fetch(`${API_URL}/projects?username=${user}`);
  const data = await res.json();

  projectsList.innerHTML = data.map(p => `
  <div class="project-card" data-id="${p.id}">
      <h4>${p.title}</h4>
      <p>${p.description}</p>
      <p><b>Estado:</b> ${p.status}</p>
      <progress value="${p.progress}" max="100"></progress> ${p.progress}%
      <div class="actions">
        <button class="edit-btn" onclick="editProject(${p.id}, '${p.title}', '${p.description}', '${p.status}', ${p.progress})">✏️ Editar</button>
        <button class="delete-btn" onclick="deleteProject(${p.id})">🗑️ Eliminar</button>
      </div>
  </div>
`).join("");
}

// 🧩 Agregar nuevo proyecto
projectForm?.addEventListener("submit", async e => {
  e.preventDefault();

  const user = localStorage.getItem("user");
  const title = document.getElementById("projTitle").value;
  const description = document.getElementById("projDesc").value;
  const status = document.getElementById("projStatus").value;
  const progress = document.getElementById("projProgress").value;

  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, title, description, status, progress }),
  });

  if (res.ok) {
    projectForm.reset();
    loadProjects();
    showToast("✅ Proyecto agregado correctamente");
  } else {
    showToast("❌ Error al agregar el proyecto", "error");
  }
});

// ✏️ Editar proyecto existente
async function editProject(id, title, desc, status, progress) {
  const card = document.querySelector(`.project-card[data-id="${id}"]`);
  card.classList.add("editing"); // 💚 aplica la clase visual

  card.innerHTML = `
    <input type="text" id="editTitle${id}" value="${title}">
    <input type="text" id="editDesc${id}" value="${desc}">
    <select id="editStatus${id}">
      <option ${status === "Pendiente" ? "selected" : ""}>Pendiente</option>
      <option ${status === "En progreso" ? "selected" : ""}>En progreso</option>
      <option ${status === "Completado" ? "selected" : ""}>Completado</option>
    </select>
    <input type="number" id="editProg${id}" value="${progress}" min="0" max="100">
    <div class="edit-actions">
      <button onclick="saveEdit(${id})">💾 Guardar</button>
      <button onclick="cancelEdit()">❌ Cancelar</button>
    </div>
  `;
}

function cancelEdit() {
  const editingCard = document.querySelector(".project-card.editing");
  if (editingCard) editingCard.classList.remove("editing");
  loadProjects();
}


async function saveEdit(id) {
  const newTitle = document.getElementById(`editTitle${id}`).value;
  const newDesc = document.getElementById(`editDesc${id}`).value;
  const newStatus = document.getElementById(`editStatus${id}`).value;
  const newProg = document.getElementById(`editProg${id}`).value;

  await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, description: newDesc, status: newStatus, progress: newProg }),
  });
  loadProjects();
}

function cancelEdit() {
  loadProjects();
}


// 🗑️ Eliminar proyecto
async function deleteProject(id) {
  if (confirm("¿Eliminar este proyecto?")) {
    await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
    loadProjects();
    loadStats();
    showToast("🗑️ Proyecto eliminado");
  }
}

// 🚀 Autologin y carga automática de proyectos
window.addEventListener("load", () => {
  const user = localStorage.getItem("user");
  if (user) {
    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    userName.textContent = user;
    loadProjects();
  }
});


async function loadStats() {
  const user = localStorage.getItem("user");
  const res = await fetch(`${API_URL}/projects?username=${user}`);
  const data = await res.json();

  const completed = data.filter(p => p.status === "Completado").length;
  const progress = data.filter(p => p.status === "En progreso").length;
  const pending = data.filter(p => p.status === "Pendiente").length;

  const ctx = document.getElementById('statsChart');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completados', 'En progreso', 'Pendientes'],
      datasets: [{
        data: [completed, progress, pending],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }]
    }
  });
}

document.getElementById("profileForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const username = localStorage.getItem("user");
  const name = document.getElementById("profileName").value;
  const email = document.getElementById("profileEmail").value;

  const res = await fetch(`${API_URL}/update-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, email }),
  });

  const data = await res.json();
  document.getElementById("profileMessage").textContent = data.message || data.error;
});

const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");

async function loadChat() {
  const res = await fetch(`${API_URL}/messages`);
  const data = await res.json();
  chatBox.innerHTML = data.map(m => `<p><b>${m.username}:</b> ${m.content}</p>`).join("");
}

// ✅ Nuevo método: manejar el envío desde el formulario
chatForm?.addEventListener("submit", async e => {
  e.preventDefault(); // Evita que la página se recargue

  const user = localStorage.getItem("user");
  const content = document.getElementById("chatInput").value.trim();
  if (!content) return;

  await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, content }),
  });

  document.getElementById("chatInput").value = "";
  loadChat();
});



setInterval(loadChat, 5000); // Actualiza cada 5 segundos

function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
  });
});

// ============================
// 🎛️ Cambiar de pestaña en el dashboard
// ============================
document.querySelectorAll(".dash-tab").forEach(btn => {
    btn.addEventListener("click", () => {
        // desactivar todos los botones
        document.querySelectorAll(".dash-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // ocultar todas las secciones
        document.querySelectorAll(".dash-content").forEach(sec => sec.classList.add("hidden"));

        // mostrar la seleccionada
        const tab = btn.dataset.tab;
        document.getElementById(tab).classList.remove("hidden");
    });
});

// ============================
// 🧭 Recordar última pestaña abierta en el dashboard
// ============================

document.querySelectorAll(".dash-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    // Guardar pestaña activa
    const tab = btn.dataset.tab;
    localStorage.setItem("activeTab", tab);
  });
});

// Cuando el usuario vuelve al dashboard, mostrar la última pestaña
window.addEventListener("load", () => {
  const savedTab = localStorage.getItem("activeTab");
  if (savedTab && document.getElementById(savedTab)) {
    // Activar visualmente el botón
    document.querySelectorAll(".dash-tab").forEach(b => b.classList.remove("active"));
    document.querySelector(`.dash-tab[data-tab="${savedTab}"]`)?.classList.add("active");

    // Mostrar la sección correspondiente
    document.querySelectorAll(".dash-content").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(savedTab).classList.remove("hidden");
  }
});

// ============================
// 🎛️ Navegación lateral del perfil
// ============================
document.querySelectorAll(".profile-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".profile-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".profile-tab-content").forEach(sec => sec.classList.add("hidden"));

    const tab = btn.dataset.tab;
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
  });
});

// ============================
// 🧾 HISTORIAL DE ACTIVIDAD
// ============================
function addActivity(message) {
  const activities = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const entry = { message, time: new Date().toLocaleString() };
  activities.unshift(entry);
  localStorage.setItem("activityLog", JSON.stringify(activities));
  renderActivityList();
}

function renderActivityList() {
  const list = document.getElementById("activityList");
  if (!list) return;
  const activities = JSON.parse(localStorage.getItem("activityLog") || "[]");
  list.innerHTML = activities.length
    ? activities.map(a => `<li class="activity-item">${a.message}<br><small>${a.time}</small></li>`).join("")
    : "<li class='activity-item'>Sin actividad reciente</li>";
}
window.addEventListener("load", renderActivityList);

// Ejemplos automáticos
document.getElementById("profileForm")?.addEventListener("submit", () => addActivity("👤 Perfil actualizado"));
document.getElementById("projectForm")?.addEventListener("submit", () => addActivity("📁 Proyecto agregado"));
document.getElementById("chatForm")?.addEventListener("submit", () => addActivity("💬 Mensaje enviado"));

// ============================
// 🎨 Preferencias de tema
// ============================
document.getElementById("themeLight")?.addEventListener("click", () => {
  document.body.style.backgroundColor = "#f0f0f0";
  document.body.style.color = "#222";
  addActivity("🌞 Modo claro activado");
});
document.getElementById("themeDark")?.addEventListener("click", () => {
  document.body.style.backgroundColor = "#121212";
  document.body.style.color = "#ddd";
  addActivity("🌙 Modo oscuro activado");
});
document.getElementById("themeGreen")?.addEventListener("click", () => {
  document.body.style.backgroundColor = "#33743baf";
  document.body.style.color = "#fff";
  addActivity("🌿 Modo verde activado");
});

// ============================
// 📊 ESTADÍSTICAS DEL USUARIO
// ============================

// Simulamos datos base (luego podrías conectarlo a tu backend)
function getStats(period) {
  const baseData = {
    week: [3, 5, 2, 6, 4, 7, 5],
    month: [12, 9, 14, 7, 8, 11, 10],
    year: [60, 72, 45, 90, 110, 80, 65]
  };
  return baseData[period] || baseData.week;
}

let statsChart, progressChart;

function renderStatsCharts(period = "week") {
  const ctx = document.getElementById("statsChart").getContext("2d");
  const ctx2 = document.getElementById("progressChart").getContext("2d");

  const data = getStats(period);

  if (statsChart) statsChart.destroy();
  if (progressChart) progressChart.destroy();

  statsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [{
        label: "Proyectos completados",
        data,
        backgroundColor: "rgba(0,243,182,0.6)",
        borderColor: "rgb(0,243,182)",
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { labels: { color: "#fff" } } }
    }
  });

  progressChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [{
        label: "Progreso diario (%)",
        data: data.map(v => Math.min(100, v * 10)),
        borderColor: "rgb(0,243,182)",
        backgroundColor: "rgba(0,243,182,0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { labels: { color: "#fff" } } }
    }
  });
}

// Resumen rápido
function updateStatsSummary() {
  document.getElementById("statTotalProjects").textContent = localStorage.getItem("totalProjects") || 12;
  document.getElementById("statCompleted").textContent = localStorage.getItem("completedProjects") || 7;
  document.getElementById("statMessages").textContent = localStorage.getItem("messagesSent") || 25;
  document.getElementById("statLastLogin").textContent = localStorage.getItem("lastLogin") || new Date().toLocaleDateString();
}

// Evento del selector
document.getElementById("updateStats")?.addEventListener("click", () => {
  const period = document.getElementById("statsPeriod").value;
  renderStatsCharts(period);
  addActivity(`📊 Estadísticas actualizadas (${period})`);
});

// Cargar al iniciar
window.addEventListener("load", () => {
  updateStatsSummary();
  renderStatsCharts();
});

// ============================
// 📸 Vista previa de la foto de perfil
// ============================
document.getElementById("profileImage")?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById("previewImage");
    preview.src = reader.result;

    // Guardar la imagen en localStorage (opcional)
    localStorage.setItem("profileImage", reader.result);
  };
  reader.readAsDataURL(file);
});

// Cargar imagen guardada (si existe)
window.addEventListener("load", () => {
  const savedImg = localStorage.getItem("profileImage");
  if (savedImg) {
    const preview = document.getElementById("previewImage");
    if (preview) preview.src = savedImg;
  }
});

// ============================
// 🎬 Expansión interactiva de servicios
// ============================

const serviceData = {
  web: {
    desc: "Diseñamos sitios web modernos, rápidos y responsivos, adaptados a todos los dispositivos y optimizados para SEO y rendimiento.",
  },
  backend: {
    desc: "Desarrollamos estructuras backend robustas con Node.js, APIs REST y bases de datos que garantizan seguridad y escalabilidad.",
  },
  soporte: {
    desc: "Ofrecemos soporte técnico personalizado, mantenimiento constante y resolución de problemas en proyectos web y sistemas.",
  },
};

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    // Si ya está expandida, no hace nada
    if (card.classList.contains("expanded")) return;

    // Cerrar cualquier otra expandida
    document.querySelectorAll(".service-card.expanded").forEach(c => {
      c.classList.remove("expanded");
      c.querySelector(".service-description")?.remove();
      c.querySelector(".close-btn")?.remove();
    });

    // Crear el texto extendido y el botón de cierre
    const key = card.dataset.service;
    const desc = serviceData[key]?.desc || "Descripción no disponible.";
    const textDiv = document.createElement("div");
    textDiv.classList.add("service-description");
    textDiv.innerHTML = `<p>${desc}</p>`;

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = "✕";

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      card.classList.remove("expanded");
      textDiv.remove();
      closeBtn.remove();
    });
    

    // Insertar y expandir
    card.appendChild(closeBtn);
    card.appendChild(textDiv);
    card.classList.add("expanded");
  });
});

// ==============================
// 💰 COTIZADOR INTERACTIVO
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const plan = document.getElementById("plan");
  const extras = document.querySelectorAll(".extras input");
  const total = document.getElementById("total");
  const cards = document.querySelectorAll(".card");

  function calcularTotal() {
    let suma = parseInt(plan.value) || 0;
    extras.forEach(chk => {
      if (chk.checked) suma += parseInt(chk.value);
    });
    total.textContent = "$" + suma;
    total.classList.add("animar-total");
    setTimeout(() => total.classList.remove("animar-total"), 600);
  }

  plan.addEventListener("change", calcularTotal);
  extras.forEach(chk => chk.addEventListener("change", calcularTotal));

  // ==============================
  // 🧩 EXPANDIR TARJETAS
  // ==============================
  cards.forEach(card => {
    card.addEventListener("click", e => {
      if (!card.classList.contains("expanded")) {
        document.querySelectorAll(".card").forEach(c => c.classList.remove("expanded"));
        card.classList.add("expanded");
      }
    });

    const btn = card.querySelector(".btn-elegir");
    btn.addEventListener("click", e => {
      e.stopPropagation();
      plan.value = card.dataset.price;
      calcularTotal();
      document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });

  // ==============================
  // 📩 MODAL DE COTIZACIÓN
  // ==============================
  const modal = document.getElementById("modalCotizacion");
  const btnCotizar = document.getElementById("btnCotizar");
  const closeModal = document.querySelector(".close-modal");
  const cerrarModal = document.getElementById("cerrarModal");

  btnCotizar.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => modal.style.display = "none");
  cerrarModal.addEventListener("click", () => modal.style.display = "none");

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// ==============================
// 🧩 EXPANDIR TARJETAS CON EFECTO ACORDEÓN
// ==============================
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  const btn = card.querySelector(".btn-elegir");

  // Expandir card al hacer click
  card.addEventListener("click", e => {
    // Evita conflicto con el botón interno
    if (e.target.classList.contains("btn-elegir")) return;

    const isExpanded = card.classList.contains("expanded");
    document.querySelectorAll(".card").forEach(c => c.classList.remove("expanded"));

    if (!isExpanded) {
      card.classList.add("expanded");

      // efecto acordeón: ajusta suavemente la altura
      const contentHeight = card.scrollHeight;
      card.style.maxHeight = contentHeight + "px";
    } else {
      card.style.maxHeight = "200px";
    }
  });

  // Botón para seleccionar plan
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const plan = document.getElementById("plan");
    plan.value = card.dataset.price;
    document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    calcularTotal();
  });
});
