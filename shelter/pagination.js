const petRows = document.querySelectorAll('.our-friends_inner .pets-cards');
const pageCounter = document.querySelector('.pagination_counter');
const firstPageButton = document.querySelector('.pagination_btn--start');
const prevPageButton = document.querySelector('.pagination_btn--prev');
const nextPageButton = document.querySelector('.pagination_btn--next');
const lastPageButton = document.querySelector('.pagination_btn--end');

let pets = [];
let paginationCards = [];
let currentPage = 1;
let isPageChanging = false;

function getCardsPerPage() {
  if (window.innerWidth >= 1280) {
    return 8;
  }

  if (window.innerWidth >= 768) {
    return 6;
  }

  return 3;
}

function getPageCount() {
  return paginationCards.length / getCardsPerPage();
}

function createPetCard(pet) {
  const card = document.createElement('a');
  card.className = 'pets-card';
  card.href = 'pets.html';
  card.innerHTML = `
    <img class="pets-card-img" src="${pet.img}" alt="${pet.name}">
    <p class="pets-card-name">${pet.name}</p>
    <span class="pets-card-btn">Learn more</span>
  `;
  return card;
}

function createStableCardsList() {
  const cards = [];
  const shifts = [0, 3, 6, 1, 4, 7];

  shifts.forEach((shift) => {
    pets.forEach((_, index) => {
      cards.push(pets[(index + shift) % pets.length]);
    });
  });

  return cards;
}

function renderCards(cards) {
  petRows.forEach((row) => {
    row.innerHTML = '';
  });

  cards.slice(0, 4).forEach((pet) => {
    petRows[0].appendChild(createPetCard(pet));
  });

  cards.slice(4).forEach((pet) => {
    petRows[1].appendChild(createPetCard(pet));
  });
}

function updateButtons() {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === getPageCount();

  firstPageButton.disabled = isPageChanging || isFirstPage;
  prevPageButton.disabled = isPageChanging || isFirstPage;
  nextPageButton.disabled = isPageChanging || isLastPage;
  lastPageButton.disabled = isPageChanging || isLastPage;
}

function renderPage() {
  const cardsPerPage = getCardsPerPage();
  const startIndex = (currentPage - 1) * cardsPerPage;
  const pageCards = paginationCards.slice(startIndex, startIndex + cardsPerPage);

  renderCards(pageCards);
  pageCounter.textContent = currentPage;
  updateButtons();
}

function changePage(page) {
  const nextPage = Math.min(Math.max(page, 1), getPageCount());

  if (isPageChanging || nextPage === currentPage) {
    return;
  }

  isPageChanging = true;
  currentPage = nextPage;
  updateButtons();

  petRows.forEach((row) => row.classList.add('pets-cards--changing'));

  window.setTimeout(() => {
    renderPage();
  }, 200);

  petRows[0].addEventListener(
    'animationend',
    () => {
      petRows.forEach((row) => row.classList.remove('pets-cards--changing'));
      isPageChanging = false;
      updateButtons();
    },
    { once: true }
  );
}

async function initPagination() {
  if (!petRows.length) {
    return;
  }

  const response = await fetch('pets.json');
  pets = await response.json();
  paginationCards = createStableCardsList();

  renderPage();

  firstPageButton.addEventListener('click', () => changePage(1));
  prevPageButton.addEventListener('click', () => changePage(currentPage - 1));
  nextPageButton.addEventListener('click', () => changePage(currentPage + 1));
  lastPageButton.addEventListener('click', () => changePage(getPageCount()));

  window.addEventListener('resize', () => {
    currentPage = Math.min(currentPage, getPageCount());
    renderPage();
  });
}

initPagination();
