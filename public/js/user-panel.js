import axios from 'axios';

const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

const getCityList = (event) => {
  const state = stateSelect.value;
  console.log(state);

};

stateSelect.addEventListener('input', getCityList);
