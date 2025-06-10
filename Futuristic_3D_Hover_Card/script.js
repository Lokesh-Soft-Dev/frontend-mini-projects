document.addEventListener("DOMContentLoaded", () => {
  const cardInner = document.querySelector(".card-inner");
  const flipBackBtn = document.querySelector("button");

  if (flipBackBtn && cardInner) {
    flipBackBtn.addEventListener("click", () => {
      cardInner.style.transform = "rotateY(0deg)";
    });
  }
});
