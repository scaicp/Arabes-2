let currentIndex = 0;
let productImages = [];

function showProductDetailsWithCarousel(button) {
  const productCard = button.closest('.card-product');
  const name = productCard.dataset.name;
  const price = productCard.dataset.price;
  const desc = productCard.dataset.description;
  const images = productCard.dataset.images;

  document.getElementById('details-name').textContent = name;
  document.getElementById('details-price').textContent = price;
  document.getElementById('details-description').textContent = desc;

  setupProductCarousel(images);
  document.getElementById('product-details').classList.remove('hidden');
}

function setupProductCarousel(imagesAttr) {
  const carouselTrack = document.getElementById('product-carousel');
  const indicators = document.getElementById('carousel-indicators');
  carouselTrack.innerHTML = '';
  indicators.innerHTML = '';
  currentIndex = 0;
  productImages = imagesAttr ? imagesAttr.split(',') : [];

  productImages.forEach((imgPath, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = imgPath.trim();
    img.alt = `Imagen ${i + 1}`;
    slide.appendChild(img);
    carouselTrack.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-indicator';
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('data-index', i);
    dot.onclick = () => moveToSlide(i);
    indicators.appendChild(dot);
  });

  updateCarouselPosition();
}

function moveCarousel(direction) {
  currentIndex = (currentIndex + direction + productImages.length) % productImages.length;
  moveToSlide(currentIndex);
}

function moveToSlide(index) {
  currentIndex = index;
  updateCarouselPosition();
  updateIndicators();
}

function updateCarouselPosition() {
  const track = document.getElementById('product-carousel');
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateIndicators() {
  document.querySelectorAll('.carousel-indicator').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('product-details').classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('product-details');
  if (modal.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') moveCarousel(-1);
  if (e.key === 'ArrowRight') moveCarousel(1);
  if (e.key === 'Escape') closeModal(e);
});
