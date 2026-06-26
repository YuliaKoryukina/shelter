const carouselTrack = document.querySelector('.carousel__track');
const slideLeft = document.querySelector('.carousel__slide--left');
const slideActive = document.querySelector('.carousel__slide--active');
const slideRight = document.querySelector('.carousel__slide--right');
const btnPrev = document.querySelector('.our-friends .pagination_btn--prev');
const btnNext = document.querySelector('.our-friends .pagination_btn--next');

let pets = [];
let isAnimating = false;
let activeGroup = [];
let leftGroup = [];
let rightGroup = [];

function shuffle(array) {
  const items = [...array];

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function getCardsPerSlide() {
  const width = window.innerWidth;

  if (width >= 1280) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
}

function getNamesSet(group) {
  return new Set(group.map((pet) => pet.name));
}

function getRandomGroup(excludedNames, count) {
  const available = pets.filter((pet) => !excludedNames.has(pet.name));
  return shuffle(available).slice(0, count);
}

function createPetCard(pet) {
  const card = document.createElement('div');
  card.className = 'pets-card';
  card.innerHTML = `
    <img class="pets-card-img" src="${pet.img}" alt="${pet.name}">
    <p class="pets-card-name">${pet.name}</p>
    <span class="pets-card-btn">Learn more</span>
  `;
  return card;
}

function renderSlide(slide, group) {
  slide.innerHTML = '';
  group.forEach((pet) => {
    slide.appendChild(createPetCard(pet));
  });
}

function refreshSlides() {
  renderSlide(slideLeft, leftGroup);
  renderSlide(slideActive, activeGroup);
  renderSlide(slideRight, rightGroup);
}

function initGroups() {
  const count = getCardsPerSlide();

  activeGroup = getRandomGroup(new Set(), count);
  leftGroup = getRandomGroup(getNamesSet(activeGroup), count);
  rightGroup = getRandomGroup(getNamesSet(activeGroup), count);
  refreshSlides();
}

function lockButtons() {
  isAnimating = true;
  btnPrev.disabled = true;
  btnNext.disabled = true;
}

function unlockButtons() {
  isAnimating = false;
  btnPrev.disabled = false;
  btnNext.disabled = false;
}

function moveNext() {
  if (isAnimating) {
    return;
  }

  lockButtons();
  carouselTrack.classList.add('carousel__track--next');
}

function movePrev() {
  if (isAnimating) {
    return;
  }

  lockButtons();
  carouselTrack.classList.add('carousel__track--prev');
}

function handleAnimationEnd(event) {
  if (event.target !== carouselTrack) {
    return;
  }

  const count = getCardsPerSlide();

  if (carouselTrack.classList.contains('carousel__track--next')) {
    carouselTrack.classList.remove('carousel__track--next');
    leftGroup = activeGroup;
    activeGroup = rightGroup;
    rightGroup = getRandomGroup(getNamesSet(activeGroup), count);
  } else if (carouselTrack.classList.contains('carousel__track--prev')) {
    carouselTrack.classList.remove('carousel__track--prev');
    rightGroup = activeGroup;
    activeGroup = leftGroup;
    leftGroup = getRandomGroup(getNamesSet(activeGroup), count);
  } else {
    return;
  }

  refreshSlides();
  unlockButtons();
}

async function initSlider() {
  if (!carouselTrack) {
    return;
  }

  const response = await fetch('pets.json');
  pets = await response.json();
  initGroups();

  btnPrev.addEventListener('click', movePrev);
  btnNext.addEventListener('click', moveNext);
  carouselTrack.addEventListener('animationend', handleAnimationEnd);

  window.addEventListener('resize', () => {
    if (!isAnimating) {
      initGroups();
    }
  });
}

initSlider();
