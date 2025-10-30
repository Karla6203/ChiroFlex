// Chiroflex Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.add('mobile-menu-enter');
        });
    }
    
    // Chatbot functionality
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotQuestions = document.querySelectorAll('.chatbot-question');
    
    // Chatbot responses
    const chatbotResponses = {
        'What services do you offer?': 'We offer comprehensive chiropractic care including accident recovery, spinal adjustments, pain management, and rehabilitation services. Our specialized treatments help you recover quickly from auto accidents, workplace injuries, and sports-related trauma.',
        'How do I schedule an appointment?': 'You can schedule an appointment by calling us at (713) 461-0666 or by clicking the "Intake" button on our website. We also offer online booking for your convenience. Our friendly staff will help you find the best time that works for your schedule.',
        'What are your office hours?': 'We have flexible hours to accommodate your needs. Our main office hours are Monday-Friday 9:30 AM - 5:00 PM, and Saturday 10:00 AM - 2:00 PM.',
        'Do you accept insurance?': 'Yes, we accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, and many others. We also work with auto insurance for accident-related injuries. Our staff will verify your coverage and help maximize your benefits.',
        'Where are you located?': 'We have 2 convenient locations to serve you better. Please call us at (713) 461-0666 for specific addresses and directions. We\'re strategically located to provide easy access for our patients throughout the area.'
    };
    
    // Knowledge base for typed questions
    const knowledgeBase = {
        en: [
            {keywords: ['service','services','offer','offers','what do you offer'], answer: 'We offer: Injury Rehabilitation, Spinal Decompression, Hydromassage, Shockwave Therapy, Chiropractor Adjustments, Therapeutic Massage, and Physical Therapy. Call (713) 461-0666 to book.'},
            {keywords: ['hours','open','opening','when'], answer: 'Our typical office hours are Mon–Fri 9:30 AM – 5:00 PM and Sat 10:00 AM – 2:00 PM. Please call to confirm.'},
            {keywords: ['insurance','insure','coverage'], answer: 'Yes – we accept most major insurance providers and work with auto insurance for accident-related care. We verify coverage for you.'},
            {keywords: ['schedule','book','appointment'], answer: 'To schedule, call (713) 461-0666 or use the Get Started / Intake buttons on the website.'},
            {keywords: ['phone','call','number'], answer: 'You can call us at (713) 461-0666.'},
            {keywords: ['location','address','where'], answer: 'We have 2 locations in Houston. Call (713) 461-0666 for specific addresses and directions.'},
            {keywords: ['transport','transportation'], answer: 'We provide free transportation to and from the office for eligible patients – ask our staff when you call to schedule.'},
            {keywords: ['default','help','hello','hi'], answer: 'Hi! I can help with services, hours, locations, scheduling, and insurance. Try asking: "What services do you offer?" or "How do I schedule an appointment?"'}
        ],
        es: [
            {keywords: ['servicio','servicios','ofrecen','ofrecer'], answer: 'Ofrecemos: Rehabilitación de Lesiones, Descompresión Espinal, Hidromasaje, Terapia de Ondas de Choque, Ajustes Quiroprácticos, Masaje Terapéutico y Fisioterapia. Llame al (713) 461-0666.'},
            {keywords: ['horario','horarios','abre','cuando'], answer: 'Nuestro horario es Lunes–Viernes 9:30 AM – 5:00 PM y Sábado 10:00 AM – 2:00 PM. Llame para confirmar.'},
            {keywords: ['seguro','seguros','cobertura'], answer: 'Sí – aceptamos la mayoría de los seguros principales y trabajamos con seguros de auto. Verificamos su cobertura.'},
            {keywords: ['cita','reserv','agendar','programar'], answer: 'Para programar, llame al (713) 461-0666 o use los botones de Intake en el sitio web.'},
            {keywords: ['telefono','teléfono','llamar','numero'], answer: 'Puede llamarnos al (713) 461-0666.'},
            {keywords: ['ubicacion','direccion','donde'], answer: 'Tenemos 2 ubicaciones en Houston. Llame al (713) 461-0666 para direcciones específicas.'},
            {keywords: ['transporte','transporte gratuito'], answer: 'Ofrecemos transporte gratuito para pacientes elegibles – pregunte al llamar.'},
            {keywords: ['default','ayuda','hola','buenos'], answer: '¡Hola! Puedo ayudar con servicios, horarios, ubicaciones, citas y seguros. Pregunte: "¿Qué servicios ofrecen?"'}
        ]
    };
    
    // Open chatbot modal
    const chatbotBtn = document.getElementById('chatbot-btn');
    if (chatbotBtn && chatbotModal) {
        chatbotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            chatbotModal.classList.remove('hidden');
            chatbotModal.classList.add('chatbot-enter');
            
            setTimeout(() => {
                const firstQuestion = chatbotModal.querySelector('.chatbot-question');
                if (firstQuestion) {
                    firstQuestion.focus();
                }
            }, 100);
        });
    }
    
    // Close chatbot modal
    if (closeChatbot && chatbotModal) {
        closeChatbot.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            chatbotModal.classList.add('hidden');
            chatbotModal.classList.remove('chatbot-enter');
        });
    }
    
    // Handle chatbot quick-reply questions
    chatbotQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const questionText = this.textContent.trim();
            // Remove icon from question text
            const cleanQuestion = questionText.replace(/^\s*[\u{1F300}-\u{1F9FF}]|\s*[\uD800-\uDBFF][\uDC00-\uDFFF]/gu, '').trim();
            
            // Find response - try exact match first
            let response = chatbotResponses[cleanQuestion];
            
            // If no exact match, try partial match
            if (!response) {
                for (const [key, value] of Object.entries(chatbotResponses)) {
                    if (cleanQuestion.toLowerCase().includes(key.toLowerCase()) || 
                        key.toLowerCase().includes(cleanQuestion.toLowerCase())) {
                        response = value;
                        break;
                    }
                }
            }
            
            if (response) {
                // Disable button temporarily
                this.disabled = true;
                this.classList.add('opacity-50', 'cursor-not-allowed');
                
                // Add user question
                addMessageToChat(cleanQuestion, 'user');
                
                // Show typing indicator
                showTypingIndicator();
                
                // Add response after delay
                setTimeout(() => {
                    hideTypingIndicator();
                    addMessageToChat(response, 'bot');
                    
                    // Re-enable button
                    setTimeout(() => {
                        this.disabled = false;
                        this.classList.remove('opacity-50', 'cursor-not-allowed');
                    }, 2000);
                }, 1500);
            }
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Handle text input form
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        const chatInput = document.getElementById('chat-input');
        
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            // Add user message
            addMessageToChat(text, 'user');
            chatInput.value = '';

            // Show typing
            showTypingIndicator();

            setTimeout(() => {
                hideTypingIndicator();
                const language = currentLanguage || 'en';
                const reply = getKnowledgeReply(text, language);
                addMessageToChat(reply, 'bot');
            }, 800);
        });
    }
    
    // Add message to chat (SINGLE FUNCTION - NO DUPLICATION)
    function addMessageToChat(message, sender) {
        // Check if this exact message was just added (prevent duplicates)
        const lastMessage = chatbotMessages.lastElementChild;
        if (lastMessage && lastMessage.textContent.includes(message)) {
            return; // Skip duplicate
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-3 chat-message ${sender === 'user' ? 'text-right' : 'text-left'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `inline-block p-3 rounded-lg max-w-xs ${
            sender === 'user' 
                ? 'btn-accent text-white' 
                : 'bg-gray-100 text-gray-800'
        }`;
        
        messageContent.textContent = message;
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        hideTypingIndicator(); // Remove any existing indicator
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'mb-3 text-left';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'inline-block p-3 rounded-lg bg-gray-100';
        
        const dots = document.createElement('div');
        dots.className = 'flex space-x-1';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-indicator';
            dots.appendChild(dot);
        }
        
        typingContent.appendChild(dots);
        typingDiv.appendChild(typingContent);
        chatbotMessages.appendChild(typingDiv);
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Knowledge base lookup
    function getKnowledgeReply(message, language) {
        const msg = message.toLowerCase();
        const kb = knowledgeBase[language] || knowledgeBase['en'];

        // Check exact match in chatbotResponses first
        if (chatbotResponses[message]) {
            return chatbotResponses[message];
        }

        // Check knowledge base
        for (const item of kb) {
            for (const kw of item.keywords) {
                if (msg.includes(kw)) {
                    return item.answer;
                }
            }
        }

        // Fallback
        return language === 'es'
            ? 'Lo siento, no entendí. Intenta preguntar por servicios, horarios, direcciones o cómo agendar.'
            : 'Sorry, I did not understand. Try asking about services, hours, locations, or how to schedule.';
    }
    
    // Reset chat functionality
    function resetChat() {
        if (chatbotMessages) {
            chatbotMessages.innerHTML = '<div class="chat-message text-left"><div class="inline-block bg-white text-gray-800 p-3 rounded-lg shadow-sm"><p class="text-sm">👋 Hello! I\'m here to help you with questions about our services. How can I assist you today?</p></div></div>';
        }
        
        // Re-enable all questions
        chatbotQuestions.forEach(question => {
            question.disabled = false;
            question.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }
    
    // Connect reset button
    const resetChatBtn = document.getElementById('reset-chat-btn');
    if (resetChatBtn) {
        resetChatBtn.addEventListener('click', resetChat);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const iconWrapper = card.querySelector('.service-icon');
        if (iconWrapper) {
            iconWrapper.classList.add('service-icon');
        }
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close chatbot with Escape key
        if (e.key === 'Escape' && chatbotModal && !chatbotModal.classList.contains('hidden')) {
            chatbotModal.classList.add('hidden');
            chatbotModal.classList.remove('chatbot-enter');
        }
        
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
    
    // Translation functionality
    let currentLanguage = 'en';
    
    function toggleLanguage() {
        currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
        translatePage(currentLanguage);
    }
    
    function translatePage(language) {
        const elements = document.querySelectorAll('[data-en][data-es]');
        elements.forEach(element => {
            const text = element.getAttribute('data-' + language);
            if (text) {
                element.textContent = text;
            }
        });
        
        document.getElementById('current-lang').textContent = language.toUpperCase();
        const mobileLang = document.getElementById('mobile-current-lang');
        if (mobileLang) {
            mobileLang.textContent = language.toUpperCase();
        }
    }
    
    // Translation buttons
    const translateBtn = document.getElementById('translate-btn');
    const mobileTranslateBtn = document.getElementById('mobile-translate-btn');
    
    if (translateBtn) {
        translateBtn.addEventListener('click', toggleLanguage);
    }
    
    if (mobileTranslateBtn) {
        mobileTranslateBtn.addEventListener('click', toggleLanguage);
    }
    
    // Initialize translation
    translatePage(currentLanguage);
    
    console.log('Chiroflex website initialized successfully!');
});