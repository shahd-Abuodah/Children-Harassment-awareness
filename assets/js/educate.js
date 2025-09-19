// Educate Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page features
    initializeAnimations();
    addInteractiveFeatures();
    setupEmergencyContact();
    addAccessibilityFeatures();
    addProgressTracking();
});

// Initialize animations
function initializeAnimations() {
    // Stagger animation for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
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
                
                // Special animation for sign items
                if (entry.target.classList.contains('sign-item')) {
                    animateSignItem(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.category-card, .action-card, .resources-card, .sign-item, .step-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Animate sign items with special effects
function animateSignItem(item) {
    const indicator = item.querySelector('.sign-indicator');
    if (indicator) {
        setTimeout(() => {
            indicator.style.animation = 'pulse 2s infinite';
        }, 500);
    }
}

// Add interactive features
function addInteractiveFeatures() {
    // Add click-to-highlight functionality for sign items
    const signItems = document.querySelectorAll('.sign-item');
    signItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            signItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show detailed information (if available)
            showSignDetails(this);
            
            // Add visual feedback
            const indicator = this.querySelector('.sign-indicator');
            if (indicator) {
                indicator.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    indicator.style.transform = 'scale(1)';
                }, 300);
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-15px)';
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
    
    // Add click functionality for step items
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            // Add visual feedback
            const number = this.querySelector('.step-number');
            number.style.transform = 'scale(1.2)';
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Add smooth scrolling between sections
    addSectionNavigation();
}

// Show detailed information for signs
function showSignDetails(signItem) {
    const title = signItem.querySelector('h4').textContent;
    const description = signItem.querySelector('p').textContent;
    
    // Create or update details panel
    let detailsPanel = document.getElementById('signDetailsPanel');
    if (!detailsPanel) {
        detailsPanel = createDetailsPanel();
    }
    
    updateDetailsPanel(detailsPanel, title, description);
    showDetailsPanel(detailsPanel);
}

// Create details panel
function createDetailsPanel() {
    const panel = document.createElement('div');
    panel.id = 'signDetailsPanel';
    panel.className = 'details-panel';
    
    panel.innerHTML = `
        <div class="details-content">
            <button class="close-details" onclick="hideDetailsPanel()">×</button>
            <h3 id="detailsTitle"></h3>
            <p id="detailsDescription"></p>
            <div class="details-actions">
                <button class="details-btn primary" onclick="contactSpecialist()">تواصل مع مختص</button>
                <button class="details-btn secondary" onclick="saveToNotes()">حفظ في الملاحظات</button>
            </div>
        </div>
        <div class="details-overlay" onclick="hideDetailsPanel()"></div>
    `;
    
    // Add styles
    const panelStyles = `
        .details-panel {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .details-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .details-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            position: relative;
            z-index: 1001;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            animation: slideInUp 0.3s ease-out;
        }
        
        .close-details {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #718096;
            transition: color 0.3s ease;
        }
        
        .close-details:hover {
            color: #e53e3e;
        }
        
        .details-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        
        .details-btn {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .details-btn.primary {
            background: #e53e3e;
            color: white;
        }
        
        .details-btn.primary:hover {
            background: #c53030;
            transform: translateY(-2px);
        }
        
        .details-btn.secondary {
            background: #edf2f7;
            color: #4a5568;
        }
        
        .details-btn.secondary:hover {
            background: #e2e8f0;
            transform: translateY(-2px);
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    if (!document.getElementById('detailsPanelStyles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'detailsPanelStyles';
        styleSheet.textContent = panelStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(panel);
    return panel;
}

// Update details panel content
function updateDetailsPanel(panel, title, description) {
    panel.querySelector('#detailsTitle').textContent = title;
    panel.querySelector('#detailsDescription').textContent = description;
}

// Show details panel
function showDetailsPanel(panel) {
    panel.style.display = 'flex';
    setTimeout(() => {
        panel.style.opacity = '1';
    }, 10);
}

// Hide details panel
function hideDetailsPanel() {
    const panel = document.getElementById('signDetailsPanel');
    if (panel) {
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }
}

// Contact specialist function
function contactSpecialist() {
    window.location.href = 'tel:1800900700';
    hideDetailsPanel();
}

// Save to notes function
function saveToNotes() {
    const title = document.getElementById('detailsTitle').textContent;
    const description = document.getElementById('detailsDescription').textContent;
    
    // Save to localStorage
    let notes = JSON.parse(localStorage.getItem('childSafetyNotes') || '[]');
    notes.push({
        title: title,
        description: description,
        timestamp: new Date().toISOString(),
        type: 'sign'
    });
    localStorage.setItem('childSafetyNotes', JSON.stringify(notes));
    
    showNotification('تم حفظ الملاحظة بنجاح', 'success');
    hideDetailsPanel();
}

// Add section navigation
function addSectionNavigation() {
    // Create floating navigation
    const nav = document.createElement('div');
    nav.className = 'floating-nav';
    nav.innerHTML = `
        <button class="nav-btn" data-target="physical-signs" title="العلامات الجسدية">🩺</button>
        <button class="nav-btn" data-target="behavioral-signs" title="العلامات السلوكية">🧠</button>
        <button class="nav-btn" data-target="action-steps" title="خطوات العمل">🚨</button>
        <button class="nav-btn" data-target="resources" title="المصادر">📚</button>
    `;
    
    // Add styles for floating nav
    const navStyles = `
        .floating-nav {
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 100;
        }
        
        .nav-btn {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            font-size: 1.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .nav-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .nav-btn.active {
            background: #4299e1;
            color: white;
        }
        
        @media (max-width: 768px) {
            .floating-nav {
                display: none;
            }
        }
    `;
    
    if (!document.getElementById('floatingNavStyles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'floatingNavStyles';
        styleSheet.textContent = navStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(nav);
    
    // Add click handlers
    nav.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const section = document.querySelector(`.${target}`);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup emergency contact
function setupEmergencyContact() {
    const phoneNumber = document.querySelector('.emergency-card .phone-number');
    
    if (phoneNumber) {
        phoneNumber.addEventListener('click', function() {
            window.location.href = 'tel:1800900700';
            showNotification('جاري الاتصال بخط المساعدة...', 'success');
        });
        
        phoneNumber.setAttribute('role', 'button');
        phoneNumber.setAttribute('tabindex', '0');
        phoneNumber.setAttribute('aria-label', 'اضغط للاتصال بخط المساعدة');
    }
}

// Add accessibility features
function addAccessibilityFeatures() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideDetailsPanel();
        }
    });
    
    // Focus management
    const focusableElements = document.querySelectorAll('.sign-item, .step-item, .resource-item');
    focusableElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Add progress tracking
function addProgressTracking() {
    // Track which signs have been viewed
    let viewedSigns = new Set();
    
    const signItems = document.querySelectorAll('.sign-item');
    signItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            viewedSigns.add(index);
            updateProgress();
        });
    });
    
    function updateProgress() {
        const progress = (viewedSigns.size / signItems.length) * 100;
        
        // Create or update progress bar
        let progressBar = document.getElementById('readingProgress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'readingProgress';
            progressBar.innerHTML = `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">تقدم القراءة: ${Math.round(progress)}%</span>
                </div>
            `;
            
            // Add progress bar styles
            const progressStyles = `
                #readingProgress {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                    z-index: 100;
                }
                
                .progress-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .progress-bar {
                    width: 100px;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: #38a169;
                    transition: width 0.3s ease;
                    width: ${progress}%;
                }
                
                .progress-text {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #4a5568;
                }
            `;
            
            if (!document.getElementById('progressStyles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'progressStyles';
                styleSheet.textContent = progressStyles;
                document.head.appendChild(styleSheet);
            }
            
            document.body.appendChild(progressBar);
        } else {
            progressBar.querySelector('.progress-fill').style.width = `${progress}%`;
            progressBar.querySelector('.progress-text').textContent = `تقدم القراءة: ${Math.round(progress)}%`;
        }
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

