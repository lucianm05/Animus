const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

const addressForm = document.getElementById('addressForm');
const addressFormButton = document.getElementById('addressFormButton');

const getCityList = () => {
  citySelect.innerHTML = '';

  const state = stateSelect.value;
  const cities = [];

  fetch(`https://roloca.coldfuse.io/orase/${state}`)
    .then((response) =>
      response
        .json()
        .then((data) => {
          for (const key in data) {
            if (data[key].comuna) {
              cities.push(data[key].comuna);
            } else {
              cities.push(data[key].simplu);
            }
          }

          const uniqueCities = cities.sort().filter((el, index) => cities.indexOf(el) === index);

          uniqueCities.forEach((city) => {
            if (city) {
              citySelect.innerHTML = citySelect.innerHTML + `<option value=${city}>${city}</option>`;
            }
          });
        })
        .catch((error) => console.log(error))
    )
    .catch((error) => console.log(error));
};

const showAddressForm = () => {
  if (addressForm.style.display === 'none') {
    addressForm.style.display = 'block';
  } else {
    addressForm.style.display = 'none';
  }
};

stateSelect.addEventListener('input', getCityList);
addressFormButton.addEventListener('click', showAddressForm);
