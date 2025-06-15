class ModalManager {
  constructor() {
    this.modal = document.getElementById("customModal");
    this.modalContent = this.modal.querySelector(".modal-content");
    this.messageBox = document.getElementById("modalMessage");
    this.closeBtn = this.modal.querySelector(".modal-close");
    this.queue = [];
    this.isOpen = false;

    this.closeBtn.addEventListener("click", () => this.close());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }

  show(message, type = "info") {
    this.queue.push({ message, type });
    if (!this.isOpen) this.displayNext();
  }

  displayNext() {
    if (this.queue.length === 0) return;

    const { message, type } = this.queue.shift();
    this.messageBox.textContent = message;

    // Reset modal classes and add type
    this.modalContent.className = `modal-content ${type}`;
    this.modal.classList.remove("hidden");
    this.isOpen = true;
  }

  close() {
    this.modal.classList.add("hidden");
    this.isOpen = false;

    // Wait a moment to show the next modal
    setTimeout(() => this.displayNext(), 200);
  }
}

// Init modal manager
const modal = new ModalManager();

document.getElementById("showAlertBtn").addEventListener("click", () => {
  modal.show("This is an info message!", "info");
  modal.show("This is a success message!", "success");
  modal.show("This is a warning message!", "warning");
  modal.show("This is an error message!", "error");
});
