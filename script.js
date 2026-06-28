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