// Chatbot JavaScript with Gemini API Integration

// API Configuration
const API_KEY = "AIzaSyCJQDYLpRvVYpCWajYzE9JIjBNGXP8PPhg";

const MODEL = "gemini-1.5-flash";

// Chat state
let chatHistory = [];
let isTyping = false;

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
            showNotification('جاري الاتصال بخط المساعدة...', 'success');
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
        // Prepare context for child safety
        const contextPrompt = `أنت مساعد ذكي متخصص في حماية الأطفال وسلامتهم. مهمتك هي:

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

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: contextPrompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            }
        );
        
        hideTypingIndicator();
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            addMessage(botResponse, 'bot');
            
            // Save to chat history
            chatHistory.push(
                { role: 'user', message: userMessage, timestamp: new Date() },
                { role: 'bot', message: botResponse, timestamp: new Date() }
            );
            saveChatHistory();
            
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        hideTypingIndicator();
        console.error('Error:', error);
        
        // Fallback response
        const fallbackResponse = `عذراً، حدث خطأ في الاتصال. يمكنك:

• المحاولة مرة أخرى
• الاتصال بخط المساعدة: 1800 900 700
• تصفح الأقسام الأخرى في الموقع للحصول على معلومات مفيدة

أنا هنا لمساعدتك عندما تكون الخدمة متاحة.`;
        
        addMessage(fallbackResponse, 'bot');
    }
}

// Add message to chat
function addMessage(message, sender) {
    const chatBox = document.getElementById("chat");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString('ar-SA', {
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
                <span>المساعد يكتب</span>
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

// Send quick message
function sendQuickMessage(message) {
    const inputBox = document.getElementById("userInput");
    inputBox.value = message;
    document.getElementById('sendButton').disabled = false;
    sendMessage();
}

// Clear chat
function clearChat() {
    if (confirm('هل أنت متأكد من أنك تريد مسح المحادثة؟')) {
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
        
        showNotification('تم مسح المحادثة', 'success');
    }
}

// Export chat
function exportChat() {
    if (chatHistory.length === 0) {
        showNotification('لا توجد رسائل لتصديرها', 'info');
        return;
    }
    
    let exportText = 'محادثة مع مساعد حماية الأطفال\n';
    exportText += '=====================================\n\n';
    
    chatHistory.forEach(entry => {
        const time = new Date(entry.timestamp).toLocaleString('ar-SA');
        const sender = entry.role === 'user' ? 'أنت' : 'المساعد';
        exportText += `[${time}] ${sender}:\n${entry.message}\n\n`;
    });
    
    exportText += '\n=====================================\n';
    exportText += 'للمساعدة الفورية: 1800 900 700\n';
    exportText += 'موقع حدث طفلك - حماية الأطفال';
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `محادثة-حماية-الأطفال-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('تم تصدير المحادثة بنجاح', 'success');
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

