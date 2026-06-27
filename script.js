/* =================================================================
   APEX SIM RACING ACADEMY — NAVBAR + HERO (JS)
   ================================================================= */

/* -----------------------------------------------------------------
   1. GRILLA DE PIXELES AMARILLOS
   Coordenadas (columna, fila) extraídas del mockup de referencia
   sobre una grilla de 31 columnas x 15 filas que cubre el hero
   completo (debajo del navbar).
   ----------------------------------------------------------------- */
const PIXEL_GRID = {
  cols: 31,
  rows: 15,
  cells: [
    [1,0],[5,0],[14,0],[18,0],[20,0],[22,0],[23,0],[25,0],
    [7,1],[14,1],[15,1],[21,1],
    [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[15,2],[16,2],
    [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[16,3],[17,3],
    [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[22,4],
    [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],
    [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],
    [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[12,7],
    [5,8],[6,8],[7,8],[8,8],[9,8],[10,8],
    [7,9],[8,9],
    [26,10],
    [25,11],
    [19,12],[20,12],[21,12],[22,12],[23,12],[24,12],[25,12],[26,12],[27,12],[28,12],[30,12],
    [20,13],[21,13],[22,13],[23,13],[24,13],[25,13],[26,13],[27,13],[28,13],
    [20,14],[21,14],[22,14],[23,14],[24,14],[25,14],[26,14],[27,14],[28,14]
  ]
};

/**
 * Genera los divs de pixeles dentro del contenedor .hero__pixels
 * usando porcentajes, para que escalen de forma fluida con el hero.
 */
function buildPixelGrid(){
  const container = document.getElementById('heroPixels');
  if (!container) return;

  container.innerHTML = '';

  const cellW = 100 / PIXEL_GRID.cols;
  const cellH = 100 / PIXEL_GRID.rows;

  const fragment = document.createDocumentFragment();

  PIXEL_GRID.cells.forEach(([col, row], i) => {
    const px = document.createElement('div');
    px.className = 'hero__pixel';
    px.style.left   = `${col * cellW}%`;
    px.style.top    = `${row * cellH}%`;
    px.style.width  = `${cellW}%`;
    px.style.height = `${cellH}%`;
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
