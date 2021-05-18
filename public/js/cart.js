const sendOrderButton = document.getElementById('sendOrder');
const addresses = document.getElementById('addresses');

let showAddresses = false;

const showMoreInfo = () => {
  
  if (!showAddresses) {
    showAddresses = true;
    addresses.style.display = 'flex';
    addresses.scrollIntoView({ behavior: 'smooth' });
  } else {
    showAddresses = false;
    addresses.style.display = 'none';
  }
}

sendOrderButton.addEventListener('click', showMoreInfo);