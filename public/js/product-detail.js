const ratingButtonsContainer = document.getElementById('ratingButtonsContainer');
const ratingText = document.getElementById('ratingText');
const ratingInput = document.getElementById('rating');
const ratingButtons = [];
let clicked = false;

const deleteButton = document.getElementById('deleteButton');
const deleteButtonMB = document.getElementById('deleteButtonMB');
const deleteDialog = document.getElementById('deleteDialog');
const backdropProductDetail = document.getElementById('backdropProductDetail');
const closeButton = document.getElementById('closeButton');
let showDelDialog = false;

[...ratingButtonsContainer.children].forEach((child) => {
  if (child.tagName === 'BUTTON') {
    ratingButtons.push(child);
  }

  return ratingButtons;
});

const fullStars = [
  '<svg data-rating="1" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
  '<svg data-rating="2" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
  '<svg data-rating="3" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
  '<svg data-rating="4" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
  '<svg data-rating="5" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
];

const emptyStars = [
  '<svg data-rating="1" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>',
  '<svg data-rating="2" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>',
  '<svg data-rating="3" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>',
  '<svg data-rating="4" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>',
  '<svg data-rating="5" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>',
];

const resetStars = () => {
  if (!clicked) {
    for (let i = 0; i < 5; i++) {
      ratingButtons[i].innerHTML = `
      <svg data-rating='${i + 1}' xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#333652" class="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
      </svg>
      `;
    }

    ratingText.innerText = '';
  }
};

const setRatingTextAndStars = (rating) => {
  switch (rating) {
    case 1:
      ratingText.innerText = 'Nu recomand';
      ratingButtons[0].innerHTML = fullStars[0];
      ratingButtons[4].innerHTML = emptyStars[4];
      ratingButtons[3].innerHTML = emptyStars[3];
      ratingButtons[2].innerHTML = emptyStars[2];
      ratingButtons[1].innerHTML = emptyStars[1];

      break;

    case 2:
      ratingText.innerText = 'Slab';
      ratingButtons[0].innerHTML = fullStars[0];
      ratingButtons[1].innerHTML = fullStars[1];
      ratingButtons[4].innerHTML = emptyStars[4];
      ratingButtons[3].innerHTML = emptyStars[3];
      ratingButtons[2].innerHTML = emptyStars[2];

      break;

    case 3:
      ratingText.innerText = 'Acceptabil';
      ratingButtons[0].innerHTML = fullStars[0];
      ratingButtons[1].innerHTML = fullStars[1];
      ratingButtons[2].innerHTML = fullStars[2];
      ratingButtons[4].innerHTML = emptyStars[4];
      ratingButtons[3].innerHTML = emptyStars[3];

      break;

    case 4:
      ratingText.innerText = 'Bun';
      ratingButtons[0].innerHTML = fullStars[0];
      ratingButtons[1].innerHTML = fullStars[1];
      ratingButtons[2].innerHTML = fullStars[2];
      ratingButtons[3].innerHTML = fullStars[3];
      ratingButtons[4].innerHTML = emptyStars[4];

      break;

    case 5:
      ratingText.innerText = 'Excelent';
      ratingButtons[0].innerHTML = fullStars[0];
      ratingButtons[1].innerHTML = fullStars[1];
      ratingButtons[2].innerHTML = fullStars[2];
      ratingButtons[3].innerHTML = fullStars[3];
      ratingButtons[4].innerHTML = fullStars[4];
      break;

    default:
      ratingText.innerText = '';
      break;
  }
};

const setHover = (event) => {
  if (!clicked) {
    const target = event.target;

    if (target.tagName === 'svg') {
      const rating = +target.dataset.rating;

      switch (rating) {
        case 1:
          setRatingTextAndStars(1);
          break;

        case 2:
          setRatingTextAndStars(2);
          break;

        case 3:
          setRatingTextAndStars(3);
          break;

        case 4:
          setRatingTextAndStars(4);
          break;

        case 5:
          setRatingTextAndStars(5);
          break;

        default:
          ratingText.innerText = '';
          break;
      }
    }
  }
};

const setRating = (event) => {
  clicked = true;

  const target = event.target;

  let rating;

  if (target.tagName === 'BUTTON') {
    rating = +target.dataset.rating;
  } else if (target.tagName === 'svg') {
    rating = +target.parentElement.dataset.rating;
  } else if (target.tagName === 'path') {
    rating = +target.parentElement.parentElement.dataset.rating;
  }

  switch (rating) {
    case 1:
      ratingInput.value = 1;
      setRatingTextAndStars(1);
      break;

    case 2:
      ratingInput.value = 2;
      setRatingTextAndStars(2);
      break;

    case 3:
      ratingInput.value = 3;
      setRatingTextAndStars(3);
      break;

    case 4:
      ratingInput.value = 4;
      setRatingTextAndStars(4);
      break;

    case 5:
      ratingInput.value = 5;
      setRatingTextAndStars(5);
      break;

    default:
      ratingInput.value = 0;
      break;
  }
};

const showDeleteDialog = () => {
  if (!showDelDialog) {
    console.log('show');
    deleteDialog.style.transform = 'translateY(0)';
    backdropProductDetail.style.display = 'block';
    showDelDialog = true;
  } else {
    console.log('hide');
    deleteDialog.style.transform = 'translateY(-300%)';
    backdropProductDetail.style.display = 'none';
    showDelDialog = false;
  }
};

ratingButtonsContainer.addEventListener('mouseover', setHover);
ratingButtonsContainer.addEventListener('click', setRating);
ratingButtonsContainer.addEventListener('mouseout', resetStars);

deleteButton.addEventListener('click', showDeleteDialog);
deleteButtonMB.addEventListener('click', showDeleteDialog);
backdropProductDetail.addEventListener('click', showDeleteDialog);
closeButton.addEventListener('click', showDeleteDialog);