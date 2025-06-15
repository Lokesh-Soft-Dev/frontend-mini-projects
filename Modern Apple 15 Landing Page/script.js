// Scroll-based opacity change for the hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  const scrollPosition = window.scrollY;

  // Fade effect based on scroll position
  if (scrollPosition > 100) {
    hero.style.opacity = 0.8;
  } else {
    hero.style.opacity = 1;
  }
});
