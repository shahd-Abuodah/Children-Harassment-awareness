// Chatbot JavaScript — talks to the model through window.callAI (assets/js/ai.js),
// which handles the token locally and via the /api/ai proxy when deployed.

// Chat state
let chatHistory = [];
let isTyping = false;

// Current language helper (defined by main.js; fall back to Arabic)
function cbLang() {
    return (typeof window.getSiteLang === 'function') ? window.getSiteLang() : 'ar';
}

// UI strings for dynamically generated chat content
const chatStrings = {
    typing: { ar: 'المساعد يكتب', en: 'The assistant is typing' },
    clearConfirm: { ar: 'هل أنت متأكد من أنك تريد مسح المحادثة؟', en: 'Are you sure you want to clear the conversation?' },
    calling: { ar: 'جاري الاتصال بخط المساعدة...', en: 'Calling the helpline...' },
    cleared: { ar: 'تم مسح المحادثة', en: 'Conversation cleared' },
    noMessages: { ar: 'لا توجد رسائل لتصديرها', en: 'There are no messages to export' },
    exported: { ar: 'تم تصدير المحادثة بنجاح', en: 'Conversation exported successfully' },
    fallback: {
        ar: `عذراً، حدث خطأ في الاتصال. يمكنك:

• المحاولة مرة أخرى
• الاتصال بخط المساعدة: 1800 900 700
• تصفح الأقسام الأخرى في الموقع للحصول على معلومات مفيدة

أنا هنا لمساعدتك عندما تكون الخدمة متاحة.`,
        en: `Sorry, a connection error occurred. You can:

• Try again
• Call the helpline: 1800 900 700
• Browse the other sections of the site for useful information

I'm here to help you when the service is available.`
    }
};
function cbStr(key) {
    const s = chatStrings[key];
    return s ? (s[cbLang()] || s.ar) : '';
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
    setupEventListeners();
    loadChatHistory();
});

