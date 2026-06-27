const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.navigation');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('navigation--open');
  hamburger.classList.toggle('hamburger--open'); 
});

function closeMenu() {
  nav.classList.remove('navigation--open');
  hamburger.classList.remove('hamburger--open');
}

document.querySelectorAll('.navigation_link').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// 2. Закрытие при клике на оверлей (вне меню и вне бургера)
document.addEventListener('click', (event) => {
  // Если кликнули МИМО навигации И МИМО самого бургера, закрываем меню
  if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
    closeMenu();
  }
});

// Блокировка скролла меню
function preventMenuScroll(event) {
  if (nav.classList.contains('navigation--open')) {
    event.preventDefault();
  }
}

function lockMenuScroll() {
  document.body.classList.add('menu-open');
  document.addEventListener('wheel', preventMenuScroll, { passive: false });
  document.addEventListener('touchmove', preventMenuScroll, { passive: false });
}

function unlockMenuScroll() {
  document.body.classList.remove('menu-open');
  document.removeEventListener('wheel', preventMenuScroll);
  document.removeEventListener('touchmove', preventMenuScroll);
}

hamburger.addEventListener('click', () => {
  if (nav.classList.contains('navigation--open')) {
    lockMenuScroll();
  } else {
    unlockMenuScroll();
  }
});

document.querySelectorAll('.navigation_link').forEach(link => {
  link.addEventListener('click', () => {
    unlockMenuScroll();
  });
});

document.addEventListener('click', () => {
  if (!nav.classList.contains('navigation--open')) {
    unlockMenuScroll();
  }
});