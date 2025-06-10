// Set the date we're counting down to
const targetDate = new Date("Jan 26, 2026 00:00:00").getTime();

// Update the countdown every 1 second
const countdownInterval = setInterval(function() {
    // Get the current date and time
    const now = new Date().getTime();
    
    // Calculate the difference between the target date and now
    const distance = targetDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the countdown
    document.getElementById("countdown").innerHTML =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // If the countdown is finished, display a message
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = "We are live!";
    }
}, 1000);
