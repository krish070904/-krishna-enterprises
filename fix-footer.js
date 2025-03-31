document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixing footers and enhancing image viewer - starting');
    
    // Create styles for proper positioning and image viewing
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        
        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        #carouselWrapper {
            flex: 1 0 auto;
            padding-bottom: 30px;
            width: 100%;
        }
        
        .cta-footer {
            width: 100%;
            text-align: center;
            padding: 30px 20px;
            background: #f5f5f5;
            border-top: 2px solid #eaeaea;
            margin-top: auto;
        }
        
        .cta-footer h2 {
            margin-top: 0;
            color: #333;
        }
        
        .cta-footer .cta-button {
            background: #3498db;
            color: white;
            padding: 10px 25px;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 15px;
        }
        
        footer {
            width: 100%;
            flex-shrink: 0;
            margin-top: 0 !important;
        }
        
        /* Enhanced modal for image viewing */
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
        
        /* Hide search status message */
        #searchStatusMessage {
            display: none !important;
        }
        
        /* Make gallery items clickable */
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
    document.head.appendChild(styleElement);
    
    // 1. First ensure all carousels are in the carouselWrapper
    const carouselWrapper = document.getElementById('carouselWrapper');
    if (carouselWrapper) {
        const carouselSections = document.querySelectorAll('.carousel-section');
        carouselSections.forEach(section => {
            if (section.parentNode !== carouselWrapper) {
                carouselWrapper.appendChild(section);
            }
        });
    }
    
    console.log('Organized carousels');
    
    // 2. Find and extract the CTA footer content
    let ctaFooterContent = document.querySelector('.cta-footer');
    if (!ctaFooterContent) {
        // Create CTA footer if it doesn't exist
        ctaFooterContent = document.createElement('div');
        ctaFooterContent.className = 'cta-footer';
        ctaFooterContent.innerHTML = `
            <h2>Let's Talk</h2>
            <p>We would love to hear from you!</p>
            <button class="cta-button" onclick="window.location.href='index.html#contact'">Get in Touch</button>
        `;
    }
    
    // 3. Find and extract the main footer
    let mainFooter = document.querySelector('footer');
    if (!mainFooter) {
        // Create main footer if it doesn't exist
        mainFooter = document.createElement('footer');
        mainFooter.innerHTML = `
            <div class="footer-container">
                <div class="footer-section">
                    <h3>Krishna Enterprises</h3>
                    <p>Your Trusted Engineering Partner</p>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p>+91 9623082674</p>
                    <p>info@krishnaenterprises.com</p>
                    <p>Nashik, Maharashtra, India</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Krishna Enterprises. All Rights Reserved.</p>
            </div>
        `;
    }
    
    // 4. Remove any existing footers and CTA footers from DOM to avoid duplicates
    document.querySelectorAll('.cta-footer').forEach(el => {
        if (el !== ctaFooterContent) el.remove();
    });
    
    document.querySelectorAll('footer').forEach(el => {
        if (el !== mainFooter) el.remove();
    });
    
    // 5. Remove any comments related to CTA footer that might interfere
    function removeCommentsContaining(text) {
        const commentNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes(text)) {
                commentNodes.push(node);
            }
        }
        
        commentNodes.forEach(node => node.remove());
    }
    
    removeCommentsContaining('CTA FOOTER');
    
    // 6. Find the root container where we'll append our content
    let contentWrapper = document.body;
    
    // 7. Now build the page structure correctly
    // First clear any problematic divs that might be causing issues
    const closeDiv = document.querySelector('#sb-footer');
    if (closeDiv) closeDiv.remove();
    
    // Get popup element
    const popupDiv = document.getElementById('sb-popup');
    if (popupDiv) popupDiv.remove(); // Remove temporarily to re-add in the right order
    
    // Now append everything in the correct order
    if (carouselWrapper && carouselWrapper.parentNode) {
        contentWrapper = carouselWrapper.parentNode;
    }
    
    // Remove elements from their current position
    if (ctaFooterContent.parentNode) ctaFooterContent.parentNode.removeChild(ctaFooterContent);
    if (mainFooter.parentNode) mainFooter.parentNode.removeChild(mainFooter);
    
    // Append in correct order to content wrapper
    contentWrapper.appendChild(carouselWrapper);
    contentWrapper.appendChild(ctaFooterContent);
    contentWrapper.appendChild(mainFooter);
    
    // Add popup at the end
    if (popupDiv) contentWrapper.appendChild(popupDiv);
    
    // Make sure search status message is hidden
    const searchStatusMessage = document.getElementById('searchStatusMessage');
    if (searchStatusMessage) {
        searchStatusMessage.style.display = 'none';
    }
    
    // 8. Enhance image viewing functionality
    // Make sure we have a modal
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
    
    // Set up the modal functionality
    const modalImage = modal.querySelector('.modal-image');
    const modalDescription = modal.querySelector('.modal-description');
    const closeBtn = modal.querySelector('.close');
    
    // Set up click events for all gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                const src = img.getAttribute('src');
                const desc = item.getAttribute('data-description') || 'No description available.';
                
                modalImage.setAttribute('src', src);
                modalDescription.textContent = desc;
                modal.style.display = 'flex';
            }
        });
    });
    
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
    
    console.log('Footers positioned and image viewer enhanced');
}); 