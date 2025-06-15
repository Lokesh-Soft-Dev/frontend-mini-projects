// Get references to all important elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// Function to show the Register form and hide Login form
function displayRegisterForm() {
  if (!registerForm.classList.contains('active')) {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    console.log("Switched to Register Form");
  }
}

// Function to show the Login form and hide Register form
function displayLoginForm() {
  if (!loginForm.classList.contains('active')) {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    console.log("Switched to Login Form");
  }
}

// Add click event listeners for switching forms
showRegisterLink.addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default anchor behavior
  displayRegisterForm();
});

showLoginLink.addEventListener('click', function(event) {
  event.preventDefault();
  displayLoginForm();
});

// Add submit event listener to Login form
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (username === '' || password === '') {
    alert('Please fill in both username and password.');
    return;
  }

  // Simulate login process
  console.log('Logging in with:', username, password);
  alert(`Welcome back, ${username}!`);

  // Reset form after login
  loginForm.reset();
});

// Add submit event listener to Register form
registerForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const fullName = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  if (fullName === '' || email === '' || password === '') {
    alert('Please fill in all registration fields.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Simulate registration process
  console.log('Registering user:', fullName, email, password);
  alert(`Account created successfully! Welcome, ${fullName}`);

  // Reset form after registration
  registerForm.reset();

  // Automatically switch to login after registration
  displayLoginForm();
});

// Utility function to validate email format
function validateEmail(email) {
  // Basic email regex for validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
