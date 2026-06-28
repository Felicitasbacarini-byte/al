/* =================================================================
   APEX SIM RACING ACADEMY — NAVBAR + HERO (JS)
   ================================================================= */
 
/* -----------------------------------------------------------------
   1. PIXELES AMARILLOS FLOTANTES
   Cada bloque fue extraído directamente de la imagen de referencia
   (contorno real de cada mancha amarilla, no una grilla forzada).
   left/top/width/height están en % del área del hero; clip es el
   contorno del bloque en % LOCAL a su propio rectángulo (así los
   bloques compuestos en forma de escalera no quedan como un simple
   rectángulo, y los bloques simples usan un rectángulo 0-100%).
   ----------------------------------------------------------------- */
const FLOATING_PIXELS = [
  { left: 3.251,  top: 0,      width: 3.251,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 16.454, top: 0,      width: 3.251,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 44.186, top: 0,      width: 13.078, height: 26.4,
    clip: [[0,0],[25,0],[25,25],[50,25],[50,50],[75,50],[75,75],
           [100,75],[100,100],[50,100],[50,75],[25,75],[25,50],[0,50]] },
  { left: 57.239, top: 0,      width: 3.276,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 63.766, top: 0,      width: 3.276,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 70.293, top: 0,      width: 6.552,  height: 6.639,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 80.095, top: 0,      width: 3.276,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 67.042, top: 6.587,  width: 3.251,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 70.318, top: 26.193, width: 3.251,  height: 6.535,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 40.935, top: 62.915, width: 3.251,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 83.696, top: 67.583, width: 3.251,  height: 6.587,
    clip: [[0,0],[0,100],[100,100],[100,0]] },
  { left: 60.615, top: 74.17,  width: 32.608, height: 25.83,
    clip: [[60,0],[70,0],[70,25],[100,25],[100,100],[10,100],
           [10,50],[0,50],[0,25],[60,25]] },
  { left: 96.749, top: 80.809, width: 3.251,  height: 6.535,
    clip: [[0,0],[0,100],[100,100],[100,0]] }
];
 
/**
 * Genera los divs de pixeles dentro del contenedor .hero__pixels-inner.
 * Cada bloque usa su posición/tamaño real (extraídos de la referencia)
 * y un clip-path con el contorno real, en vez de una grilla uniforme.
 */
function buildPixelGrid(){
  const container = document.getElementById('heroPixels');
  if (!container) return;
 
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
 
  FLOATING_PIXELS.forEach((block, i) => {
    const px = document.createElement('div');
    px.className = 'hero__pixel';
    px.style.left   = `${block.left}%`;
    px.style.top    = `${block.top}%`;
    px.style.width  = `${block.width}%`;
    px.style.height = `${block.height}%`;
 
    if (block.clip && block.clip.length > 4){
      // solo aplicar clip-path real en formas compuestas (no en rectángulos simples,
      // para ahorrarle trabajo al navegador y evitar bordes con antialiasing raro)
      const points = block.clip.map(([x,y]) => `${x}% ${y}%`).join(', ');
      px.style.clipPath = `polygon(${points})`;
    }
 
    // pequeña variación de delay para que el flote no se vea sincronizado
    px.style.setProperty('--float-delay', `${(i % 7) * 0.35}s`);
    fragment.appendChild(px);
  });
 
  container.appendChild(fragment);
}
 
/* -----------------------------------------------------------------
   2. CURSOR GLOW — sigue al mouse con interpolación suave
   ----------------------------------------------------------------- */
function initCursorGlow(){
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
 
  // Si es un dispositivo táctil, no inicializamos el listener (ahorra ciclos)
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch) return;
 
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;
  const ease = 0.15; // factor de suavizado
 
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
 
  function animateGlow(){
    glowX += (mouseX - glowX) * ease;
    glowY += (mouseY - glowY) * ease;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
 
  requestAnimationFrame(animateGlow);
}
 
/* -----------------------------------------------------------------
   3. MENÚ MOBILE (hamburguesa)
   ----------------------------------------------------------------- */
