document.addEventListener('DOMContentLoaded', function() {
    // Get references to key elements
    const searchInput = document.getElementById('searchInput');
    const carouselWrapper = document.getElementById('carouselWrapper');
    
    if (!searchInput || !carouselWrapper) {
        console.error('Search input or carousel wrapper not found');
        return;
    }
    
    // Get all carousel sections and store their original order
    const allCarousels = Array.from(carouselWrapper.querySelectorAll('.carousel-section'));
    const originalOrder = [...allCarousels]; // Store original order for reset
    
    console.log(`Found ${allCarousels.length} carousels`);
    
    // Store carousel information for searching
    const carouselData = allCarousels.map(carousel => {
        // Get title text
        const titleElement = carousel.querySelector('.carousel-title');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        // Get category
        const category = carousel.getAttribute('data-category') || '';
        
        // Get overlay text
        const overlayElement = carousel.querySelector('.carousel-overlay');
        const overlay = overlayElement ? overlayElement.textContent.trim() : '';
        
        // Combine all searchable content
        const searchableContent = `${title} ${category} ${overlay}`.toLowerCase();
        
        return {
            element: carousel,
            title: title,
            category: category,
            searchableContent: searchableContent,
            originalIndex: originalOrder.indexOf(carousel)
        };
    });
    
    // Add basic style for search status
    if (!document.head.querySelector('style[data-id="search-basic"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-id', 'search-basic');
        style.textContent = `
            .highlight {
                background-color: yellow;
                padding: 2px 0;
            }
            
            .carousel-section.hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create status message element if it doesn't exist
    let statusMessage = document.getElementById('searchStatusMessage');
    if (!statusMessage) {
        statusMessage = document.createElement('div');
        statusMessage.id = 'searchStatusMessage';
        // Insert after search box
        const searchBox = document.querySelector('.search-box');
        if (searchBox && searchBox.parentNode) {
            searchBox.parentNode.insertBefore(statusMessage, searchBox.nextSibling);
        }
    }
    
    // Function to perform the search
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // If search is empty, restore original order and show all
        if (!searchTerm) {
            // Reset to original display
            originalOrder.forEach(carousel => {
                carousel.style.display = 'block';
                
                // Remove any highlight spans
                const highlights = carousel.querySelectorAll('.highlight');
                highlights.forEach(highlight => {
                    const parent = highlight.parentNode;
                    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                    parent.normalize();
                });
            });
            
            // Restore original DOM order
            for (let i = 0; i < originalOrder.length; i++) {
                carouselWrapper.appendChild(originalOrder[i]);
            }
            
            statusMessage.style.display = 'none';
            return;
        }
        
        // Find matching items
        let matchingItems = [];
        let nonMatchingItems = [];
        
        carouselData.forEach(data => {
            const match = data.searchableContent.includes(searchTerm);
            
            // Remove any existing highlights
            const highlights = data.element.querySelectorAll('.highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
            
            if (match) {
                matchingItems.push({
                    element: data.element,
                    relevance: data.searchableContent.indexOf(searchTerm),
                    originalIndex: data.originalIndex
                });
                
                // Highlight matching text
                highlightMatches(data.element, searchTerm);
            } else {
                nonMatchingItems.push({
                    element: data.element,
                    originalIndex: data.originalIndex
                });
            }
        });
        
        // Sort matching items by relevance
        matchingItems.sort((a, b) => a.relevance - b.relevance);
        
        // Sort non-matching items by original order
        nonMatchingItems.sort((a, b) => a.originalIndex - b.originalIndex);
        
        // Remove all carousels from the wrapper
        while (carouselWrapper.firstChild) {
            carouselWrapper.removeChild(carouselWrapper.firstChild);
        }
        
        // First add all matching items in sorted order
        matchingItems.forEach(item => {
            item.element.style.display = 'block';
            carouselWrapper.appendChild(item.element);
        });
        
        // Then add all non-matching items (hidden)
        nonMatchingItems.forEach(item => {
            item.element.style.display = 'none';
            carouselWrapper.appendChild(item.element);
        });
        
        // Update status message
        if (matchingItems.length === 0) {
            statusMessage.textContent = 'No matching parts found';
            statusMessage.style.display = 'block';
        } else {
            statusMessage.textContent = `Found ${matchingItems.length} matching part${matchingItems.length !== 1 ? 's' : ''}`;
            statusMessage.style.display = 'block';
        }
        
        // Scroll to the top of the results if we have matches
        if (matchingItems.length > 0) {
        window.scrollTo({
                top: statusMessage.offsetTop - 20,
          behavior: 'smooth'
            });
        }
    }
    
    // Function to highlight matches in an element
    function highlightMatches(element, searchTerm) {
        const textNodes = getTextNodes(element);
        
        textNodes.forEach(node => {
            const text = node.nodeValue;
            const lowerText = text.toLowerCase();
            let startIndex = 0;
            let index;
            
            // Create a document fragment to hold the highlighted text
            const fragment = document.createDocumentFragment();
            
            // Find all instances of the search term
            while ((index = lowerText.indexOf(searchTerm, startIndex)) !== -1) {
                // Add text before the match
                if (index > startIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(startIndex, index)));
                }
                
                // Create a span for the match
                const highlightSpan = document.createElement('span');
                highlightSpan.className = 'highlight';
                highlightSpan.textContent = text.substring(index, index + searchTerm.length);
                fragment.appendChild(highlightSpan);
                
                // Update the start index for the next iteration
                startIndex = index + searchTerm.length;
            }
            
            // Add any remaining text
            if (startIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(startIndex)));
            }
            
            // Only replace if we found matches
            if (startIndex > 0) {
                node.parentNode.replaceChild(fragment, node);
            }
        });
    }
    
    // Helper function to get all text nodes in an element
    function getTextNodes(element) {
        const textNodes = [];
        const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        
        let node;
        while (node = walk.nextNode()) {
            // Skip empty text nodes and nodes inside script/style tags
            if (node.nodeValue.trim() !== '' && 
                !['SCRIPT', 'STYLE'].includes(node.parentNode.tagName)) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }
    
    // Add event listener for input changes
    searchInput.addEventListener('input', performSearch);
    
    // Initialize search (show all carousels)
    performSearch();
  });