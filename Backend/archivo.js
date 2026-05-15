// archivo.js - Funciones auxiliares para toda la aplicación

function togglePasswordVisibility(inputId, buttonElement) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
  if (buttonElement) {
    const icon = buttonElement.querySelector('i');
    if (icon) {
      icon.className = type === 'password' ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
    }
  }
}

function toggleFavorite(buttonElement) {
  if (!buttonElement) return;
  buttonElement.classList.toggle('active');
  const icon = buttonElement.querySelector('i');
  if (icon) {
    icon.className = buttonElement.classList.contains('active') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }
}

function enviarMensaje(chatInputId, messagesContainerId) {
  const input = document.getElementById(chatInputId);
  const container = document.getElementById(messagesContainerId);
  if (!input || !container) return;
  const text = input.value.trim();
  if (text === '') return;
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message sent';
  messageDiv.innerHTML = `${text}<div class="message-time">Ahora</div>`;
  container.appendChild(messageDiv);
  input.value = '';
  container.scrollTop = container.scrollHeight;
  setTimeout(() => {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'message received';
    replyDiv.innerHTML = `Gracias por tu mensaje, te responderé pronto.<div class="message-time">Ahora</div>`;
    container.appendChild(replyDiv);
    container.scrollTop = container.scrollHeight;
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFavorite(btn);
    });
  });
  document.querySelectorAll('.toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-target') || (btn.parentElement?.querySelector('input')?.id);
      if (inputId) togglePasswordVisibility(inputId, btn);
    });
  });
});

// Función toast (global)
function showToast(message, iconClass = 'fa-solid fa-check-circle') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ---------- PANEL DE NOTIFICACIONES ----------
const bell = document.getElementById('notificationBell');
const notifPanel = document.getElementById('notifPanel');
const closeNotif = document.getElementById('closeNotifPanel');

function openNotifPanel() {
  notifPanel.classList.add('show');
}
function closeNotifPanel() {
  notifPanel.classList.remove('show');
}
bell.addEventListener('click', (e) => {
  e.stopPropagation();
  // Alternar panel
  if (notifPanel.classList.contains('show')) {
    closeNotifPanel();
  } else {
    openNotifPanel();
  }
});
closeNotif.addEventListener('click', closeNotifPanel);
// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!notifPanel.contains(e.target) && !bell.contains(e.target)) {
    closeNotifPanel();
  }
});
// Redirigir al hacer clic en una notificación (solo la de venta)
const notifItems = document.querySelectorAll('.notif-item');
notifItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const redirectUrl = item.getAttribute('data-redirect');
    if (redirectUrl && redirectUrl !== '#') {
      showToast('🔔 Abriendo mensajes...', 'fa-regular fa-message');
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 400);
    } else {
      showToast('Próximamente más acciones', 'fa-solid fa-info-circle');
    }
    closeNotifPanel();
  });
});

// ---------- CERRAR CHATBOT ----------
const closeChatbot = document.getElementById('closeChatbotBtn');
const chatbotDiv = document.getElementById('chatbotContainer');
closeChatbot.addEventListener('click', (e) => {
  e.stopPropagation();
  chatbotDiv.style.display = 'none';
  showToast('Chatbot cerrado, recarga la página para volver a mostrarlo', 'fa-solid fa-robot');
});

