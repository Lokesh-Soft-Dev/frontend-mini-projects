const inputField = document.getElementById('input');
const outputField = document.getElementById('output');
const historyDiv = document.getElementById('history');
const themeToggle = document.getElementById('toggle-theme');

const HISTORY_LIMIT = 50;
let lastResult = 0;
let memory = 0;

window.onload = () => {
  const saved = localStorage.getItem('calcHistory');
  if (saved) historyDiv.innerHTML = saved;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  addUnitConversionUI();
  inputField.addEventListener('keydown', handleKey);
};

function calculate() {
  const expression = inputField.value.trim();
  if (expression === '') return;

  try {
    const exprWithAns = expression.replace(/\bans\b/gi, lastResult);
    const sanitized = replaceMath(exprWithAns);
    const result = safeEval(sanitized);

    if (typeof result === 'undefined' || result === null || isNaN(result)) {
      outputField.textContent = "Error";
      highlightInputError(true);
      return;
    }

    lastResult = result;
    outputField.textContent = "= " + result;
    highlightInputError(false);
    addHistoryEntry(expression, result);
    trimHistory();
    saveHistory();
  } catch {
    outputField.textContent = "Invalid Expression";
    highlightInputError(true);
  }
}

function replaceMath(expr) {
  return expr
    .replace(/\bsqrt\(/gi, 'Math.sqrt(')
    .replace(/\bpow\(/gi, 'Math.pow(')
    .replace(/\blog\(/gi, 'Math.log(')
    .replace(/\babs\(/gi, 'Math.abs(')
    .replace(/\bround\(/gi, 'Math.round(')
    .replace(/\bfloor\(/gi, 'Math.floor(')
    .replace(/\bceil\(/gi, 'Math.ceil(')
    .replace(/\bmax\(/gi, 'Math.max(')
    .replace(/\bmin\(/gi, 'Math.min(')
    .replace(/\bsin\(/gi, 'Math.sin(')
    .replace(/\bcos\(/gi, 'Math.cos(')
    .replace(/\btan\(/gi, 'Math.tan(')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b/gi, 'Math.E');
}

function safeEval(expr) {
  if (/[^-()\d/*+.e\sMathPIEpowsqrtcosintanfloorceilroundlogmaxminabs]/gi.test(expr)) {
    throw new Error('Unsafe characters detected');
  }
  return Function(`"use strict"; return (${expr})`)();
}

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
  } else if (key === 'm') {
    event.preventDefault();
    memoryRecall();
  }
}

function highlightInputError(hasError) {
  inputField.style.borderColor = hasError ? 'red' : '';
  outputField.style.color = hasError ? 'red' : '';
}

function addHistoryEntry(expression, result) {
  const div = document.createElement('div');
  div.classList.add('history-item');
  div.innerHTML = `<span>${expression} = ${result}</span><small>${new Date().toLocaleTimeString()}</small>`;
  historyDiv.prepend(div);
}

function trimHistory() {
  const entries = historyDiv.querySelectorAll('.history-item');
  if (entries.length > HISTORY_LIMIT) {
    for (let i = HISTORY_LIMIT; i < entries.length; i++) {
      historyDiv.removeChild(entries[i]);
    }
  }
}

function saveHistory() {
  localStorage.setItem('calcHistory', historyDiv.innerHTML);
}

function clearHistory() {
  if (confirm('Clear all history?')) {
    historyDiv.innerHTML = '';
    localStorage.removeItem('calcHistory');
  }
}

function clearInput() {
  inputField.value = '';
  outputField.textContent = "= 0";
  highlightInputError(false);
  inputField.focus();
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function toggleHistory() {
  historyDiv.classList.toggle('hidden');
}

function memoryRecall() {
  inputField.value = memory.toString();
  inputField.focus();
}

// --- Unit Conversion ---
function addUnitConversionUI() {
  const controls = document.querySelector('.controls');

  const conversions = [
    { label: 'C → F', convert: val => (val * 9 / 5 + 32).toFixed(2) + ' °F' },
    { label: 'F → C', convert: val => ((val - 32) * 5 / 9).toFixed(2) + ' °C' },
    { label: 'M → Ft', convert: val => (val * 3.28084).toFixed(2) + ' ft' },
    { label: 'Ft → M', convert: val => (val / 3.28084).toFixed(2) + ' m' },
  ];

  conversions.forEach(({ label, convert }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.onclick = () => {
      const val = parseFloat(inputField.value);
      if (isNaN(val)) return alert(`Enter valid number`);
      outputField.textContent = "= " + convert(val);
    };
    controls.appendChild(btn);
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}
