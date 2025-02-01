let currentIndex = 0;

function showSlide(index) {
  const carouselInner = document.querySelector('.carousel-inner');
  const totalItems = document.querySelectorAll('.carousel-item').length;

  // Verifica os limites
  if (index >= totalItems) currentIndex = 0;
  if (index < 0) currentIndex = totalItems - 1;

  // Move o carrossel
  const offset = -currentIndex * 100;
  carouselInner.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  currentIndex++;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex--;
  showSlide(currentIndex);
}