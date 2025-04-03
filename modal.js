/**
 * Carousel Image Modal Functionality
 * This file contains all code related to the modal popup for viewing carousel images
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal image viewer initialized');
    
    // Create required CSS styles for the modal
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'modal-styles');
    styleElement.textContent = `
        /* Modal for image viewing */
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            justify-content: center;
            align-items: center;
            transition: opacity 0.3s ease;
        }
        
        .modal-content {
            position: relative;
            background-color: transparent;
            max-width: 90%;
            max-height: 90%;
            animation: zoomIn 0.3s ease;
            border-radius: 4px;
            overflow: hidden;
        }
        
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .modal-image {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            border-radius: 4px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        }
        
        .modal-description {
            padding: 15px;
            color: white;
            text-align: center;
            font-size: 16px;
            background-color: rgba(0, 0, 0, 0.5);
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
        }
        
        .close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        
        .close:hover {
            color: #3498db;
        }
        
        /* Gallery item styling for clickability */
        .gallery-item {
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            position: relative;
            overflow: hidden;
        }
        
        .gallery-item:hover {
            transform: scale(1.03);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1;
        }
    `;
    
    // Add styles to head if not already present
    if (!document.getElementById('modal-styles')) {
        document.head.appendChild(styleElement);
    }
    
    // Create the modal element if it doesn't exist
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="" alt="Modal Image" class="modal-image" />
                <div class="modal-description"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Get modal elements
    const modalImage = modal.querySelector('.modal-image');
    const modalDescription = modal.querySelector('.modal-description');
    const closeBtn = modal.querySelector('.close');
    
    // Function to attach click event listeners to all gallery items
    function attachModalListeners() {
        // Get all gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Remove existing listeners by cloning and replacing
        galleryItems.forEach(item => {
            // Clone the item to remove any existing event listeners
            const newItem = item.cloneNode(true);
            if (item.parentNode) {
                item.parentNode.replaceChild(newItem, item);
            }
            
            // Add click event listener to the new item
            newItem.addEventListener('click', function(e) {
                const img = this.querySelector('img');
                if (img) {
                    const src = img.getAttribute('src');
                    const desc = this.getAttribute('data-description') || 'No description available';
                    
                    // Set modal content
                    modalImage.setAttribute('src', src);
                    modalDescription.textContent = desc;
                    
                    // Display the modal
                    modal.style.display = 'flex';
                    
                    // Prevent event bubbling
                    e.stopPropagation();
                }
            });
        });
    }
    
    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the image
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add keyboard navigation for modal
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
    
    // Make function globally available for search functionality
    window.attachGalleryModalListeners = attachModalListeners;
    
    // Initial attachment of modal listeners
    attachModalListeners();
    
    // Handle search events by reattaching listeners after search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Wait a brief moment for search results to update
            setTimeout(attachModalListeners, 100);
        });
    }
}); 