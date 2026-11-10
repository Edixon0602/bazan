/**
 * Portafolio María Bazán - Reproducción de Video Integrada en Dispositivos
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // Navbar Scroll Effect
  // ------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ------------------------------------------------------------------------
  // Reproductor Integrado en Teléfonos y Tablets (Sin Modales)
  // ------------------------------------------------------------------------
  const videoWrappers = document.querySelectorAll('.video-screen-wrapper');

  videoWrappers.forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const playBtn = wrapper.querySelector('.screen-play-btn');
    const soundBtn = wrapper.querySelector('.screen-sound-btn');
    const progressFill = wrapper.querySelector('.screen-progress-fill');

    if (!video) return;

    // Asegurar que el video inicie sin silenciar o muted según preferencia
    video.muted = false;

    // Función para pausar cualquier otro video activo
    function pauseOtherVideos() {
      videoWrappers.forEach(otherWrapper => {
        if (otherWrapper !== wrapper) {
          const otherVideo = otherWrapper.querySelector('video');
          if (otherVideo && !otherVideo.paused) {
            otherVideo.pause();
            otherWrapper.classList.remove('is-playing');
          }
        }
      });
    }

    // Alternar Reproducción / Pausa
    function togglePlay(e) {
      // Si el clic fue en el botón de audio, no pausar el video
      if (e && e.target.closest('.screen-sound-btn')) return;

      if (video.paused) {
        pauseOtherVideos();
        // Intentar reproducir con audio; si el navegador bloquea autoplay con sonido, reintentar silenciado
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            wrapper.classList.add('is-playing');
          }).catch(() => {
            video.muted = true;
            updateSoundIcon(true);
            video.play();
            wrapper.classList.add('is-playing');
          });
        }
      } else {
        video.pause();
        wrapper.classList.remove('is-playing');
      }
    }

    // Actualizar icono de audio
    function updateSoundIcon(isMuted) {
      if (!soundBtn) return;
      const iconMuted = soundBtn.querySelector('.icon-muted');
      const iconUnmuted = soundBtn.querySelector('.icon-unmuted');
      if (isMuted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        soundBtn.setAttribute('title', 'Activar sonido');
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'block';
        soundBtn.setAttribute('title', 'Silenciar');
      }
    }

    // Clic en la pantalla o en el botón central de play
    wrapper.addEventListener('click', togglePlay);

    // Botón de sonido
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        updateSoundIcon(video.muted);
      });
    }

    // Progreso del video
    if (progressFill) {
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          progressFill.style.width = pct + '%';
        }
      });
    }

    // Al terminar el video, reiniciar y mantener bucle suave
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play();
    });

    // Detectar pausas externas
    video.addEventListener('pause', () => {
      wrapper.classList.remove('is-playing');
    });

    video.addEventListener('play', () => {
      wrapper.classList.add('is-playing');
    });
  });

  // ------------------------------------------------------------------------
  // Función para Copiar al Portapapeles con Toast Notifier
  // ------------------------------------------------------------------------
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastText');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`¡Copiado al portapapeles: ${textToCopy}!`);
      }).catch(() => {
        showToast(`Copiado: ${textToCopy}`);
      });
    });
  });

  // ------------------------------------------------------------------------
  // Menú Hamburguesa para Dispositivos Móviles
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Cerrar al hacer clic en un enlace de navegación
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }

  // ------------------------------------------------------------------------
  // Navegación Suave (Smooth Scroll)
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
