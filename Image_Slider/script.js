let slideIndex = 0;

function moveSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.querySelectorAll(".slide");
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
    }
    slides[slideIndex].style.opacity = "1";
}

// Auto-play functionality (optional)
setInterval(() => {
    moveSlide(1);
}, 5000); // Change slide every 5 seconds