function initMobileMenu(){
  const burger = document.getElementById('navbarBurger');
  const menu = document.getElementById('navbarMenu');
  if (!burger || !menu) return;
 
  function closeMenu(){
    burger.classList.remove('is-active');
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
 
  function toggleMenu(){
    const isOpen = menu.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
 
  burger.addEventListener('click', toggleMenu);
 
  // cerrar al hacer click en un link del menú
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
 
  // cerrar si se redimensiona a desktop con el menú abierto
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}
 
/* -----------------------------------------------------------------
   4. INIT
   ----------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  buildPixelGrid();
  initCursorGlow();
  initMobileMenu();
});
/* =================================================================
   APEX â€” SECCIÃ“N 02: SOBRE APEX (JS)
   ================================================================= */

/* -----------------------------------------------------------------
   1. PIXELES AMARILLOS
   Cada bloque fue extraÃ­do directamente de la imagen de referencia
   (posiciÃ³n y contorno reales, no una grilla forzada).

   DESKTOP: coordenadas en % relativas a TODA la secciÃ³n, porque
   varios bloques flotan sobre el fondo blanco a la izquierda de la
   foto (fuera del Ã¡rea de la imagen).

   MOBILE: el layout colapsa a una sola columna (imagen arriba sin
   franja blanca al lado), asÃ­ que se usa un segundo set de
   coordenadas relativas solo al Ã¡rea de la imagen, con los bloques
   que en desktop caÃ­an fuera de la foto ya excluidos.
   ----------------------------------------------------------------- */
const SEC02_PIXELS_DESKTOP = [
  { left: 2.981,  top: 0,      width: 3.269, height: 5.586, clip: null },
  { left: 50.92,  top: 0,      width: 3.269, height: 5.608, clip: null },
  { left: 80.324, top: 0,      width: 3.266, height: 5.675, clip: null },
  { left: 86.856, top: 0,      width: 3.266, height: 5.675, clip: null },
  { left: 60.726, top: 0.066,  width: 3.269, height: 5.608, clip: null },
  { left: 96.919, top: 0.066,  width: 3.081, height: 5.608, clip: null },
  { left: 90.595, top: 21.02,  width: 3.206, height: 5.542, clip: null },
  { left: 84.17,  top: 26.562, width: 9.618, height: 27.49,
    clip: [[0,0],[66.667,0],[66.667,40],[100,40],[100,100],[66.667,100],
           [66.667,80],[0,80],[0,60],[33.333,60],[33.333,20],[0,20]] },
  { left: 49.618, top: 32.104, width: 3.206, height: 5.531, clip: null },
  { left: 52.824, top: 37.635, width: 3.206, height: 5.531, clip: null },
  { left: 80.977, top: 32.104, width: 3.206, height: 5.52,  clip: null },
  { left: 96.982, top: 37.58,  width: 3.018, height: 5.542, clip: null },
  { left: 46.425, top: 37.646, width: 3.206, height: 5.542, clip: null },
  { left: 49.618, top: 48.708, width: 9.618, height: 10.885,
    clip: [[0,0],[100,0],[100,100],[66.667,100],[66.667,50],[0,50]] },
  { left: 45.161, top: 89.004, width: 6.452, height: 10.996,
    clip: [[50,0],[100,0],[100,100],[0,100],[0,50],[50,50]] },
  { left: 80.645, top: 94.502, width: 3.226, height: 5.498, clip: null },
  { left: 90.323, top: 94.502, width: 3.226, height: 5.498, clip: null }
];

// Mismos bloques que SÃ caen dentro del Ã¡rea de la imagen, recalculados
// como % relativos solo a esa imagen (no a toda la secciÃ³n).
const SEC02_PIXELS_MOBILE = [
  { left: 51.732, top: 0,      width: 8.012, height: 5.675, clip: null },
  { left: 67.756, top: 0,      width: 8.012, height: 5.675, clip: null },
  { left: 3.655,  top: 0.066,  width: 8.019, height: 5.608, clip: null },
  { left: 92.442, top: 0.066,  width: 7.558, height: 5.608, clip: null },
  { left: 76.928, top: 21.02,  width: 7.865, height: 5.542, clip: null },
  { left: 61.167, top: 26.562, width: 23.594, height: 27.49,
    clip: [[0,0],[66.667,0],[66.667,40],[100,40],[100,100],[66.667,100],
           [66.667,80],[0,80],[0,60],[33.333,60],[33.333,20],[0,20]] },
  { left: 53.334, top: 32.104, width: 7.865, height: 5.52,  clip: null },
  { left: 92.596, top: 37.58,  width: 7.404, height: 5.542, clip: null },
  { left: 52.519, top: 94.502, width: 7.914, height: 5.498, clip: null },
  { left: 76.261, top: 94.502, width: 7.914, height: 5.498, clip: null }
];

const SEC02_MOBILE_BREAKPOINT = 860;

/**
 * Genera los divs de pixeles dentro de .sec02__pixels-inner.
 * Quedan con opacity:0 / scale(.4) por CSS hasta que se les agrega
 * la clase .is-visible (scroll-reveal, ver secciÃ³n 3).
 *
 * En mobile, el contenedor .sec02__pixels se mueve dentro de
 * .sec02__media-inner (para quedar acotado solo a la imagen) y se
 * usa el set de coordenadas SEC02_PIXELS_MOBILE; en desktop vuelve
 * a su lugar original como hijo directo de la secciÃ³n.
 */
function getSec02PixelsContext(){
  const isMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
  const wrapper = document.querySelector('.sec02__pixels');
  const section = document.getElementById('sobre-apex');
  const mediaInner = document.querySelector('.sec02__media-inner');
  if (!wrapper || !section || !mediaInner) return null;
  return { isMobile, wrapper, section, mediaInner };
}

function placeSec02PixelsWrapper(){
  const ctx = getSec02PixelsContext();
  if (!ctx) return;
  const { isMobile, wrapper, section, mediaInner } = ctx;

  if (isMobile && wrapper.parentElement !== mediaInner){
    mediaInner.appendChild(wrapper);
    wrapper.classList.add('sec02__pixels--mobile');
  } else if (!isMobile && wrapper.parentElement !== section){
    section.insertBefore(wrapper, section.firstChild);
    wrapper.classList.remove('sec02__pixels--mobile');
  }
}

function buildSec02Pixels(){
  placeSec02PixelsWrapper();

  const container = document.getElementById('sec02Pixels');
  if (!container) return;

  const isMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
  const dataset = isMobile ? SEC02_PIXELS_MOBILE : SEC02_PIXELS_DESKTOP;

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  dataset.forEach((block, i) => {
    const px = document.createElement('div');
    px.className = 'sec02__pixel';
    px.style.left   = `${block.left}%`;
    px.style.top    = `${block.top}%`;
    px.style.width  = `${block.width}%`;
    px.style.height = `${block.height}%`;

    if (block.clip){
      const points = block.clip.map(([x,y]) => `${x}% ${y}%`).join(', ');
      px.style.clipPath = `polygon(${points})`;
    }

    // delay escalonado para que aparezcan en cascada, no todos a la vez
    px.style.transitionDelay = `${(i % 10) * 0.04}s`;
    fragment.appendChild(px);
  });

  container.appendChild(fragment);

  // si ya se habÃ­a revelado la secciÃ³n, los pixeles nuevos deben
  // aparecer visibles de inmediato (evita que un resize los oculte)
  if (document.body.classList.contains('sec02-revealed')){
    container.querySelectorAll('.sec02__pixel').forEach(el => el.classList.add('is-visible'));
  }
}

/* Reconstruye los pixeles al cruzar el breakpoint mobile/desktop
   (con debounce simple para no recalcular en cada pixel de resize) */
let sec02ResizeTimer = null;
function initSec02ResizeListener(){
  let lastIsMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
  window.addEventListener('resize', () => {
    clearTimeout(sec02ResizeTimer);
    sec02ResizeTimer = setTimeout(() => {
      const nowIsMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
      if (nowIsMobile !== lastIsMobile){
        lastIsMobile = nowIsMobile;
        buildSec02Pixels();
      }
    }, 150);
  });
}

/* =================================================================
   APEX — SECCIÓN 02: SOBRE APEX (JS)
   ================================================================= */
 
/* -----------------------------------------------------------------
   1. PIXELES AMARILLOS
   Cada bloque fue extraído directamente de la imagen de referencia
   (posición y contorno reales, no una grilla forzada).
 
   DESKTOP: coordenadas en % relativas a TODA la sección, porque
   varios bloques flotan sobre el fondo blanco a la izquierda de la
   foto (fuera del área de la imagen).
 
   MOBILE: el layout colapsa a una sola columna (imagen arriba sin
   franja blanca al lado), así que se usa un segundo set de
   coordenadas relativas solo al área de la imagen, con los bloques
   que en desktop caían fuera de la foto ya excluidos.
   ----------------------------------------------------------------- */
const SEC02_PIXELS_DESKTOP = [
  { left: 2.981,  top: 0,      width: 3.269, height: 5.586, clip: null },
  { left: 50.92,  top: 0,      width: 3.269, height: 5.608, clip: null },
  { left: 80.324, top: 0,      width: 3.266, height: 5.675, clip: null },
  { left: 86.856, top: 0,      width: 3.266, height: 5.675, clip: null },
  { left: 60.726, top: 0.066,  width: 3.269, height: 5.608, clip: null },
  { left: 96.919, top: 0.066,  width: 3.081, height: 5.608, clip: null },
  { left: 90.595, top: 21.02,  width: 3.206, height: 5.542, clip: null },
  { left: 84.17,  top: 26.562, width: 9.618, height: 27.49,
    clip: [[0,0],[66.667,0],[66.667,40],[100,40],[100,100],[66.667,100],
           [66.667,80],[0,80],[0,60],[33.333,60],[33.333,20],[0,20]] },
  { left: 49.618, top: 32.104, width: 3.206, height: 5.531, clip: null },
  { left: 52.824, top: 37.635, width: 3.206, height: 5.531, clip: null },
  { left: 80.977, top: 32.104, width: 3.206, height: 5.52,  clip: null },
  { left: 96.982, top: 37.58,  width: 3.018, height: 5.542, clip: null },
  { left: 46.425, top: 37.646, width: 3.206, height: 5.542, clip: null },
  { left: 49.618, top: 48.708, width: 9.618, height: 10.885,
    clip: [[0,0],[100,0],[100,100],[66.667,100],[66.667,50],[0,50]] },
  { left: 45.161, top: 89.004, width: 6.452, height: 10.996,
    clip: [[50,0],[100,0],[100,100],[0,100],[0,50],[50,50]] },
  { left: 80.645, top: 94.502, width: 3.226, height: 5.498, clip: null },
  { left: 90.323, top: 94.502, width: 3.226, height: 5.498, clip: null }
];
 
// Mismos bloques que SÍ caen dentro del área de la imagen, recalculados
// como % relativos solo a esa imagen (no a toda la sección).
const SEC02_PIXELS_MOBILE = [
  { left: 51.732, top: 0,      width: 8.012, height: 5.675, clip: null },
  { left: 67.756, top: 0,      width: 8.012, height: 5.675, clip: null },
  { left: 3.655,  top: 0.066,  width: 8.019, height: 5.608, clip: null },
  { left: 92.442, top: 0.066,  width: 7.558, height: 5.608, clip: null },
  { left: 76.928, top: 21.02,  width: 7.865, height: 5.542, clip: null },
  { left: 61.167, top: 26.562, width: 23.594, height: 27.49,
    clip: [[0,0],[66.667,0],[66.667,40],[100,40],[100,100],[66.667,100],
           [66.667,80],[0,80],[0,60],[33.333,60],[33.333,20],[0,20]] },
  { left: 53.334, top: 32.104, width: 7.865, height: 5.52,  clip: null },
  { left: 92.596, top: 37.58,  width: 7.404, height: 5.542, clip: null },
  { left: 52.519, top: 94.502, width: 7.914, height: 5.498, clip: null },
  { left: 76.261, top: 94.502, width: 7.914, height: 5.498, clip: null }
];
 
const SEC02_MOBILE_BREAKPOINT = 860;
 
/**
 * Genera los divs de pixeles dentro de .sec02__pixels-inner.
 * Quedan con opacity:0 / scale(.4) por CSS hasta que se les agrega
 * la clase .is-visible (scroll-reveal, ver sección 3).
 *
 * En mobile, el contenedor .sec02__pixels se mueve dentro de
 * .sec02__media-inner (para quedar acotado solo a la imagen) y se
 * usa el set de coordenadas SEC02_PIXELS_MOBILE; en desktop vuelve
 * a su lugar original como hijo directo de la sección.
 */
function getSec02PixelsContext(){
  const isMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
  const wrapper = document.querySelector('.sec02__pixels');
  const section = document.getElementById('sobre-apex');
  const mediaInner = document.querySelector('.sec02__media-inner');
  if (!wrapper || !section || !mediaInner) return null;
  return { isMobile, wrapper, section, mediaInner };
}
 
function placeSec02PixelsWrapper(){
  const ctx = getSec02PixelsContext();
  if (!ctx) return;
  const { isMobile, wrapper, section, mediaInner } = ctx;
 
  if (isMobile && wrapper.parentElement !== mediaInner){
    mediaInner.appendChild(wrapper);
    wrapper.classList.add('sec02__pixels--mobile');
  } else if (!isMobile && wrapper.parentElement !== section){
    section.insertBefore(wrapper, section.firstChild);
    wrapper.classList.remove('sec02__pixels--mobile');
  }
}
 
function buildSec02Pixels(){
  placeSec02PixelsWrapper();
 
  const container = document.getElementById('sec02Pixels');
  if (!container) return;
 
  const isMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
  const dataset = isMobile ? SEC02_PIXELS_MOBILE : SEC02_PIXELS_DESKTOP;
 
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
 
  dataset.forEach((block, i) => {
    const px = document.createElement('div');
    px.className = 'sec02__pixel';
    px.style.left   = `${block.left}%`;
    px.style.top    = `${block.top}%`;
    px.style.width  = `${block.width}%`;
    px.style.height = `${block.height}%`;
 
    if (block.clip){
      const points = block.clip.map(([x,y]) => `${x}% ${y}%`).join(', ');
      px.style.clipPath = `polygon(${points})`;
    }
 
    // delay escalonado para que aparezcan en cascada, no todos a la vez
    // (cascada más lenta y notoria que antes)
    px.style.transitionDelay = `${(i % 10) * 0.09}s`;
    fragment.appendChild(px);
  });
 
  container.appendChild(fragment);
 
  // si ya se había revelado la sección, los pixeles nuevos deben
  // aparecer visibles de inmediato (evita que un resize los oculte)
  if (document.body.classList.contains('sec02-revealed')){
    container.querySelectorAll('.sec02__pixel').forEach(el => el.classList.add('is-visible'));
  }
}
 
/* Reconstruye los pixeles al cruzar el breakpoint mobile/desktop
   (con debounce simple para no recalcular en cada pixel de resize) */
let sec02ResizeTimer = null;
function initSec02ResizeListener(){
  let lastIsMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
  window.addEventListener('resize', () => {
    clearTimeout(sec02ResizeTimer);
    sec02ResizeTimer = setTimeout(() => {
      const nowIsMobile = window.innerWidth <= SEC02_MOBILE_BREAKPOINT;
      if (nowIsMobile !== lastIsMobile){
        lastIsMobile = nowIsMobile;
        buildSec02Pixels();
      }
    }, 150);
  });
}
 
/* -----------------------------------------------------------------
   2. CONTADOR ANIMADO DE STATS
   Anima cada número desde 0 hasta su valor final cuando entra en
   pantalla, con easing y duración proporcional.
   ----------------------------------------------------------------- */
function animateCounter(el, target, duration = 2600){
  const start = performance.now();
  const startVal = 0;
 
  function tick(now){
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cuadrático
    const eased = 1 - Math.pow(1 - progress, 2);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = `+${current}`;
 
    if (progress < 1){
      requestAnimationFrame(tick);
    } else {
      el.textContent = `+${target}`;
    }
  }
 
  requestAnimationFrame(tick);
}
 
/* -----------------------------------------------------------------
   3. SCROLL REVEAL
   Usa IntersectionObserver para revelar el texto, los stats y los
   pixeles a medida que la sección entra en el viewport. Los pixeles
   se revelan en cascada (cada uno con su propio transition-delay ya
   seteado en buildSec02Pixels). Los stats además disparan el contador.
   ----------------------------------------------------------------- */
function initSec02ScrollReveal(){
  const section = document.getElementById('sobre-apex');
  if (!section) return;
 
  const revealEls = section.querySelectorAll('.sec02__reveal');
  const pixelEls = section.querySelectorAll('.sec02__pixel');
  const statNumbers = section.querySelectorAll('.sec02__stat-number');
 
  let countersStarted = false;
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        // revelar textos y stats con cascada según su orden en el DOM
        // (cascada más lenta: más separación entre cada elemento)
        revealEls.forEach((el, i) => {
          setTimeout(() => el.classList.add('is-visible'), i * 220);
        });
 
        // revelar pixeles
        pixelEls.forEach(el => el.classList.add('is-visible'));
        document.body.classList.add('sec02-revealed');
 
        // disparar contadores una sola vez
        // (arrancan un poco después de que entran los textos, para
        // que el conjunto se sienta más pausado en vez de instantáneo)
        if (!countersStarted){
          countersStarted = true;
          setTimeout(() => {
            statNumbers.forEach(el => {
              const target = parseInt(el.getAttribute('data-target'), 10);
              animateCounter(el, target);
            });
          }, 300);
        }
 
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.25
  });
 
  observer.observe(section);
}
 
/* -----------------------------------------------------------------
   4. INIT
   ----------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  buildSec02Pixels();
  initSec02ScrollReveal();
  initSec02ResizeListener();
});
/* =================================================================
   APEX — SECCIÓN 04: SPONSORS (JS)
   El movimiento de la cinta es 100% CSS (@keyframes sec04Scroll).
   Este script solo se encarga del fade-in de entrada de la sección
   cuando aparece en el viewport, igual que en sec02.
   ================================================================= */
 
function initSec04ScrollReveal(){
  const section = document.getElementById('sponsors');
  if (!section) return;
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        section.classList.add('is-visible');
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.2
  });
 
  observer.observe(section);
}
 
document.addEventListener('DOMContentLoaded', () => {
  initSec04ScrollReveal();
});
 