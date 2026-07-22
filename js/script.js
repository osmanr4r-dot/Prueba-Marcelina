document.addEventListener('DOMContentLoaded', () => {

  // Año actual en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Carruseles de productos y experiencias
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  function initCarousel(carousel) {
    const images = Array.from(carousel.querySelectorAll('.carousel-track img'));
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let current = images.findIndex(img => img.classList.contains('active'));
    if (current < 0) current = 0;
    let timer = null;

    images.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      images.forEach((img, i) => img.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = (index + images.length) % images.length;
      render();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

    function startAutoplay() {
      if (images.length > 1) timer = setInterval(next, 4500);
    }
    function resetAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  // Header: sombra al hacer scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.1)'
      : '0 2px 16px rgba(0,0,0,0.06)';
  });

  // Formulario de contacto (envío mediante FormSubmit sin recargar la página)
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      note.style.color = 'var(--red)';
      note.textContent = 'Enviando...';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          note.textContent = '¡Gracias! Tu mensaje se ha enviado correctamente.';
          form.reset();
        } else {
          throw new Error('Error en el envío');
        }
      } catch (err) {
        note.textContent = 'No se pudo enviar. Escríbenos por WhatsApp o al correo indicado.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
