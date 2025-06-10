const inputField = document.getElementById('input');
const outputField = document.getElementById('output');
const historyDiv = document.getElementById('history');
const themeToggle = document.getElementById('toggle-theme');

const HISTORY_LIMIT = 50;

// Load history from localStorage
window.onload = () => {
  const saved = localStorage.getItem('calcHistory');
  if (saved) historyDiv.innerHTML = saved;
};

// Main calculate function
function calculate() {
  const expression = inputField.value.trim();
  if (expression === '') return;

  try {
    const sanitizedExpression = replaceMath(expression);
    const result = eval(sanitizedExpression); // Note: Replace eval for safer use in production

    if (typeof result === 'undefined' || isNaN(result)) {
      outputField.textContent = "Error";
      return;
    }

    outputField.textContent = "= " + result;

    const historyEntry = document.createElement('div');
    historyEntry.innerHTML = `<span>${expression} = ${result}</span><small>${new Date().toLocaleTimeString()}</small>`;
    historyEntry.classList.add('history-item');
    historyDiv.prepend(historyEntry);

    trimHistory();
    saveHistory();
  } catch (err) {
    outputField.textContent = "Invalid Expression";
  }
}

// Converts keywords to JavaScript Math functions
function replaceMath(expr) {
  return expr
    .replace(/sqrt\(/gi, 'Math.sqrt(')
    .replace(/pow\(/gi, 'Math.pow(')
    .replace(/sin\(/gi, 'Math.sin(')
    .replace(/cos\(/gi, 'Math.cos(')
    .replace(/tan\(/gi, 'Math.tan(')
    .replace(/log\(/gi, 'Math.log(')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b/gi, 'Math.E');
}

// Keyboard handling
function handleKey(event) {
  const key = event.key.toLowerCase();

  if (key === 'enter') {
    event.preventDefault();
    calculate();
  } else if (key === 'c' || key === 'escape') {
    clearInput();
  } else if (key === 'h') {
    toggleHistory();
  } else if (key === 'l') {
    toggleTheme();
  }
}

function clearInput() {
  inputField.value = '';
  outputField.textContent = "= 0";
}

function clearHistory() {
  historyDiv.innerHTML = '';
  localStorage.removeItem('calcHistory');
}

function saveHistory() {
  localStorage.setItem('calcHistory', historyDiv.innerHTML);
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

function toggleHistory() {
  historyDiv.classList.toggle('hidden');
}

// Keep only latest N history entries
function trimHistory() {
  const entries = historyDiv.querySelectorAll('.history-item');
  if (entries.length > HISTORY_LIMIT) {
    for (let i = HISTORY_LIMIT; i < entries.length; i++) {
      historyDiv.removeChild(entries[i]);
    }
  }
}

// Theme toggle listener
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}