// ---------- MAPA (Leaflet) ----------
let mapInstance = null;
function initMap() {
  if (mapInstance) return;
  const center = [19.5567, -99.2470];
  mapInstance = L.map('realMap').setView(center, 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapInstance);
  const productosMapa = [
    { lat: 19.5590, lng: -99.2490, titulo: "Silla Gamer RGB", precio: 3500, imagen: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=100", link: "vistaproducto.html" },
    { lat: 19.5540, lng: -99.2455, titulo: "Bicicleta Trek", precio: 4200, imagen: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=100", link: "vistaproducto.html" },
    { lat: 19.5610, lng: -99.2510, titulo: "iPhone 14 Pro", precio: 14900, imagen: "https://images.unsplash.com/photo-1510557880182-3c9d6dff1f7a?w=100", link: "vistaproducto.html" }
  ];
  productosMapa.forEach(p => {
    const popupContent = `
          <div class="map-popup-product">
            <img src="${p.imagen}" alt="${p.titulo}">
            <div>
              <h4>${p.titulo}</h4>
              <div class="price">$${p.precio.toLocaleString('es-MX')}</div>
              <button onclick="window.location.href='${p.link}'">Ver producto</button>
            </div>
          </div>
        `;
    L.marker([p.lat, p.lng]).addTo(mapInstance).bindPopup(popupContent);
  });
}
function centerMapOnLocation() {
  if (!mapInstance) return;
  mapInstance.setView([19.5567, -99.2470], 15);
  showToast("Mapa centrado en Ciudad López Mateos", "fa-solid fa-location-dot");
}
const btnMap = document.getElementById('toggleMap');
const standardInfo = document.getElementById('standardInfo');
const mapView = document.getElementById('mapView');
let mapOpen = false;
btnMap.addEventListener('click', () => {
  mapOpen = !mapOpen;
  if (mapOpen) {
    standardInfo.style.display = 'none';
    mapView.style.display = 'block';
    btnMap.classList.add('active');
    btnMap.innerHTML = '<i class="fa-solid fa-xmark"></i> <span>Cerrar Mapa</span>';
    if (!mapInstance) initMap();
    else setTimeout(() => mapInstance.invalidateSize(), 100);
    if (!document.getElementById('centerMapBtn')) {
      const centerBtn = document.createElement('button');
      centerBtn.id = 'centerMapBtn';
      centerBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
      centerBtn.style.position = 'absolute';
      centerBtn.style.bottom = '80px';
      centerBtn.style.right = '16px';
      centerBtn.style.zIndex = '1000';
      centerBtn.style.background = 'white';
      centerBtn.style.border = '1px solid var(--border)';
      centerBtn.style.borderRadius = '40px';
      centerBtn.style.width = '44px';
      centerBtn.style.height = '44px';
      centerBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      centerBtn.style.cursor = 'pointer';
      centerBtn.onclick = centerMapOnLocation;
      mapView.appendChild(centerBtn);
    }
  } else {
    standardInfo.style.display = 'block';
    mapView.style.display = 'none';
    btnMap.classList.remove('active');
    btnMap.innerHTML = '<i class="fa-solid fa-map"></i> <span>Ver Mapa</span>';
  }
});
document.getElementById('exploreNearbyBtn').addEventListener('click', () => {
  if (mapOpen && mapInstance) centerMapOnLocation();
  else showToast("Abre el mapa primero con el botón de la derecha", "fa-solid fa-info-circle");
});

// ---------- PRODUCTOS (8 artículos) ----------
const products = [
  { id: 1, title: 'Bicicleta Trek', price: 4200, distance: 1.2, seller: 'Andrea M.', rating: 4.9, time: '30 min', category: 'sports', condition: 'Usado', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500', badge: 'Entrega hoy', saved: false },
  { id: 2, title: 'iPhone 14 Pro', price: 14900, distance: 2.4, seller: 'Carlos R.', rating: 4.8, time: '2 h', category: 'technology', condition: 'Como nuevo', image: 'https://images.unsplash.com/photo-1510557880182-3c9d6dff1f7a?w=500', badge: 'Nuevo', saved: true },
  { id: 3, title: 'Sofá 3 plazas', price: 7800, distance: 3.1, seller: 'Fernanda L.', rating: 4.7, time: '5 h', category: 'home', condition: 'Buen estado', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', badge: 'Popular', saved: false },
  { id: 4, title: 'Silla Gamer', price: 2600, distance: 0.8, seller: 'Rodrigo T.', rating: 5.0, time: '1 h', category: 'technology', condition: 'Como nuevo', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', badge: 'Entrega hoy', saved: false },
  { id: 5, title: 'Monitor Curvo 27"', price: 3500, distance: 1.5, seller: 'Luis G.', rating: 4.6, time: '3 h', category: 'technology', condition: 'Excelente', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', badge: 'Destacado', saved: false },
  { id: 6, title: 'Laptop Dell XPS', price: 18500, distance: 2.1, seller: 'Mariana P.', rating: 4.9, time: '6 h', category: 'technology', condition: 'Nuevo', image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0b6?w=500', badge: 'Nuevo', saved: false },
  { id: 7, title: 'Auriculares Sony', price: 1800, distance: 0.9, seller: 'Jorge M.', rating: 4.8, time: '2 h', category: 'technology', condition: 'Como nuevo', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', badge: 'Oferta', saved: false },
  { id: 8, title: 'Mesa de noche', price: 1200, distance: 2.8, seller: 'Claudia F.', rating: 4.5, time: '1 día', category: 'home', condition: 'Usado', image: 'https://images.unsplash.com/photo-1593697972069-6c7a7f42e2b0?w=500', badge: 'Usado', saved: false }
];

const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-item');
const filterBtns = document.querySelectorAll('.chip[data-filter]');
let activeCategory = 'all';
let activeFilter = 'nearby';

function formatPrice(p) { return new Intl.NumberFormat('es-MX').format(p); }
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p => {
    const categoryMatch = activeCategory === 'all' || p.category === activeCategory;
    const searchMatch = !query || p.title.toLowerCase().includes(query) || p.seller.toLowerCase().includes(query);
    let filterMatch = true;
    if (activeFilter === 'budget') filterMatch = p.price < 5000;
    else if (activeFilter === 'new') filterMatch = p.condition === 'Nuevo';
    else if (activeFilter === 'used') filterMatch = p.condition === 'Usado' || p.condition === 'Buen estado';
    else if (activeFilter === 'nearby') filterMatch = p.distance <= 3.0;
    return categoryMatch && searchMatch && filterMatch;
  });
  grid.innerHTML = filtered.map(p => {
    const verifiedIcon = p.rating >= 4.9 ? `<i class="fa-solid fa-circle-check verified-icon" title="Vendedor verificado"></i>` : '';
    return `
        <article class="product-card">
          <div class="product-media"><a href="vistaproducto.html"><img src="${p.image}" alt="${p.title}"></a><div class="product-badges"><span class="badge-tag ${p.badge === 'Nuevo' ? 'green' : 'dark'}">${p.badge}</span></div><button class="favorite-btn ${p.saved ? 'active' : ''}" data-id="${p.id}"><i class="${p.saved ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button></div>
          <div class="product-body">
            <a href="vistaproducto.html"><h3 class="product-title">${p.title}</h3></a>
            <div class="price-row"><div class="price">$${formatPrice(p.price)}</div><div class="seller-rating"><i class="fa-solid fa-star"></i> ${p.rating}</div></div>
            <div class="meta-row"><span><i class="fa-solid fa-location-crosshairs"></i> ${p.distance} km</span><span><i class="fa-solid fa-user"></i> ${p.seller} ${verifiedIcon}</span><span><i class="fa-regular fa-clock"></i> ${p.time}</span></div>
            <div class="product-actions"><button class="primary-btn" onclick="window.location.href='chat.html'"><i class="fa-regular fa-message"></i> Mensaje</button><button class="secondary-btn" onclick="showToast('Opciones adicionales próximamente', 'fa-solid fa-info-circle')"><i class="fa-solid fa-ellipsis"></i></button></div>
          </div>
        </article>
      `}).join('');

  document.querySelectorAll('.favorite-btn').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = parseInt(btn.dataset.id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      prod.saved = !prod.saved;
      renderProducts();
      if (prod.saved) showToast('Guardado en favoritos', 'fa-solid fa-heart');
      else showToast('Eliminado de favoritos', 'fa-regular fa-heart');
    }
  }));
}

categoryBtns.forEach(btn => btn.addEventListener('click', () => { categoryBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeCategory = btn.dataset.category; renderProducts(); }));
filterBtns.forEach(btn => btn.addEventListener('click', () => { filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderProducts(); }));
searchInput.addEventListener('input', renderProducts);
renderProducts();
