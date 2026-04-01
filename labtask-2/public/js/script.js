const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('#nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
        }
    });
});

