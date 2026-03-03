// Wrong Touch Page JavaScript

let selectedGender = null;
let currentPart = null; // remember the selected part so we can re-render on language change

// Current language helper (defined by main.js; fall back to Arabic)
function wtLang() {
    return (typeof window.getSiteLang === 'function') ? window.getSiteLang() : 'ar';
}

// Body parts information (bilingual)
const bodyPartsInfo = {
    mouth: {
        title: { ar: "الفم", en: "Mouth" },
        text: {
            ar: "هذا فمي أستخدمه للكلام والأكل والضحك ولا يحق لأحد لمسه وإذا حدا لمسه لازم أخبر بابا وماما",
            en: "This is my mouth. I use it to talk, eat and laugh. No one is allowed to touch it, and if someone does I must tell my mum and dad."
        },
        safety: "unsafe",
        safetyText: { ar: "لمسة غير آمنة - أخبر والديك فوراً", en: "Unsafe touch - tell your parents right away" }
    },
    hand: {
        title: { ar: "اليد", en: "Hand" },
        text: {
            ar: "هاي إيدي مسموح أستخدمها للعب والسلام وهي لمسة صحيحة",
            en: "This is my hand. I'm allowed to use it to play and to shake hands - that's a good touch."
        },
        safety: "safe",
        safetyText: { ar: "لمسة آمنة - مقبولة للعب والسلام", en: "Safe touch - okay for playing and shaking hands" }
    },
    private: {
        title: { ar: "المنطقة التناسلية", en: "Private Area" },
        text: {
            ar: "المنطقة التي تغطيها الملابس الداخلية ممنوع حدا يلمسها أو يشوفها",
            en: "The area covered by underwear - no one is allowed to touch it or look at it."
        },
        safety: "unsafe",
        safetyText: { ar: "منطقة خاصة - ممنوع لمسها أو رؤيتها", en: "Private area - must not be touched or seen" }
    },
    chest: {
        title: { ar: "الصدر", en: "Chest" },
        text: {
            ar: "الصدر منطقة خاصة ويجب عدم لمسها أو النظر إليها بدون إذن. إذا حدث ذلك، أخبر والديك فوراً.",
            en: "The chest is a private area that must not be touched or looked at without permission. If that happens, tell your parents right away."
        },
        safety: "unsafe",
        safetyText: { ar: "لمسة غير آمنة - أخبر والديك فوراً", en: "Unsafe touch - tell your parents right away" }
    },
    leg: {
        title: { ar: "الرجل", en: "Leg" },
        text: {
            ar: "هاي رجلي بستخدمها ألعب وأركض وعادي هي لمسة صحيحة",
            en: "This is my leg. I use it to play and run - that's a good touch."
        },
        safety: "safe",
        safetyText: { ar: "لمسة آمنة - مقبولة للعب والأنشطة", en: "Safe touch - okay for playing and activities" }
    }
};

// Education title per gender and language
const educationTitles = {
    girl: { ar: 'تعلمي عن جسمك', en: 'Learn About Your Body' },
    boy: { ar: 'تعلم عن جسمك', en: 'Learn About Your Body' }
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
        const lang = wtLang();
        if (selectedGender === 'girl') {
            characterImage.src = 'assets/images/cartoon-girl.png';
            characterImage.alt = lang === 'en' ? 'Girl character' : 'شخصية البنت';
            document.getElementById('educationTitle').textContent = educationTitles.girl[lang];
        } else {
            characterImage.src = 'assets/images/cartoon-boy.png';
            characterImage.alt = lang === 'en' ? 'Boy character' : 'شخصية الولد';
            document.getElementById('educationTitle').textContent = educationTitles.boy[lang];
        }
        // Show chest area/button only for girl
        const chestAreas = document.querySelectorAll('.chest-area');
        const chestButtons = document.querySelectorAll('.body-part-btn[data-part="chest"]');
        if (selectedGender === 'girl') {
            chestAreas.forEach(el => el.style.display = 'block');
            chestButtons.forEach(el => el.style.display = 'inline-flex');
        } else {
            chestAreas.forEach(el => el.style.display = 'none');
            chestButtons.forEach(el => el.style.display = 'none');
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
    currentPart = part;
    const lang = wtLang();

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
    
    if (info.safety === 'unsafe') {
    playWrongSound();   // الفم + المنطقة التناسلية
    } 
    else {
    playRightSound();   // اليد + الرجل
    }
    // Animate content change
    const infoDisplay = document.getElementById('infoDisplay');
    infoDisplay.style.transform = 'scale(0.95)';
    infoDisplay.style.opacity = '0.7';
    
    setTimeout(() => {
        infoTitle.textContent = info.title[lang];
        infoText.textContent = info.text[lang];

        // Update safety indicator
        safetyIndicator.className = `safety-indicator ${info.safety}`;
        safetyIndicator.textContent = info.safetyText[lang];
        
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

    const target = document.getElementById('parts_section');
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });}  
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
        // Hide chest area/button when leaving body view
        document.querySelectorAll('.chest-area').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.body-part-btn[data-part="chest"]').forEach(el => el.style.display = 'none');

        selectedGender = null;
        currentPart = null;
        
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
function playWrongSound() {
    // You can add audio feedback here if needed
    const audio = new Audio('assets/sounds/wrong.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
}
function playRightSound() {
    // You can add audio feedback here if needed
    const audio = new Audio('assets/sounds/right.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
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

// Re-render dynamic content when the site language changes
document.addEventListener('sitelangchange', function (e) {
    const lang = (e.detail && e.detail.lang) || wtLang();

    // Update the "learn about your body" title if the body view is shown
    const eduTitle = document.getElementById('educationTitle');
    if (eduTitle && selectedGender) {
        eduTitle.textContent = educationTitles[selectedGender][lang];
    }

    // Re-render the currently selected body part (main.js reset it to the default prompt)
    if (currentPart) {
        const info = bodyPartsInfo[currentPart];
        const infoTitle = document.getElementById('infoTitle');
        const infoText = document.getElementById('infoText');
        const safetyIndicator = document.getElementById('safetyIndicator');
        if (infoTitle) infoTitle.textContent = info.title[lang];
        if (infoText) infoText.textContent = info.text[lang];
        if (safetyIndicator) {
            safetyIndicator.className = `safety-indicator ${info.safety}`;
            safetyIndicator.textContent = info.safetyText[lang];
        }
    }
});

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
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {

    window.addEventListener("scroll", function() {
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    scrollTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


