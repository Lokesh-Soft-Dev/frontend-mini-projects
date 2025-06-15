const convertBtn = document.getElementById('convertBtn');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const result = document.getElementById('result');

// Realistic & consistent exchange rates (via USD base)
const exchangeRatesToUSD = {
  USD: 1,
  INR: 0.012, // 1 INR ≈ 0.012 USD
  EUR: 1.08   // 1 EUR ≈ 1.08 USD
};

convertBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    result.textContent = "Please enter a valid amount.";
    result.classList.add("show");
    return;
  }

  if (from === to) {
    result.textContent = `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;
    result.classList.add("show");
    return;
  }

  const amountInUSD = amount * exchangeRatesToUSD[from];
  const converted = amountInUSD / exchangeRatesToUSD[to];

  result.textContent = `${amount.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;
  result.classList.add("show");
});
