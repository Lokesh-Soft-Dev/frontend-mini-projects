const palette = document.getElementById('palette');
const generateBtn = document.getElementById('generateBtn');
const message = document.getElementById('message');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const downloadBtn = document.getElementById('downloadBtn');

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function isLight(hex) {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness > 186;
}

function generatePalette() {
  const existingBoxes = Array.from(palette.children).map(box => ({
    color: box.dataset.color,
    locked: box.classList.contains('locked')
  }));

  palette.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const existing = existingBoxes[i];
    const color = existing?.locked ? existing.color : getRandomColor();
    const box = document.createElement('div');
    box.classList.add('color-box');
    if (existing?.locked) box.classList.add('locked');
    box.style.backgroundColor = color;
    box.dataset.color = color;
    box.title = `HEX: ${color.toUpperCase()} | ${isLight(color) ? 'Light' : 'Dark'} Color`;

    const hexText = document.createElement('div');
    hexText.classList.add('hex-code');
    hexText.textContent = color.toUpperCase();
    box.appendChild(hexText);

    const lockIcon = document.createElement('div');
    lockIcon.textContent = existing?.locked ? '🔒' : '🔓';
    lockIcon.style.position = 'absolute';
    lockIcon.style.top = '5px';
    lockIcon.style.right = '5px';
    lockIcon.style.fontSize = '18px';
    box.appendChild(lockIcon);

    box.addEventListener('click', () => {
      navigator.clipboard.writeText(color.toUpperCase())
        .then(() => {
          message.textContent = `${color.toUpperCase()} copied to clipboard!`;
          setTimeout(() => message.textContent = '', 2000);
        });
    });

    box.addEventListener('dblclick', () => {
      box.classList.toggle('locked');
      lockIcon.textContent = box.classList.contains('locked') ? '🔒' : '🔓';
    });

    palette.appendChild(box);
  }
}

generateBtn.addEventListener('click', generatePalette);

saveBtn.addEventListener('click', () => {
  const colors = Array.from(palette.children).map(box => box.dataset.color);
  localStorage.setItem('savedPalette', JSON.stringify(colors));
  message.textContent = 'Palette saved!';
  setTimeout(() => message.textContent = '', 2000);
});

loadBtn.addEventListener('click', () => {
  const saved = JSON.parse(localStorage.getItem('savedPalette'));
  if (saved) {
    palette.innerHTML = '';
    saved.forEach(color => {
      const box = document.createElement('div');
      box.classList.add('color-box');
      box.style.backgroundColor = color;
      box.dataset.color = color;

      const hexText = document.createElement('div');
      hexText.classList.add('hex-code');
      hexText.textContent = color.toUpperCase();
      box.appendChild(hexText);

      box.addEventListener('click', () => {
        navigator.clipboard.writeText(color.toUpperCase())
          .then(() => {
            message.textContent = `${color.toUpperCase()} copied to clipboard!`;
            setTimeout(() => message.textContent = '', 2000);
          });
      });

      palette.appendChild(box);
    });
  } else {
    message.textContent = 'No palette found!';
    setTimeout(() => message.textContent = '', 2000);
  }
});

downloadBtn.addEventListener('click', () => {
  html2canvas(palette).then(canvas => {
    const link = document.createElement('a');
    link.download = 'palette.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Initial palette
generatePalette();