// Initialize chatbot functionality
function initializeChatbot() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Enable send button when input has content
    userInput.addEventListener('input', function() {
        const hasContent = this.value.trim().length > 0;
        sendButton.disabled = !hasContent;
        
        // Update character count
        const charCount = document.querySelector('.char-count');
        charCount.textContent = `${this.value.length}/500`;
        
        // Change color based on character limit
        if (this.value.length > 450) {
            charCount.style.color = '#e53e3e';
        } else if (this.value.length > 400) {
            charCount.style.color = '#f6ad55';
        } else {
            charCount.style.color = '#718096';
        }
    });
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && !sendButton.disabled) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Hide quick suggestions after first message
    setTimeout(() => {
        const suggestions = document.getElementById('quickSuggestions');
        if (suggestions && chatHistory.length === 0) {
            suggestions.style.display = 'block';
        }
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Emergency contact
    const phoneNumber = document.querySelector('.emergency-card .phone-number');
    if (phoneNumber) {
        phoneNumber.addEventListener('click', function() {
            window.location.href = 'tel:1800900700';
            showNotification(cbStr('calling'), 'success');
        });
    }

    // Auto-scroll chat messages
    const chatMessages = document.getElementById('chat');
    const observer = new MutationObserver(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    observer.observe(chatMessages, { childList: true });
}

// Send message function
async function sendMessage() {
    const inputBox = document.getElementById("userInput");
    const chatBox = document.getElementById("chat");
    const userMessage = inputBox.value.trim();
    
    if (!userMessage || isTyping) return;
    
    // Hide quick suggestions after first message
    const suggestions = document.getElementById('quickSuggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
    
    // Add user message to chat
    addMessage(userMessage, 'user');
    inputBox.value = "";
    document.getElementById('sendButton').disabled = true;
    document.querySelector('.char-count').textContent = '0/500';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Prepare context for child safety (in the user's selected language)
        const contextPrompt = cbLang() === 'en'
            ? `You are a smart assistant specialized in child protection and safety. Your role is to:

1. Provide advice and guidance on protecting children from abuse and harassment
2. Help parents deal with sensitive situations
3. Provide information about warning signs
4. Guide parents to seek professional help when needed

Important rules:
- Always reply in English
- Be sensitive and understanding
- Give practical, clear advice
- In serious cases, advise calling the helpline: 1800 900 700
- Do not provide medical or psychological diagnoses
- Focus on prevention and protection

Question: ${userMessage}`
            : `أنت مساعد ذكي متخصص في حماية الأطفال وسلامتهم. مهمتك هي:

1. تقديم نصائح وإرشادات حول حماية الأطفال من التحرش والمضايقة
2. مساعدة الأهل في التعامل مع المواقف الحساسة
3. تقديم معلومات حول العلامات التحذيرية
4. إرشاد الأهل لطلب المساعدة المهنية عند الحاجة

قواعد مهمة:
- استخدم اللغة العربية دائماً
- كن حساساً ومتفهماً
- قدم نصائح عملية وواضحة
- في الحالات الخطيرة، انصح بالاتصال بخط المساعدة: 1800 900 700
- لا تقدم تشخيصات طبية أو نفسية
- ركز على الوقاية والحماية

السؤال: ${userMessage}`;

        // Ask the model (direct locally, or via the /api/ai proxy when deployed)
        const botResponse = await window.callAI(
            [{ role: "user", content: contextPrompt }],
            { temperature: 0.7, max_tokens: 1024 }
        );

        hideTypingIndicator();
        addMessage(botResponse, 'bot');

        // Save to chat history
        chatHistory.push(
            { role: 'user', message: userMessage, timestamp: new Date() },
            { role: 'bot', message: botResponse, timestamp: new Date() }
        );
        saveChatHistory();
        
    } catch (error) {
        hideTypingIndicator();
        console.error('Error:', error);
        
        // Fallback response
        addMessage(cbStr('fallback'), 'bot');
    }
}

// Add message to chat
function addMessage(message, sender) {
    const chatBox = document.getElementById("chat");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString(cbLang() === 'en' ? 'en-US' : 'ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${formatMessage(message)}</div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    
    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
}

// Format message text
function formatMessage(text) {
    // Convert line breaks to HTML
    text = text.replace(/\n/g, '<br>');
    
    // Make phone numbers clickable
    text = text.replace(/1800 900 700/g, '<a href="tel:1800900700" style="color: #e53e3e; font-weight: bold;">1800 900 700</a>');
    
    // Format bullet points
    text = text.replace(/•/g, '<span style="color: #4299e1;">•</span>');
    
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    const chatBox = document.getElementById("chat");
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message";
    typingDiv.id = "typingIndicator";
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="loading-message">
                <span>${cbStr('typing')}</span>
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send quick message. Accepts either a string or the clicked button element,
// so the suggestion sent matches the currently displayed language.
function sendQuickMessage(message) {
    const text = (message && message.nodeType === 1) ? message.textContent.trim() : message;
    const inputBox = document.getElementById("userInput");
    inputBox.value = text;
    document.getElementById('sendButton').disabled = false;
    sendMessage();
}

// Clear chat
function clearChat() {
    if (confirm(cbStr('clearConfirm'))) {
        const chatBox = document.getElementById("chat");
        
        // Keep only the initial bot message
        const initialMessage = chatBox.querySelector('.bot-message');
        chatBox.innerHTML = '';
        if (initialMessage) {
            chatBox.appendChild(initialMessage);
        }
        
        // Clear history
        chatHistory = [];
        saveChatHistory();
        
        // Show quick suggestions again
        const suggestions = document.getElementById('quickSuggestions');
        if (suggestions) {
            suggestions.style.display = 'block';
        }
        
        showNotification(cbStr('cleared'), 'success');
    }
}

// Export chat
function exportChat() {
    if (chatHistory.length === 0) {
        showNotification(cbStr('noMessages'), 'info');
        return;
    }

    const en = cbLang() === 'en';
    let exportText = (en ? 'Conversation with the Child Protection Assistant' : 'محادثة مع مساعد حماية الأطفال') + '\n';
    exportText += '=====================================\n\n';

    chatHistory.forEach(entry => {
        const time = new Date(entry.timestamp).toLocaleString(en ? 'en-US' : 'ar-SA');
        const sender = entry.role === 'user' ? (en ? 'You' : 'أنت') : (en ? 'Assistant' : 'المساعد');
        exportText += `[${time}] ${sender}:\n${entry.message}\n\n`;
    });

    exportText += '\n=====================================\n';
    exportText += (en ? 'For immediate help: 1800 900 700' : 'للمساعدة الفورية: 1800 900 700') + '\n';
    exportText += en ? 'Connect With Your Child - Child Protection' : 'موقع حدث طفلك - حماية الأطفال';
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cbLang() === 'en' ? 'child-protection-chat' : 'محادثة-حماية-الأطفال'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(cbStr('exported'), 'success');
}

// Save chat history to localStorage
function saveChatHistory() {
    try {
        localStorage.setItem('childSafetyChatHistory', JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// Load chat history from localStorage
function loadChatHistory() {
    try {
        const saved = localStorage.getItem('childSafetyChatHistory');
        if (saved) {
            chatHistory = JSON.parse(saved);
            
            // Restore messages (limit to last 10 for performance)
            const recentHistory = chatHistory.slice(-10);
            recentHistory.forEach(entry => {
                addMessage(entry.message, entry.role);
            });
            
            // Hide suggestions if there's history
            if (chatHistory.length > 0) {
                const suggestions = document.getElementById('quickSuggestions');
                if (suggestions) {
                    suggestions.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        chatHistory = [];
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const notificationStyle = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#4299e1'};
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
    
    // Add animation styles if not exists
    if (!document.querySelector('#notificationStyles')) {
        const animationStyle = document.createElement('style');
        animationStyle.id = 'notificationStyles';
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

// الحصول على الزر
const scrollTopBtn = document.getElementById("scrollTopBtn");

// تابع التمرير: يظهر الزر فقط إذا تم النزول أكثر من 200px
window.addEventListener("scroll", function() {
    if (window.scrollY > 200) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
});

// عند الضغط على الزر: ترجع لأعلى الصفحة بسلاسة
scrollTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('userInput').focus();
    }
    
    // Ctrl/Cmd + L to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearChat();
    }
    
    // Ctrl/Cmd + S to export chat
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportChat();
    }
});

