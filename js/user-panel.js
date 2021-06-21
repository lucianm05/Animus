const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

const addressForm = document.getElementById('addressForm');
const addressFormButton = document.getElementById('addressFormButton');

const userAddresses = document.getElementById('userAddresses');
const addressesButton = document.getElementById('addressesButton');

const userInfoButton = document.getElementById('userInfoButton');
const changeUserInfo = document.getElementById('changeUserInfo');

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

const showAddressForm = () => {
  if (addressForm.style.display === 'none') {
    addressForm.style.display = 'block';
  } else {
    addressForm.style.display = 'none';
  }
};

const showUserAddresses = () => {
  if (userAddresses.style.display === 'none') {
    userAddresses.style.display = 'block';
  } else {
    userAddresses.style.display = 'none';
  }
};

const showChangeUserInfo = () => {
  if (changeUserInfo.style.display === 'none') {
    changeUserInfo.style.display = 'block';
  } else {
    changeUserInfo.style.display = 'none';
  }
};

stateSelect.addEventListener('input', getCityList);
userInfoButton.addEventListener('click', showChangeUserInfo)
addressesButton.addEventListener('click', showUserAddresses);
addressFormButton.addEventListener('click', showAddressForm);
