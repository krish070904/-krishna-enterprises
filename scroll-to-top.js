/**
 * Scroll to Top Button Functionality
 * This file contains all code related to the animated scroll-to-top button
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Scroll to top button initialized');
    
    // Create the button element
    const createScrollButton = function() {
        // Create button if it doesn't exist
        if (!document.getElementById('go-to-top')) {
            const button = document.createElement('button');
            button.id = 'go-to-top';
            button.setAttribute('aria-label', 'Scroll to top');
            button.innerHTML = '<i class="fas fa-chevron-up"></i>';
            document.body.appendChild(button);
        }
    };
    
    // Add styles for the button
    const addButtonStyles = function() {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('id', 'scroll-to-top-styles');
        styleElement.textContent = `
            #go-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 55px;
                height: 55px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 9000;
            }
            
            #go-to-top:hover {
                background-color: #3d8b40;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
                transform: translateY(-3px) scale(1.05);
            }
            
            #go-to-top.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            #go-to-top i {
                transition: transform 0.3s ease;
            }
            
            #go-to-top:hover i {
                transform: translateY(-3px);
            }
            
            #go-to-top::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                transition: transform 0.3s ease;
                z-index: -1;
            }
            
            #go-to-top:hover::before {
                animation: ripple 1.2s ease-out infinite;
            }
            
            @keyframes ripple {
                0% {
                    transform: scale(0.5);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                #go-to-top {
                    width: 45px;
                    height: 45px;
                    bottom: 20px;
                    right: 20px;
                    font-size: 18px;
                }
            }
        `;
        
        // Add styles to head if not already present
        if (!document.getElementById('scroll-to-top-styles')) {
            document.head.appendChild(styleElement);
        }
    };
    
    // Initialize the button
    createScrollButton();
    addButtonStyles();
    
    const scrollButton = document.getElementById('go-to-top');
    
    // Function to toggle button visibility based on scroll position
    const toggleButtonVisibility = function() {
        if (window.scrollY > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    };
    
    // Scroll to top when button is clicked
    scrollButton.addEventListener('click', function() {
        // Add active class for click animation
        scrollButton.classList.add('active');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Remove active class after animation completes
        setTimeout(() => {
            scrollButton.classList.remove('active');
        }, 500);
    });
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', toggleButtonVisibility);
    
    // Initial check for button visibility
    toggleButtonVisibility();
}); 