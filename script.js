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

