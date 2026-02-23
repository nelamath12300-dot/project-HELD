
        // --- DASHBOARD LOGIC ---
        console.log('Script loaded successfully');
        
        // Sidebar Toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        function toggleSidebar() {
            sidebar.classList.toggle('active');
        }
        
        function closeSidebar() {
            sidebar.classList.remove('active');
        }
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
            sidebarToggle.addEventListener('touchend', (e) => { e.preventDefault(); toggleSidebar(); });
        }

        // Make brand/logo act as "Home / Dashboard" button
        const homeBtn = document.getElementById('homeBtn');
        const homeBtnMobile = document.getElementById('homeBtnMobile');

        function goHome() {
            // switch to dashboard view and close sidebar on mobile
            try { switchTab('dashboard'); } catch (err) { /* ignore */ }
            closeSidebar();
        }

        if (homeBtn) {
            homeBtn.addEventListener('click', goHome);
            homeBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); } });
        }

        if (homeBtnMobile) {
            homeBtnMobile.addEventListener('click', goHome);
            homeBtnMobile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); } });
        }
        
        // Close sidebar when a nav link is clicked on mobile
        document.querySelectorAll('.nav a').forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            });
        });
        
        // Close sidebar when clicking on the sidebar backdrop/overlay
        sidebar.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && e.target === sidebar) {
                closeSidebar();
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    closeSidebar();
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
            document.querySelectorAll('.nav a').forEach(item => {
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
        document.querySelectorAll('.nav a').forEach(item => {
            item.addEventListener('touchend', function(e) {
                e.preventDefault();
                const onclickAttr = this.getAttribute('onclick') || '';
                const match = onclickAttr.match(/'([^']+)'/);
                const tabName = match ? match[1] : this.innerText.split('\n')[0].trim().toLowerCase();
                switchTab(tabName);
            });
        });

        // Mood Tracker
        document.addEventListener('DOMContentLoaded', function() {
        // Prevent default touch behavior
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    });
    // Tool Navigation
        function openTool(href){
        window.open(href, '_self');
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


        // Chat Widget
        // --- CHATBOT WIDGET LOGIC (SIMPLIFIED, HELPINGAI) ---

        const HF_API_KEY = "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";
        const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

        // ====== SAFETY + PERSONALITY PROMPT ======
        const SYSTEM_PROMPT = `
        You are a warm, friendly, and supportive assistant.

        IMPORTANT RULES:
        - You are NOT a doctor or therapist.
        - You must NOT diagnose conditions.
        - You must NOT suggest treatments, medication, or cures.
        - You must NOT give medical or psychological advice.
        - You must respond with empathy, kindness, and emotional validation.
        - You may gently remind users that this website has tools and small games meant to help them feel supported.
        - If a user expresses self-harm or suicidal thoughts, respond with care and encourage them to contact emergency services or a trusted person.

        WEBSITE CONTEXT:
        This website provides small tools and simple interactive games designed to help users relax, reflect, and feel supported. These are not medical treatments.
        `;

        // ====== CHAT ELEMENTS ======
        const toggleChatBtn = document.getElementById("toggleChatBtn");
        const closeChatBtn = document.getElementById("closeChatBtn");
        const chatWindow = document.getElementById("chatWindow");
        const chatInput = document.getElementById("chatInput");
        const sendBtn = document.getElementById("sendBtn");
        const chatMessages = document.getElementById("chatMessages");
        const typingIndicator = document.getElementById("typingIndicator");

        let isChatOpen = false;

        // ====== UI FUNCTIONS ======
        function toggleChat() {
        isChatOpen = !isChatOpen;
        chatWindow.classList.toggle("active", isChatOpen);
        toggleChatBtn.classList.toggle("hidden", isChatOpen);
        }

        function closeChat() {
        isChatOpen = false;
        chatWindow.classList.remove("active");
        toggleChatBtn.classList.remove("hidden");
        }

        function addMessage(text, sender) {
            const msg = document.createElement("div");
            msg.className = `message ${sender}`;
            msg.innerHTML = `
                <div class="chat-avatar">
                <span class="material-symbols-rounded">
                    ${sender === "bot" ? "smart_toy" : "person"}
                </span>
                </div>
                <div class="message-content">${text}</div>
            `;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // ====== SEND MESSAGE ======
        async function sendMessage() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        addMessage(userText, "user");
        chatInput.value = "";
        chatInput.style.height = "auto";
        sendBtn.classList.remove("active");

        showTyping();
        const reply = await getBotResponse(userText);
        hideTyping();
        addMessage(reply, "bot");
        }

        // ====== HELPINGAI API CALL ======
        async function sendMessage() {
            const userText = chatInput.value.trim();
            if (!userText) return;

            addMessage(userText, "user");
            chatInput.value = "";

            showTyping();

            try {
                const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText })
                });

                const data = await response.json();

                hideTyping();

                console.log("BOT REPLY:", data);

                addMessage(data.reply || "Hey! 😊", "bot");

            } catch (err) {
                hideTyping();
                addMessage("Hey — I’m having a small hiccup.", "bot");
            }
        }





        // ====== EVENTS ======
        toggleChatBtn.addEventListener("click", toggleChat);
        closeChatBtn.addEventListener("click", closeChat);
        sendBtn.addEventListener("click", sendMessage);

        chatInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
        sendBtn.classList.toggle("active", this.value.trim());
        });

        chatInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        });

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

        toggleChatBtn.addEventListener('touchend', (e) => { e.preventDefault(); toggleChat(); });
        
        closeChatBtn.addEventListener('touchend', (e) => { e.preventDefault(); closeChat(); });
        
        sendBtn.addEventListener('touchend', (e) => { e.preventDefault(); sendMessage(); });
        
        // Expose goToSlide to global scope for onclick handlers
        window.goToSlide = goToSlide;
