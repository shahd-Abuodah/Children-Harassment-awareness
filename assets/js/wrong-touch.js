// Wrong Touch Page JavaScript

let selectedGender = null;

// Body parts information
const bodyPartsInfo = {
    mouth: {
        title: "الفم",
        text: "هذا فمي أستخدمه للكلام والأكل والضحك ولا يحق لأحد لمسه وإذا حدا لمسه لازم أخبر بابا وماما",
        safety: "unsafe",
        safetyText: "لمسة غير آمنة - أخبر والديك فوراً"
    },
    hand: {
        title: "اليد",
        text: "هاي إيدي مسموح أستخدمها للعب والسلام وهي لمسة صحيحة",
        safety: "safe",
        safetyText: "لمسة آمنة - مقبولة للعب والسلام"
    },
    private: {
        title: "المنطقة التناسلية",
        text: "المنطقة التي تغطيها الملابس الداخلية ممنوع حدا يلمسها أو يشوفها",
        safety: "unsafe",
        safetyText: "منطقة خاصة - ممنوع لمسها أو رؤيتها"
    },
    leg: {
        title: "الرجل",
        text: "هاي رجلي بستخدمها ألعب وأركض وعادي هي لمسة صحيحة",
        safety: "safe",
        safetyText: "لمسة آمنة - مقبولة للعب والأنشطة"
    }
};

// Select gender function
function selectGender(gender) {
    selectedGender = gender;
    
    // Update UI
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.querySelector(`[data-gender="${gender}"]`).classList.add('selected');
    
    // Show transition animation
    setTimeout(() => {
        showBodyEducation();
    }, 500);
}

// Show body education section
function showBodyEducation() {
    const genderSection = document.getElementById('genderSelection');
    const bodySection = document.getElementById('bodyEducation');
    
    // Hide gender selection with animation
    genderSection.style.opacity = '0';
    genderSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        genderSection.style.display = 'none';
        
        // Set character image based on selected gender
        const characterImage = document.getElementById('characterImage');
        if (selectedGender === 'girl') {
            characterImage.src = 'assets/images/cartoon-girl.png';
            characterImage.alt = 'شخصية البنت';
            document.getElementById('educationTitle').textContent = 'تعلمي عن جسمك';
        } else {
            characterImage.src = 'assets/images/cartoon-boy.png';
            characterImage.alt = 'شخصية الولد';
            document.getElementById('educationTitle').textContent = 'تعلم عن جسمك';
        }
        
        // Show body education section
        bodySection.style.display = 'block';
        bodySection.style.opacity = '0';
        bodySection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            bodySection.style.opacity = '1';
            bodySection.style.transform = 'translateY(0)';
        }, 100);
        
    }, 300);
}

// Show body part information
function showBodyPartInfo(part) {
    const info = bodyPartsInfo[part];
    
    // Update active states
    document.querySelectorAll('.body-part').forEach(bp => {
        bp.classList.remove('active');
    });
    
    document.querySelectorAll('.body-part-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected elements
    document.querySelector(`[data-part="${part}"]`).classList.add('active');
    document.querySelectorAll(`[data-part="${part}"]`).forEach(element => {
        element.classList.add('active');
    });
    
    // Update information display
    const infoTitle = document.getElementById('infoTitle');
    const infoText = document.getElementById('infoText');
    const safetyIndicator = document.getElementById('safetyIndicator');
    
    // Animate content change
    const infoDisplay = document.getElementById('infoDisplay');
    infoDisplay.style.transform = 'scale(0.95)';
    infoDisplay.style.opacity = '0.7';
    
    setTimeout(() => {
        infoTitle.textContent = info.title;
        infoText.textContent = info.text;
        
        // Update safety indicator
        safetyIndicator.className = `safety-indicator ${info.safety}`;
        safetyIndicator.textContent = info.safetyText;
        
        // Animate back
        infoDisplay.style.transform = 'scale(1)';
        infoDisplay.style.opacity = '1';
        
        // Add special animation for unsafe touches
        if (info.safety === 'unsafe') {
            safetyIndicator.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                safetyIndicator.style.animation = '';
            }, 500);
        }
        
    }, 150);
    
    // Play sound effect (if available)
    playClickSound();
}

// Back to gender selection
function backToGenderSelection() {
    const genderSection = document.getElementById('genderSelection');
    const bodySection = document.getElementById('bodyEducation');
    
    // Hide body education section
    bodySection.style.opacity = '0';
    bodySection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        bodySection.style.display = 'none';
        
        // Reset selections
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        selectedGender = null;
        
        // Show gender selection
        genderSection.style.display = 'block';
        genderSection.style.opacity = '0';
        genderSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            genderSection.style.opacity = '1';
            genderSection.style.transform = 'translateY(0)';
        }, 100);
        
    }, 300);
}

// Play click sound (optional)
function playClickSound() {
    // You can add audio feedback here if needed
    // const audio = new Audio('assets/sounds/click.mp3');
    // audio.play().catch(e => console.log('Audio play failed:', e));
}

// Add CSS for shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('bodyEducation').style.display !== 'none') {
                backToGenderSelection();
            }
        }
    });
    
    // Add touch support for mobile devices
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // Swipe up gesture to go back
        if (diff > 50 && document.getElementById('bodyEducation').style.display !== 'none') {
            backToGenderSelection();
        }
    });
});

