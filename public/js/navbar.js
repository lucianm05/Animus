const mobileNavButton = document.getElementById('mobileNavButton');
const backdrop = document.getElementById('backdrop');
const mobileNav = document.getElementById('navbar__mobile');

let show;

const showMobileNav = () => {
  if (!show) {
    mobileNav.style.transform = 'translateX(0)';
    backdrop.style.display = 'block';
    mobileNavButton.style.transform = 'rotate(90deg)'
    show = true;
  } else {
    mobileNav.style.transform = 'translateX(-100%)';
    backdrop.style.display = 'none';
    mobileNavButton.style.transform = 'rotate(0)'
    show = false;
  }
};

mobileNavButton.addEventListener('click', showMobileNav);
backdrop.addEventListener('click', showMobileNav);
