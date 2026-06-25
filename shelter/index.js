const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.navigation');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('navigation--open');
  hamburger.classList.toggle('hamburger--open'); 
});
document.querySelectorAll('.navigation_link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('navigation--open');
    hamburger.classList.remove('hamburger--open');
  });
});

// 2. Закрытие при клике на оверлей (вне меню и вне бургера)
document.addEventListener('click', (event) => {
  // Если кликнули МИМО навигации И МИМО самого бургера, закрываем меню
  if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
    nav.classList.remove('navigation--open');
    hamburger.classList.remove('hamburger--open');
  }
});