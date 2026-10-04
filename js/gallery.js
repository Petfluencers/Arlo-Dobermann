document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");
  const closeButton = modal?.querySelector(".close");
  const galleryImages = document.querySelectorAll(".gallery-item img");
  let opener = null;

  if (!modal || !modalImage || !closeButton) return;

  const openModal = image => {
    opener = image;
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeButton.focus();
  };

  const closeModal = () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.src = "";
    opener?.focus();
  };

  galleryImages.forEach(image => {
    const description = image.alt ? `Expand image: ${image.alt}` : "Expand gallery image";
    image.setAttribute("aria-label", description);
    image.addEventListener("click", () => openModal(image));
    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(image);
      }
    });
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
    if (event.key === "Tab" && modal.getAttribute("aria-hidden") === "false") {
      event.preventDefault();
      closeButton.focus();
    }
  });
});
