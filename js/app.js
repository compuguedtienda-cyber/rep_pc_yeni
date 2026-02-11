const track = document.querySelector('.slider-track');
let slides = Array.from(track.children);
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let index = 1;
let slideWidth;
let autoplayInterval;

/* ===== CLONAR PARA LOOP INFINITO ===== */
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = Array.from(track.children);

/* ===== INICIALIZAR ===== */
function setPosition() {
  slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

window.addEventListener('load', setPosition);
window.addEventListener('resize', setPosition);

/* ===== CONTROLES ===== */
function moveNext() {
  if (index >= slides.length - 1) return;
  index++;
  track.style.transition = 'transform 0.4s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

function movePrev() {
  if (index <= 0) return;
  index--;
  track.style.transition = 'transform 0.4s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

next.addEventListener('click', () => {
  stopAutoplay();
  moveNext();
  startAutoplay();
});

prev.addEventListener('click', () => {
  stopAutoplay();
  movePrev();
  startAutoplay();
});

/* ===== LOOP INVISIBLE ===== */
track.addEventListener('transitionend', () => {
  if (slides[index].id === 'first-clone') {
    track.style.transition = 'none';
    index = 1;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  if (slides[index].id === 'last-clone') {
    track.style.transition = 'none';
    index = slides.length - 2;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }
});

/* ===== AUTOPLAY INFINITO ===== */
function startAutoplay() {
  autoplayInterval = setInterval(moveNext, 3500);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

startAutoplay();

/* ===== SWIPE / DRAG ===== */
let startX = 0;
let isDragging = false;

track.addEventListener('touchstart', startDrag);
track.addEventListener('mousedown', startDrag);

track.addEventListener('touchmove', dragMove);
track.addEventListener('mousemove', dragMove);

track.addEventListener('touchend', endDrag);
track.addEventListener('mouseup', endDrag);
track.addEventListener('mouseleave', endDrag);

function startDrag(e) {
  stopAutoplay();
  isDragging = true;
  startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function dragMove(e) {
  if (!isDragging) return;
  const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  const diff = startX - x;

  track.style.transition = 'none';
  track.style.transform = `translateX(-${index * slideWidth + diff}px)`;
}

function endDrag(e) {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
  const diff = startX - endX;

  track.style.transition = 'transform 0.4s ease';

  if (diff > 50) moveNext();
  else if (diff < -50) movePrev();
  else setPosition();

  startAutoplay();
}







/* SHARE */
async function sharePage(){
  const data = {
    title:'COMPUGUED',
    text:'Catálogo tecnológico',
    url:location.href
  };

  if(navigator.share && window.isSecureContext){
    try{
      await navigator.share(data);
    }catch{
      copyLink();
    }
  }else{
    copyLink();
  }
}

function copyLink(){
  navigator.clipboard.writeText(location.href)
    .then(() => alert('Enlace copiado'));
}

/* WEATHER */
const tempEl = document.querySelector('.temp');
const iconEl = document.querySelector('.weather i');
const weatherTextEl = document.getElementById('weatherText');

const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast?latitude=-6.7714&longitude=-79.8409&current_weather=true';

function getPeriodoChiclayo() {
  const hora = new Date().getHours(); // hora local del navegador (Perú)

  if (hora >= 6 && hora < 12) return 'Día';
  if (hora >= 12 && hora < 19) return 'Tarde';
  return 'Noche';
}

function updateWeather(){
  fetch(WEATHER_API)
    .then(r => r.json())
    .then(d => {
      const w = d.current_weather;
      const t = Math.round(w.temperature);

      /* Icono fijo: termómetro */
      iconEl.className = 'fas fa-temperature-low thermo';

      iconEl.style.color = '#c7d6e9'; 


      tempEl.textContent = `${t} °C`;
      weatherTextEl.textContent = getPeriodoChiclayo();
    })
    .catch(() => {
      tempEl.textContent = '-- °C';
      weatherTextEl.textContent = 'No disponible';
    });
}

/* Carga inicial */
updateWeather();

/* Actualizar cada 10 minutos */
setInterval(updateWeather, 600000);



/* IR A MAPA */
function goToMap(){
  window.location.href = 'mapa2.html';
}