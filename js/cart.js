const sendOrderButton = document.getElementById('sendOrder');
const addresses = document.getElementById('addresses');

const addressFormCart = document.getElementById('addressFormCart');
const addressFormButtonCart = document.getElementById('addressFormButtonCart');

const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

const showMoreInfo = () => {
  
  if (addresses.style.display === 'none') {
    addresses.style.display = 'flex';
    addresses.scrollIntoView({ behavior: 'smooth' });
  } else {
    addresses.style.display = 'none';
  }
}

const showAddressForm = () => {
  if (addressFormCart.style.display === 'none') {
    addressFormCart.style.display = 'block';
  } else {
    addressFormCart.style.display = 'none';
  }
};

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

          const uniqueCities = [...new Set(cities.sort())];

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

sendOrderButton.addEventListener('click', showMoreInfo);
addressFormButtonCart.addEventListener('click', showAddressForm);
stateSelect.addEventListener('input', getCityList);