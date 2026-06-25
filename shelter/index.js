const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.navigation');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('navigation--open');
  hamburger.classList.toggle('hamburger--open'); // Переключаем класс для поворота
});