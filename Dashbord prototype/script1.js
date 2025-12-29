
        // --- DASHBOARD LOGIC ---
        console.log('Script loaded successfully');
        
        // Sidebar Toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        function toggleSidebar() {
            sidebar.classList.toggle('active');
        }
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
            sidebarToggle.addEventListener('touchend', (e) => { e.preventDefault(); toggleSidebar(); });
        }
        
        // Close sidebar when a nav item is clicked on mobile
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
        
        // Time & Greeting
        function updateGreeting() {
            const hour = new Date().getHours();
            const greetingText = document.getElementById('greeting-text');
            const dateBadge = document.getElementById('date-badge');
            
            let greet = 'Good Morning';
            if (hour >= 12 && hour < 17) greet = 'Good Afternoon';
            else if (hour >= 17) greet = 'Good Evening';
            
            greetingText.innerText = `${greet}, Alen`;
            
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            dateBadge.innerText = new Date().toLocaleDateString('en-US', options);
        }
        updateGreeting();

        // Navigation
        function switchTab(tabName) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if(item.innerText.toLowerCase().includes(tabName)) {
                    item.classList.add('active');
                }
            });

            document.querySelectorAll('.view-section').forEach(view => {
                view.style.display = 'none';
            });

            const viewId = `view-${tabName}`;
            const view = document.getElementById(viewId);
            if(view) {
                view.style.display = 'block';
                view.style.opacity = 0;
                setTimeout(() => view.style.opacity = 1, 50);
            }
        }
        
        // Add touch support for nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('touchend', function(e) {
                e.preventDefault();
                const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                switchTab(tabName);
            });
        });

        // Mood Tracker
        function selectMood(btn, mood) {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            const originalText = btn.querySelector('.mood-label').innerText;
            btn.querySelector('.mood-label').innerText = "Saved!";
            setTimeout(() => {
                btn.querySelector('.mood-label').innerText = originalText;
            }, 1500);

            const bars = document.querySelectorAll('.bar');
            bars[bars.length - 1].style.height = Math.floor(Math.random() * 50 + 50) + '%';
        }

        // Slider
        let currentSlide = 0;
        const sliderContainer = document.getElementById('slider');
        const dots = document.querySelectorAll('.dot');
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const totalSlides = 3;
        
        // Initialize slider
        if (sliderContainer && sliderContainer.offsetWidth > 0) {
            sliderContainer.style.transform = `translateX(0%)`;
        }
        
        function goToSlide(index) {
            currentSlide = Math.max(0, Math.min(totalSlides - 1, index));
            if (sliderContainer) {
                sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
            dots.forEach((dot, i) => {
                if (i === currentSlide) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }



        // Dragging/Swiping functionality
        function handleSliderMouseDown(e) {
            isDragging = true;
            startX = e.clientX || e.pageX;
            currentX = 0;
            if (sliderContainer) {
                sliderContainer.style.cursor = 'grabbing';
                sliderContainer.style.transition = 'none';
            }
        }

        function handleSliderMouseMove(e) {
            if (!isDragging || !sliderContainer) return;
            currentX = (e.clientX || e.pageX) - startX;
            sliderContainer.style.transform = `translateX(calc(-${currentSlide * 100}% + ${currentX}px))`;
        }

        function handleSliderMouseUp(e) {
            if (!isDragging || !sliderContainer) return;
            isDragging = false;
            sliderContainer.style.cursor = 'grab';
            sliderContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

            const sliderWidth = sliderContainer.offsetWidth;
            if (sliderWidth > 0) {
                const slideWidth = sliderWidth / totalSlides;
                if (Math.abs(currentX) > slideWidth / 2) {
                    if (currentX > 0) {
                        currentSlide = Math.max(0, currentSlide - 1);
                    } else {
                        currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
                    }
                }
            }

            goToSlide(currentSlide);
        }

        function handleSliderMouseLeave(e) {
            if (isDragging) {
                isDragging = false;
                if (sliderContainer) {
                    sliderContainer.style.cursor = 'grab';
                    sliderContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                goToSlide(currentSlide);
            }
        }

        // Attach events to slider
        if (sliderContainer) {
            sliderContainer.addEventListener('mousedown', handleSliderMouseDown);
            sliderContainer.addEventListener('mouseleave', handleSliderMouseLeave);
            sliderContainer.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                currentX = 0;
                sliderContainer.style.transition = 'none';
            });
        }

        // Document level events for mouse and touch
        document.addEventListener('mousemove', handleSliderMouseMove, true);
        document.addEventListener('mouseup', handleSliderMouseUp, true);
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging || !sliderContainer) return;
            currentX = e.touches[0].clientX - startX;
            sliderContainer.style.transform = `translateX(calc(-${currentSlide * 100}% + ${currentX}px))`;
        }, true);

        document.addEventListener('touchend', (e) => {
            if (!isDragging || !sliderContainer) return;
            isDragging = false;
            sliderContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

            const sliderWidth = sliderContainer.offsetWidth;
            if (sliderWidth > 0) {
                const slideWidth = sliderWidth / totalSlides;
                if (Math.abs(currentX) > slideWidth / 2) {
                    if (currentX > 0) {
                        currentSlide = Math.max(0, currentSlide - 1);
                    } else {
                        currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
                    }
                }
            }

            goToSlide(currentSlide);
        }, true);

        // Handle window resize
        window.addEventListener('resize', () => {
            if (!isDragging && sliderContainer) {
                sliderContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                goToSlide(currentSlide);
            }
        });


        // --- CHATBOT WIDGET LOGIC ---

        const toggleChatBtn = document.getElementById('toggleChatBtn');
        const closeChatBtn = document.getElementById('closeChatBtn');
        const chatWindow = document.getElementById('chatWindow');
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatMessages = document.getElementById('chatMessages');
        const typingIndicator = document.getElementById('typingIndicator');

        // Debug: Log if elements are found
        console.log('Chat elements found:', { toggleChatBtn, closeChatBtn, chatWindow, chatInput, sendBtn });

        let isChatOpen = false;

        function toggleChat() {
            isChatOpen = !isChatOpen;
            if (isChatOpen) {
                chatWindow.classList.add('active');
                toggleChatBtn.classList.add('hidden');
            } else {
                chatWindow.classList.remove('active');
                toggleChatBtn.classList.remove('hidden');
            }
        }

        function closeChat() {
            isChatOpen = false;
            chatWindow.classList.remove('active');
            toggleChatBtn.classList.remove('hidden');
        }

        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if(this.value.trim()) {
                sendBtn.classList.add('active');
            } else {
                sendBtn.classList.remove('active');
            }
        });

        function sendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            
            chatInput.value = '';
            chatInput.style.height = 'auto';
            sendBtn.classList.remove('active');

            showTyping();

            setTimeout(() => {
                hideTyping();
                const response = getMockResponse(text);
                addMessage(response, 'bot');
            }, 1500 + Math.random() * 1000);
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);
            
            const avatarHtml = sender === 'bot' 
                ? `<div class="chat-avatar"><span class="material-symbols-rounded gemini-icon">smart_toy</span></div>`
                : `<div class="chat-avatar"><span class="material-symbols-rounded">person</span></div>`;

            messageDiv.innerHTML = `
                ${avatarHtml}
                <div class="message-content">${text}</div>
            `;

            chatMessages.insertBefore(messageDiv, typingIndicator);
            scrollToBottom();
        }

        function getMockResponse(input) {
            const responses = [
                "That sounds important. Can you tell me more?",
                "I'm here to listen. How does that make you feel?",
                "Have you tried our breathing exercises today?",
                "Connecting with a counselor might be helpful for this.",
                "It's okay to feel that way. You are doing great."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        function showTyping() {
            typingIndicator.classList.add('active');
            scrollToBottom();
        }

        function hideTyping() {
            typingIndicator.classList.remove('active');
        }

        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        toggleChatBtn.addEventListener('click', toggleChat);
        toggleChatBtn.addEventListener('touchend', (e) => { e.preventDefault(); toggleChat(); });
        
        closeChatBtn.addEventListener('click', closeChat);
        closeChatBtn.addEventListener('touchend', (e) => { e.preventDefault(); closeChat(); });
        
        sendBtn.addEventListener('click', sendMessage);
        sendBtn.addEventListener('touchend', (e) => { e.preventDefault(); sendMessage(); });
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Expose goToSlide to global scope for onclick handlers
        window.goToSlide = goToSlide;