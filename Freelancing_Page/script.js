// Smooth Scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Form validation
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let name = document.querySelector('input[name="name"]').value;
    let email = document.querySelector('input[name="email"]').value;
    let message = document.querySelector('textarea[name="message"]').value;

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
    } else {
        alert('Thank you for reaching out! I will get back to you soon.');
        this.reset();
    }
});
