document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.carrossel-slides');
  const prevBtn = document.querySelector('.botao-anterior');
  const nextBtn = document.querySelector('.botao-proximo');
  const totalSlides = document.querySelectorAll('.slide').length;
  let currentIndex = 0;

  // Função para atualizar a posição do slide
  const updateSlidePosition = () => {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  // Próximo slide
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides; // Vai pro próximo, e volta ao início
    updateSlidePosition();
  });

  // Slide anterior
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Vai pro anterior
    updateSlidePosition();
  });

  // Inicialização
  updateSlidePosition();
});
