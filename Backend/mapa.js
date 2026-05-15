function showToast(message, iconClass = 'fa-solid fa-check-circle') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div'); toast.className = 'toast';
  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Galería de imágenes
const thumbs = document.querySelectorAll('.thumb-detail');
const mainImg = document.getElementById('mainImg');
thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    mainImg.src = thumb.dataset.img;
  });
});

// Oferta
document.getElementById('offerBtn').addEventListener('click', () => {
  let oferta = prompt('Ingresa tu oferta en pesos:');
  if (oferta && !isNaN(oferta)) showToast(`Oferta de $${oferta} enviada al vendedor.`, 'fa-solid fa-paper-plane');
  else if (oferta) showToast('Por favor ingresa un número válido.', 'fa-solid fa-triangle-exclamation');
});

// ---------- MAPA INTERACTIVO EN MODAL ----------
const modal = document.getElementById('mapModal');
const showBtn = document.getElementById('showLocationBtn');
const closeBtn = document.getElementById('closeMapModalBtn');
let mapInstance = null;

function initLocationMap() {
  if (mapInstance) return;
  // Coordenadas simuladas del vendedor (ciudad López Mateos, cerca del centro)
  const sellerCoords = [19.5567, -99.2470];
  mapInstance = L.map('productMap').setView(sellerCoords, 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapInstance);
  // Marcador con información del producto
  const popupContent = `
        <div style="font-family: Inter; text-align: center;">
          <strong>Monitor Curvo 27"</strong><br>
          <span style="color:#2563EB; font-weight:800;">$2,500</span><br>
          <small>Vendedor: Rolando S.</small>
        </div>
      `;
  L.marker(sellerCoords).addTo(mapInstance).bindPopup(popupContent).openPopup();
}

function openModal() {
  modal.classList.add('active');
  // Esperar a que el modal esté visible para inicializar el mapa
  setTimeout(() => {
    if (!mapInstance) {
      initLocationMap();
    } else {
      mapInstance.invalidateSize();
    }
  }, 200);
}

function closeModal() {
  modal.classList.remove('active');
}

showBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
// Cerrar al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});