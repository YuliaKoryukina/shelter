(function () {
  let popupPetsData = [];
  let popupPetsPromise = null;

  function createPopupMarkup() {
    const popup = document.createElement('div');
    popup.className = 'pet-popup';
    popup.innerHTML = `
      <div class="pet-popup__overlay"></div>
      <div class="pet-popup__content">
        <button class="pet-popup__close" type="button" aria-label="Close popup"></button>
        <img class="pet-popup__img" src="" alt="">
        <div class="pet-popup__info">
          <h3 class="pet-popup__name"></h3>
          <p class="pet-popup__type"></p>
          <p class="pet-popup__description"></p>
          <ul class="pet-popup__list">
            <li class="pet-popup__item"><b>Age:</b> <span class="pet-popup__age"></span></li>
            <li class="pet-popup__item"><b>Inoculations:</b> <span class="pet-popup__inoculations"></span></li>
            <li class="pet-popup__item"><b>Diseases:</b> <span class="pet-popup__diseases"></span></li>
            <li class="pet-popup__item"><b>Parasites:</b> <span class="pet-popup__parasites"></span></li>
          </ul>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    return popup;
  }

  const popup = createPopupMarkup();
  const overlay = popup.querySelector('.pet-popup__overlay');
  const closeButton = popup.querySelector('.pet-popup__close');
  const popupImage = popup.querySelector('.pet-popup__img');
  const popupName = popup.querySelector('.pet-popup__name');
  const popupType = popup.querySelector('.pet-popup__type');
  const popupDescription = popup.querySelector('.pet-popup__description');
  const popupAge = popup.querySelector('.pet-popup__age');
  const popupInoculations = popup.querySelector('.pet-popup__inoculations');
  const popupDiseases = popup.querySelector('.pet-popup__diseases');
  const popupParasites = popup.querySelector('.pet-popup__parasites');

  function loadPopupPets() {
    if (!popupPetsPromise) {
      popupPetsPromise = fetch('pets.json')
        .then((response) => response.json())
        .then((data) => {
          popupPetsData = data;
          return popupPetsData;
        });
    }

    return popupPetsPromise;
  }

  function getPetName(card) {
    const nameElement = card.querySelector('.pets-card-name');
    return card.dataset.name || nameElement?.textContent.trim();
  }

  function fillPopup(pet) {
    popupImage.src = pet.img;
    popupImage.alt = pet.name;
    popupName.textContent = pet.name;
    popupType.textContent = `${pet.type} - ${pet.breed}`;
    popupDescription.textContent = pet.description;
    popupAge.textContent = pet.age;
    popupInoculations.textContent = pet.inoculations.join(', ');
    popupDiseases.textContent = pet.diseases.join(', ');
    popupParasites.textContent = pet.parasites.join(', ');
  }

  function preventPageScroll(event) {
    if (!document.body.classList.contains('popup-open')) {
      return;
    }

    if (!event.target.closest('.pet-popup__content')) {
      event.preventDefault();
    }
  }

  function lockScroll() {
    document.body.classList.add('popup-open');
    document.addEventListener('wheel', preventPageScroll, { passive: false });
    document.addEventListener('touchmove', preventPageScroll, { passive: false });
  }

  function unlockScroll() {
    document.body.classList.remove('popup-open');
    document.removeEventListener('wheel', preventPageScroll);
    document.removeEventListener('touchmove', preventPageScroll);
  }

  function openPopup(pet) {
    fillPopup(pet);
    popup.classList.add('pet-popup--open');
    lockScroll();
  }

  function closePopup() {
    popup.classList.remove('pet-popup--open');
    unlockScroll();
  }

  async function openCardPopup(card) {
    if (!card) {
      return;
    }

    const petName = getPetName(card);
    const pets = await loadPopupPets();
    const pet = pets.find((item) => item.name === petName);

    if (pet) {
      openPopup(pet);
    }
  }

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.pets-card');

    if (!card) {
      return;
    }

    event.preventDefault();
    openCardPopup(card);
  });

  document.addEventListener('keydown', (event) => {
    const card = event.target.closest('.pets-card');

    if (!card || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    openCardPopup(card);
  });

  overlay.addEventListener('click', closePopup);
  closeButton.addEventListener('click', closePopup);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('pet-popup--open')) {
      closePopup();
    }
  });
})();
