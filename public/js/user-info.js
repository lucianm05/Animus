const userInfoPanel = document.getElementById('changeUserInfo');

const showConfirmPassword = (event) => {
  const target = event.target;
  console.log(target.tagName);

  if(target.tagName === 'svg' || target.tagName === 'path') {
    const confirmPasswordDiv = target.parentElement.parentElement.parentElement.nextElementSibling;
    if(confirmPasswordDiv.style.display === 'none') {
      confirmPasswordDiv.style.display = 'block';
    } else if (confirmPasswordDiv.style.display === 'block') {
      confirmPasswordDiv.style.display = 'none';
    }
  } else if(target.tagName === 'BUTTON') {
    console.log(target.parentElement.parentElement);
    const confirmPasswordDiv = target.parentElement.parentElement.nextElementSibling;
    if(confirmPasswordDiv.style.display === 'none') {
      confirmPasswordDiv.style.display = 'block';
    } else if (confirmPasswordDiv.style.display === 'block') {
      confirmPasswordDiv.style.display = 'none';
    }
  }
}

userInfoPanel.addEventListener('click', showConfirmPassword);