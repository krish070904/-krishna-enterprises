document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixing footers - starting');
    
    // Create styles for proper positioning
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
        
        /* Hide search status message */
        #searchStatusMessage {
            display: none !important;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Helper function to remove comments containing specific text
    function removeCommentsContaining(text) {
        const iterator = document.createNodeIterator(
            document.documentElement,
            NodeFilter.SHOW_COMMENT,
            { acceptNode: node => node.nodeValue.includes(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
        );
        
        const comments = [];
        let currentNode;
        
        while (currentNode = iterator.nextNode()) {
            comments.push(currentNode);
        }
        
        comments.forEach(comment => {
            if (comment.parentNode) {
                comment.parentNode.removeChild(comment);
            }
        });
    }
    
    // 1. Remove common comment wrappers that can cause issues
    removeCommentsContaining('container-top');
    removeCommentsContaining('container-bottom');
    
    // 2. Find the main wrapper and important structural elements
    const carouselWrapper = document.getElementById('carouselWrapper');
    
    if (!carouselWrapper) {
        console.error('Carousel wrapper not found, cannot fix layout');
        return;
    }
    
    // 3. Create or find footer container
    let contentWrapper = document.body;
    let ctaFooterContent = document.querySelector('.cta-footer');
    
    if (!ctaFooterContent) {
        ctaFooterContent = document.createElement('div');
        ctaFooterContent.className = 'cta-footer';
        ctaFooterContent.innerHTML = `
            <h2>Let's Talk</h2>
            <p>We would love to hear from you!</p>
            <button class="cta-button" onclick="window.location.href='index.html#contact'">Get in Touch</button>
        `;
    }
    
    // 4. Handle the footer
    let mainFooter = document.querySelector('footer');
    
    if (!mainFooter) {
        // Find the footer div with sb-footer ID
        const sbFooter = document.getElementById('sb-footer');
        
        if (sbFooter) {
            mainFooter = sbFooter;
        } else {
            // Create a basic footer if missing
            mainFooter = document.createElement('footer');
            mainFooter.innerHTML = `
                <div class="footer-container">
                    <div class="footer-logo">
                        <p>Krishna Enterprises</p>
                        <p>Your Trusted Partner</p>
                    </div>
                    <div class="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                            <li><a href="index.html#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-contact">
                        <h3>Contact Us</h3>
                        <p><i class="fas fa-phone"></i> +91 9623082674</p>
                        <p><i class="fas fa-envelope"></i> info@krishnaenterprises.com</p>
                        <p><i class="fas fa-map-marker-alt"></i> Nashik, Maharashtra, India</p>
                    </div>
                    <div class="footer-social">
                        <h3>Follow Us</h3>
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/krishna_enterprises_ofcl"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Krishna Enterprises. All Rights Reserved.</p>
                </div>
            `;
        }
    }
    
    // 5. Remove elements with IDs meant for other pages
    const closeDiv = document.getElementById('closeFiltersMobile');
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
    
    console.log('Footers positioned');
}); 