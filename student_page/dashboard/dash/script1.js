
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
            // switch to top mood view and close sidebar on mobile
            try { switchTab('mood', { skipScroll: true }); } catch (err) { /* ignore */ }
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        // Handle nav link clicks without hash-jump overlap
        document.querySelectorAll('.nav a').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const onclickAttr = this.getAttribute('onclick') || '';
                const match = onclickAttr.match(/'([^']+)'/);
                const tabName = match ? match[1] : this.getAttribute('href')?.replace('#view-', '') || '';
                if (tabName) switchTab(tabName);
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
        function switchTab(tabName, options = {}) {
            const { skipScroll = false } = options;
            document.querySelectorAll('.nav a').forEach(item => {
                item.classList.remove('active');
                if(item.innerText.toLowerCase().includes(tabName)) {
                    item.classList.add('active');
                }
            });

            const moodView = document.getElementById('view-mood');
            const counselorsView = document.getElementById('view-counselors');
            const gamesView = document.getElementById('view-games');
            const toolsView = document.getElementById('view-tools');

            // Mood and Counselors should remain visible while navigating between them.
            if (tabName === 'mood' || tabName === 'counselors') {
                if (moodView) moodView.style.display = 'block';
                if (counselorsView) counselorsView.style.display = 'block';
                if (gamesView) gamesView.style.display = 'none';
                if (toolsView) toolsView.style.display = 'none';

                const targetView = tabName === 'mood' ? moodView : counselorsView;
                if (targetView) {
                    targetView.style.opacity = 0;
                    setTimeout(() => { targetView.style.opacity = 1; }, 50);
                    if (!skipScroll) {
                        targetView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                return;
            }

            // Games/Tools keep standard single-view behavior.
            if (moodView) moodView.style.display = 'none';
            if (counselorsView) counselorsView.style.display = 'none';
            if (gamesView) gamesView.style.display = tabName === 'games' ? 'block' : 'none';
            if (toolsView) toolsView.style.display = tabName === 'tools' ? 'block' : 'none';

            const activeView = tabName === 'games' ? gamesView : tabName === 'tools' ? toolsView : null;
            if (activeView) {
                activeView.style.opacity = 0;
                setTimeout(() => { activeView.style.opacity = 1; }, 50);
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
        switchTab('mood', { skipScroll: true });
        window.scrollTo({ top: 0, behavior: 'auto' });

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

        function sanitizeBotReply(text) {
            let cleaned = String(text || "").trim();
            cleaned = cleaned.replace(/^\uFEFF/, "");
            while (/^(\\?["'`“”])/.test(cleaned)) {
                cleaned = cleaned.replace(/^(\\?["'`“”])\s*/, "");
            }
            while (/["'`“”]$/.test(cleaned)) {
                cleaned = cleaned.slice(0, -1).trim();
            }
            return cleaned.replace(/\s+/g, " ").trim();
        }

        // Dashboard quote carousel
        const dashboardQuotes = [
            { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor E. Frankl" },
            { text: "No feeling is final.", author: "Rainer Maria Rilke" },
            { text: "A calm mind brings inner strength and self-confidence.", author: "Dalai Lama" },
            { text: "Nothing can dim the light that shines from within.", author: "Maya Angelou" },
            { text: "Storms make trees take deeper roots.", author: "Dolly Parton" },
            { text: "The best way out is always through.", author: "Robert Frost" },
            { text: "You cannot always control what goes on outside, but you can always control what goes on inside.", author: "Wayne Dyer" }
        ];

        function normalizeQuoteImagePath(rawName, folder) {
            const name = String(rawName || "").trim();
            if (!name) return "";
            if (/^https?:\/\//i.test(name)) return name;
            // Accept names with or without folder prefix.
            const cleaned = name
                .replace(/^\.?\//, "")
                .replace(/^quotes-images\//i, "")
                .replace(/^module-1\/quotes-images\//i, "");
            return folder + encodeURIComponent(cleaned).replace(/%2F/g, "/");
        }

        async function verifyImageList(imageUrls) {
            const checks = imageUrls.map((url) => new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => resolve(null);
                img.src = url;
            }));
            const results = await Promise.all(checks);
            return results.filter(Boolean);
        }

        async function getDashboardQuoteImages() {
            const folder = "../../module-1/quotes-images/";
            const imagePattern = /\.(png|jpe?g|webp|gif|avif)$/i;

            // If directory listing is available, auto-pick every image in the folder.
            try {
                const resp = await fetch(folder, { cache: "no-store" });
                if (resp.ok) {
                    const html = await resp.text();
                    const links = [...html.matchAll(/href=["']([^"']+)["']/gi)]
                        .map((m) => m[1])
                        .filter((href) => imagePattern.test(href))
                        .map((href) => normalizeQuoteImagePath(href, folder));
                    const uniqueLinks = [...new Set(links)].filter(Boolean);
                    const validLinks = await verifyImageList(uniqueLinks);
                    if (validLinks.length) return validLinks;
                }
            } catch (err) {
                // Ignore and try manifest fallback.
            }

            // Fallback for hosts without directory listing.
            try {
                const manifestResp = await fetch(folder + "images.json", { cache: "no-store" });
                if (manifestResp.ok) {
                    const manifest = await manifestResp.json();
                    if (Array.isArray(manifest) && manifest.length) {
                        const normalized = manifest
                            .map((entry) => (typeof entry === "string" ? entry : entry?.file))
                            .filter((name) => typeof name === "string" && imagePattern.test(name))
                            .map((name) => normalizeQuoteImagePath(name, folder))
                            .filter(Boolean);
                        const validLinks = await verifyImageList([...new Set(normalized)]);
                        if (validLinks.length) return validLinks;
                    }
                }
            } catch (err) {
                // Ignore and use default fallback image.
            }

            console.warn("Quote carousel: no valid images found in module-1/quotes-images. Check images.json filenames.");
            return ["images/holding_hand.jpg"];
        }

        async function initDashboardQuoteCarousel() {
            const track = document.getElementById("quoteCarouselTrack");
            if (!track) return;

            const images = await getDashboardQuoteImages();
            const slideCount = Math.max(dashboardQuotes.length, images.length, 1);

            for (let i = 0; i < slideCount; i += 1) {
                const quote = dashboardQuotes[i % dashboardQuotes.length];
                const image = images[i % images.length];
                const slide = document.createElement("article");
                slide.className = "quote-slide";
                slide.innerHTML = `
                    <img src="${image}" alt="Quote background ${i + 1}" loading="lazy">
                    <div class="quote-overlay">
                        <div class="quote-kicker">From Quotes</div>
                        <p class="quote-text">“${quote.text}”</p>
                        <div class="quote-author">— ${quote.author}</div>
                        <div class="quote-meta">
                            <span>Auto-scroll enabled</span>
                            <span class="quote-count">${i + 1}/${slideCount}</span>
                        </div>
                    </div>
                `;
                track.appendChild(slide);
            }

            // Duplicate the full set once to create a seamless looping strip.
            const originals = Array.from(track.children);
            originals.forEach((slide) => {
                track.appendChild(slide.cloneNode(true));
            });

            const baseSetWidth = track.scrollWidth / 2;
            let autoTimer = null;
            const startAutoScroll = () => {
                stopAutoScroll();
                autoTimer = setInterval(() => {
                    track.scrollLeft += 1;
                    if (track.scrollLeft >= baseSetWidth) {
                        track.scrollLeft -= baseSetWidth;
                    }
                }, 22);
            };
            const stopAutoScroll = () => {
                if (autoTimer) {
                    clearInterval(autoTimer);
                    autoTimer = null;
                }
            };

            let restartTimeout = null;
            const pauseThenResume = () => {
                stopAutoScroll();
                if (restartTimeout) clearTimeout(restartTimeout);
                restartTimeout = setTimeout(startAutoScroll, 5000);
            };

            track.addEventListener("wheel", pauseThenResume, { passive: true });
            track.addEventListener("touchstart", pauseThenResume, { passive: true });
            track.addEventListener("pointerdown", pauseThenResume, { passive: true });

            startAutoScroll();
        }
        initDashboardQuoteCarousel();
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

                const botReply = sanitizeBotReply(data.reply || "Hey!");
                addMessage(botReply || "Hey!", "bot");

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

        // Counselor modal functions
        function openCounselorModal(name, role, desc, imgPath){
            const modal = document.getElementById('counselorModal');
            if(!modal) return;
            document.getElementById('counselorName').innerText = name || '';
            document.getElementById('counselorRole').innerText = role || '';
            document.getElementById('counselorDesc').innerText = desc || '';
            const img = document.getElementById('counselorImage');
            if(imgPath){ img.src = imgPath; img.alt = name + ' photo'; }
            else { img.src = 'images/counselors/placeholder.svg'; img.alt = 'Photo placeholder'; }
            modal.classList.add('open');
            modal.setAttribute('aria-hidden','false');
        }

        function closeCounselorModal(){
            const modal = document.getElementById('counselorModal');
            if(!modal) return;
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden','true');
        }

        // Close modal when clicking outside content
        document.addEventListener('click', function(e){
            const modal = document.getElementById('counselorModal');
            if(!modal || !modal.classList.contains('open')) return;
            if(e.target === modal) closeCounselorModal();
        });

        // Close modal on ESC
        document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeCounselorModal(); });

        // Expose modal functions
        window.openCounselorModal = openCounselorModal;
        window.closeCounselorModal = closeCounselorModal;





