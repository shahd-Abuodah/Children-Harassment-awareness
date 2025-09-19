// Q&A Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page animations
    initializeAnimations();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Setup emergency contact functionality
    setupEmergencyContact();
    
    // Add accessibility features
    addAccessibilityFeatures();
});

// Initialize animations
function initializeAnimations() {
    // Stagger animation for Q&A cards
    const qaCards = document.querySelectorAll('.qa-card');
    qaCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.qa-card, .notes-card, .emergency-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Add interactive features
function addInteractiveFeatures() {
    // Add click-to-expand functionality for instruction items
    const instructionItems = document.querySelectorAll('.instruction-item');
    instructionItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            // Add visual feedback
            const number = this.querySelector('.instruction-number');
            number.style.transform = 'scale(1.1)';
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Add smooth scrolling for internal navigation
    const qaCards = document.querySelectorAll('.qa-card');
    qaCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Only scroll if not clicking on interactive elements
            if (!e.target.closest('.instruction-item')) {
                const nextCard = qaCards[index + 1];
                if (nextCard) {
                    nextCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Setup emergency contact functionality
function setupEmergencyContact() {
    const phoneNumber = document.querySelector('.emergency-card .phone-number');
    
    if (phoneNumber) {
        // Make phone number clickable
        phoneNumber.addEventListener('click', function() {
            // Try to initiate call
            window.location.href = 'tel:1800900700';
            
            // Show confirmation message
            showNotification('جاري الاتصال بخط المساعدة...', 'success');
        });
        
        // Add visual feedback
        phoneNumber.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        phoneNumber.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add accessibility
        phoneNumber.setAttribute('role', 'button');
        phoneNumber.setAttribute('tabindex', '0');
        phoneNumber.setAttribute('aria-label', 'اضغط للاتصال بخط المساعدة');
    }
}

// Add accessibility features
function addAccessibilityFeatures() {
    // Keyboard navigation for instruction items
    const instructionItems = document.querySelectorAll('.instruction-item');
    instructionItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('.instruction-item, .emergency-card .phone-number');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid #4299e1';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Add skip navigation
    addSkipNavigation();
}

// Add skip navigation for accessibility
function addSkipNavigation() {
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.textContent = 'تخطي إلى المحتوى الرئيسي';
    skipNav.className = 'skip-nav';
    
    // Style the skip navigation
    const skipNavStyle = document.createElement('style');
    skipNavStyle.textContent = `
        .skip-nav {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        }
        
        .skip-nav:focus {
            top: 6px;
        }
    `;
    
    document.head.appendChild(skipNavStyle);
    document.body.insertBefore(skipNav, document.body.firstChild);
    
    // Add id to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    const notificationStyle = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : '#4299e1'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.style.cssText = notificationStyle;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const animationStyle = document.createElement('style');
        animationStyle.id = 'notification-styles';
        animationStyle.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animationStyle);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add print functionality
function addPrintFunctionality() {
    const printButton = document.createElement('button');
    printButton.textContent = '🖨️ طباعة الدليل';
    printButton.className = 'print-button';
    
    const printButtonStyle = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #4299e1;
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(66, 153, 225, 0.4);
        transition: all 0.3s ease;
        z-index: 100;
    `;
    
    printButton.style.cssText = printButtonStyle;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    printButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 20px rgba(66, 153, 225, 0.6)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(66, 153, 225, 0.4)';
    });
    
    document.body.appendChild(printButton);
}

// Initialize print functionality
addPrintFunctionality();

