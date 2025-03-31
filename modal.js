document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const modal = document.getElementById("modal");
  const modalImage = document.querySelector(".modal-image");
  const modalDescription = document.querySelector(".modal-description");
  const closeModal = document.querySelector(".close");
  const modalContent = modal.querySelector('.modal-content');

  // Constants
  const ESC_KEY = 'Escape';
  const MODAL_OPEN_CLASS = 'modal-open';

  // Utility functions
  const toggleModal = (show) => {
      modal.style.display = show ? "flex" : "none";
      document.body.classList.toggle(MODAL_OPEN_CLASS, show);
  };

  const loadImage = (src, desc) => {
      modalImage.style.opacity = '0';
      
      const img = new Image();
      img.onload = () => {
          modalImage.src = src;
          modalImage.style.opacity = '1';
          modalDescription.textContent = desc;
          toggleModal(true);
      };
      img.src = src;
  };

  // Event handlers
  const handleClose = () => toggleModal(false);
  
  const handleGalleryClick = (event) => {
      const galleryItem = event.currentTarget;
      const img = galleryItem.querySelector("img");
      const src = img.getAttribute("src");
      const desc = galleryItem.getAttribute("data-description") || "No description available.";
      loadImage(src, desc);
  };

  const handleWindowClick = (event) => {
      if (event.target === modal) handleClose();
  };

  const handleKeydown = (event) => {
      if (event.key === ESC_KEY && modal.style.display === "flex") handleClose();
  };

  const handleResize = () => {
      if (modal.style.display === "flex") {
          modalImage.style.maxHeight = `${window.innerHeight * 0.7}px`;
      }
  };

  // Event listeners
  document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", handleGalleryClick);
  });

  closeModal.addEventListener("click", handleClose);
  window.addEventListener("click", handleWindowClick);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
  modalContent.addEventListener("click", (event) => event.stopPropagation());
});