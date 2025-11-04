document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const hero = document.createElement("section");
  hero.className = "hero";

  const title = document.createElement("h1");
  title.textContent = "KAVA";

  const subtitle = document.createElement("p");
  subtitle.textContent = "Luxury & Style";

  hero.appendChild(title);
  hero.appendChild(subtitle);
  app.appendChild(hero);


  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const scale = Math.max(1 - scroll / 600, 0.75);
    title.style.transform = `scale(${scale})`;
    subtitle.style.opacity = Math.max(1 - scroll / 300, 0);
  });
});


window.addEventListener("scroll", () => {
  const miniHeader = document.getElementById("mini-header");
  if (window.scrollY > 300) miniHeader.classList.add("show");
  else miniHeader.classList.remove("show");
});


document.addEventListener("DOMContentLoaded", () => {
  const details = document.getElementById('menu-hamb');
  const summary = document.getElementById('hamburger');
  if (!details || !summary) return;

  const syncAria = () => summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
  details.addEventListener('toggle', syncAria);
  syncAria();


  details.querySelector('#nav')?.addEventListener('click', (e) => {
    if (e.target.closest('a')) details.open = false;
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') details.open = false; });
});
// Precios en COP, tallas y colores según catálogo.
const PRODUCTS = [
  {
    id: "camiseta-basica",
    nombre: "Camiseta básica",
    tallas: "S–XL",
    precio: 49900,
    colores: ["blanca","negra","gris"],
    imagen: ""
  },
  {
    id: "camiseta-estampada",
    nombre: "Camiseta estampada",
    tallas: "S–XL",
    precio: 59900,
    colores: ["blanca","negra","verde"],
    imagen: ""
  },
  {
    id: "camiseta-oversize-h",
    nombre: "Camiseta oversize (hombre)",
    tallas: "M–XL",
    precio: 64900,
    colores: ["negra","gris","vino"],
    imagen: ""
  },
  {
    id: "blusa-elegante",
    nombre: "Blusa elegante",
    tallas: "S–L",
    precio: 74900,
    colores: ["vino","blanca","negra"],
    imagen: ""
  },
  {
    id: "buso-clasico",
    nombre: "Buso clásico (cuello redondo)",
    tallas: "S–XL",
    precio: 94900,
    colores: ["gris","negro","azul-marino"],
    imagen: "img/buso-clasico.jpg"
  },
  {
    id: "hoodie-clasico",
    nombre: "Hoodie clásico",
    tallas: "S–XL",
    precio: 124900,
    colores: ["negro","gris","azul"],
    imagen: "img/hoodie-clasico.jpg"
  },
  {
    id: "jean-clasico-h",
    nombre: "Jean clásico (hombre)",
    tallas: "30–38",
    precio: 124900,
    colores: ["azul-oscuro"],
    imagen: "img/jean-clasico-h.jpg"
  },
  {
    id: "bermuda-cargo-h",
    nombre: "Bermuda cargo (hombre)",
    tallas: "30–38",
    precio: 104900,
    colores: ["caqui"],
    imagen: "img/bermuda-cargo-h.jpg"
  }
];

// Mapeo de colores → hex (para swatches)
const COLOR_HEX = {
  "blanca": "#ffffff",
  "negra": "#111111",
  "gris": "#808080",
  "verde": "#2e7d32",
  "vino": "#7b0323",
  "azul": "#1f4aa8",
  "azul-marino": "#001f3f",
  "azul-oscuro": "#0e2a55",
  "beige": "#d9c7a0",
  "caqui": "#b39b62"
};

(function renderCatalog(){
  const grid = document.getElementById('grid-productos');
  const tpl  = document.getElementById('tpl-tarjeta');
  if (!grid || !tpl) return;

  const money = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);

  grid.innerHTML = ''; 
  PRODUCTS.forEach(prod => {
    const node = tpl.content.cloneNode(true);

    const $img   = node.querySelector('img');
    const $name  = node.querySelector('strong');
    const $talla = node.querySelector('.tallas');
    const $price = node.querySelector('em');
    const $menu  = node.querySelector('.colores');
    const $btn   = node.querySelector('[data-add]');

    // Datos base
    $name.textContent = prod.nombre;
    $talla.textContent = `Tallas: ${prod.tallas}`;
    $price.textContent = money(prod.precio);
    if (prod.imagen){ $img.src = prod.imagen; $img.alt = prod.nombre; }
    else { $img.alt = "imagen no disponible"; }

// swatch de colores
    let selectedColor = prod.colores[0] || null;
    prod.colores.forEach((c, idx) => {
      const li = document.createElement('li');
      const b  = document.createElement('button');
      b.type = 'button';
      b.title = c.replace('-', ' ');
      b.style.setProperty('--c', COLOR_HEX[c] || '#ccc');
      b.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
      b.addEventListener('click', () => {
        selectedColor = c;
        $menu.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
        $name.textContent = `${prod.nombre} — ${c.replace('-', ' ')}`;
      });
      li.appendChild(b);
      $menu.appendChild(li);
    });
    $btn.addEventListener('click', () => {
      const old = $btn.textContent;
      $btn.textContent = 'Añadido ✓';
      setTimeout(() => { $btn.textContent = old; }, 900);
    });

    grid.appendChild(node);
  });
})();
//(filtrado en vivo)
(function(){
  const input = document.getElementById('buscador');
  const form  = document.getElementById('buscador-form');
  if (!input || !form) return;

  const norm = s => (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  // Ir a la sección colección al enviar (enter)
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const target = document.getElementById('novedades');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const filtrar = () => {
    const q = norm(input.value);
    const grid = document.getElementById('grid-productos');
    if (!grid) return; // aún no hay catálogo, salimos

    const cards = grid.querySelectorAll('article');
    if (!q){
      cards.forEach(a => a.removeAttribute('hidden'));
      return;
    }
    cards.forEach(a => {
      const txt = norm(a.textContent);
      // match básico por nombre, tallas, precio, color.
      const show = txt.includes(q);
      if (show) a.removeAttribute('hidden'); else a.setAttribute('hidden','');
    });
  };

  input.addEventListener('input', filtrar);
})();
//carrito
const CART_KEY = 'kava_cart';
const readCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
};
const writeCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

/* Enganche: al crear cada tarjeta, añadimos al carrito el ítem pulsado */
(function hookAddButtons(){
  const grid = document.getElementById('grid-productos');
  if (!grid) return;

  // Observa las tarjetas ya renderizadas y futuras (por si re-renders)
  const clickHandler = (e) => {
    const btn = e.target.closest('button[data-add]');
    if (!btn) return;

    const card = btn.closest('article');
    if (!card) return;

    const name = card.querySelector('strong')?.textContent || '';
    const priceText = card.querySelector('em')?.textContent || '';
    const img = card.querySelector('img')?.getAttribute('src') || '';
    const baseName = name.split(' — ')[0].trim();      // nombre sin color agregado
    const colorSel = (name.includes(' — ') ? name.split(' — ')[1].trim() : null) || 'default';

    // Tomamos precio a partir del catálogo renderizado (ya formateado a COP)
    const precio = (() => {
      // intenta extraer número del <em> formateado COP
      const m = priceText.replace(/[^\d]/g,'');
      return m ? Number(m) : 0;
    })();

    // id robusto con color
    const id = (baseName + '|' + colorSel).toLowerCase().replace(/\s+/g,'-');

    const cart = readCart();
    const ix = cart.findIndex(i => i.id === id);
    if (ix > -1) cart[ix].qty += 1;
    else cart.push({ id, nombre: baseName, color: colorSel, precio: precio, qty: 1, imagen: img });

    writeCart(cart);

    // feedback rápido (manteniendo tu animación original si existe)
    const old = btn.textContent;
    btn.textContent = 'Añadido ✓';
    setTimeout(() => { btn.textContent = old; }, 900);
  };

  grid.addEventListener('click', clickHandler);
})();