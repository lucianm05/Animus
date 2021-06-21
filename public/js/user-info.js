const userInfoPanel = document.getElementById('changeUserInfo');

const showConfirmPassword = (event) => {
  const target = event.target;

  if(target.tagName === 'svg') {
    const confirmPasswordDiv = target.parentElement.parentElement.parentElement.nextElementSibling;
    if(confirmPasswordDiv.style.display === 'none') {
      confirmPasswordDiv.style.display = 'block';
    } else if (confirmPasswordDiv.style.display === 'block') {
      confirmPasswordDiv.style.display = 'none';
    }
  } else if(target.tagName === 'BUTTON') {
    const confirmPasswordDiv = target.parentElement.parentElement.nextElementSibling;
    if(confirmPasswordDiv.style.display === 'none') {
      confirmPasswordDiv.style.display = 'block';
    } else if (confirmPasswordDiv.style.display === 'block') {
      confirmPasswordDiv.style.display = 'none';
    }
  } else if(target.tagName === 'path') {
    const confirmPasswordDiv = target.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
    if(confirmPasswordDiv.style.display === 'none') {
      confirmPasswordDiv.style.display = 'block';
    } else if (confirmPasswordDiv.style.display === 'block') {
      confirmPasswordDiv.style.display = 'none';
    }
  }
}

userInfoPanel.addEventListener('click', showConfirmPassword);