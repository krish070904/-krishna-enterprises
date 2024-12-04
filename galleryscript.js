
const search = document.querySelector(".search-box input"),
      images = document.querySelectorAll(".image-box");
const modal = document.getElementById('image-modal');
const modalImg = document.querySelector('.modal-img');
const closeModal = document.querySelector('.modal .close');
const prevButton = document.querySelector('.modal .prev');
const nextButton = document.querySelector('.modal .next');

let currentIndex = 0;
let filteredImages = Array.from(images);

// Function to show modal with specific image
function showModal(index) {
    if (index < 0 || index >= filteredImages.length) return;
    currentIndex = index;
    modal.classList.add('open');
    modal.style.display = 'block';
    modalImg.classList.add('fade-in');
    modalImg.src = filteredImages[currentIndex].querySelector('img').src;

    // Remove the fade-in effect after it runs
    setTimeout(() => modalImg.classList.remove('fade-in'), 300);
}

// Function to hide modal
function hideModal() {
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Smooth filtering of images during search
search.addEventListener("keyup", e => {
    const searchValue = search.value.toLowerCase();
    filteredImages = Array.from(images).filter(image => {
        const imageName = image.dataset.name.toLowerCase();
        const match = imageName.includes(searchValue);
        image.style.opacity = match ? "1" : "0";
        image.style.transition = "opacity 0.3s ease";
        setTimeout(() => (image.style.display = match ? "block" : "none"), 300);
        return match;
    });
});

search.addEventListener("keyup", () => {
    if (search.value === "") {
        images.forEach(image => {
            image.style.display = "block";
            image.style.opacity = "1";
        });
        filteredImages = Array.from(images);
    }
});

// Event listeners for modal navigation and closing
closeModal.addEventListener('click', hideModal);

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) showModal(currentIndex - 1);
});

nextButton.addEventListener('click', () => {
    if (currentIndex < filteredImages.length - 1) showModal(currentIndex + 1);
});

// Keyboard controls
document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'ArrowLeft' && currentIndex > 0) showModal(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < filteredImages.length - 1) showModal(currentIndex + 1);
    if (e.key === 'Escape') hideModal();
});

// Event listener for clicking on images
images.forEach((image, index) => {
    image.addEventListener('click', () => {
        const visibleImages = Array.from(images).filter(img => img.style.display !== 'none');
        currentIndex = visibleImages.indexOf(image);
        filteredImages = visibleImages;
        showModal(currentIndex);
    });
});
