// TWINO - Enhanced Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2500);
    }
    // Enhanced Video Controls
    const heroYouTube = document.getElementById('heroYouTube');
    const fallbackVideo = document.getElementById('heroFallbackVideo');
    const fallbackImage = document.getElementById('heroFallbackImage');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    let currentVideo = null;
    let isPlaying = true;
    let isMuted = true;
    let videoLoadAttempts = 0;
    const maxLoadAttempts = 3;
    
    // Initialize video system
    function initVideoSystem() {
        console.log('Initializing video system with YouTube...');
        
        // Try YouTube video first
        if (heroYouTube) {
            setupYouTubeVideo();
        }
        
        // Set up fallback chain
        setupFallbackChain();
    }
    
    function setupYouTubeVideo() {
        console.log('Setting up YouTube video...');
        
        // YouTube iframe is already configured for autoplay
        heroYouTube.style.display = 'block';
        currentVideo = heroYouTube;
        updateControlStates();
        
        // Check if YouTube loads successfully
        heroYouTube.addEventListener('load', () => {
            console.log('YouTube video loaded successfully');
        });
        
        // Handle YouTube errors
        heroYouTube.addEventListener('error', (e) => {
            console.log('YouTube video error:', e);
            handleVideoError(heroYouTube, 'youtube');
        });
        
        // Check if YouTube is blocked after a delay
        setTimeout(() => {
            if (heroYouTube.contentDocument === null && heroYouTube.contentWindow === null) {
                console.log('YouTube appears to be blocked, using fallback');
                handleVideoError(heroYouTube, 'youtube');
            }
        }, 3000);
    }
    
    function setupVideoElement(video, type) {
        console.log(`Setting up ${type} video:`, video);
        
        video.addEventListener('loadstart', () => {
            console.log(`${type} video: loadstart`);
        });
        
        video.addEventListener('loadeddata', () => {
            console.log(`${type} video: loadeddata`);
            if (type === 'fallback' && !currentVideo) {
                currentVideo = video;
                video.style.display = 'block';
                updateControlStates();
            }
        });
        
        video.addEventListener('canplay', () => {
            console.log(`${type} video: canplay`);
            if (type === 'fallback' && !currentVideo) {
                currentVideo = video;
                video.style.display = 'block';
                updateControlStates();
            }
        });
        
        video.addEventListener('error', (e) => {
            console.log(`${type} video error:`, e);
            handleVideoError(video, type);
        });
        
        video.addEventListener('play', () => {
            console.log(`${type} video: playing`);
            isPlaying = true;
            updateControlStates();
        });
        
        video.addEventListener('pause', () => {
            console.log(`${type} video: paused`);
            isPlaying = false;
            updateControlStates();
        });
        
        // Try to play the video
        video.play().catch(e => {
            console.log(`${type} video play failed:`, e);
            handleVideoError(video, type);
        });
    }
    
    function handleVideoError(video, type) {
        videoLoadAttempts++;
        console.log(`Video error for ${type}, attempt ${videoLoadAttempts}/${maxLoadAttempts}`);
        
        if (type === 'youtube' && videoLoadAttempts < maxLoadAttempts) {
            // Try fallback video
            console.log('YouTube failed, switching to fallback video...');
            if (heroYouTube) heroYouTube.style.display = 'none';
            if (fallbackVideo) {
                fallbackVideo.style.display = 'block';
                setupVideoElement(fallbackVideo, 'fallback');
            }
        } else if (type === 'fallback' || videoLoadAttempts >= maxLoadAttempts) {
            // Use static image
            console.log('Using static image fallback...');
            if (video) video.style.display = 'none';
            if (fallbackVideo) fallbackVideo.style.display = 'none';
            if (fallbackImage) {
                fallbackImage.style.display = 'block';
                currentVideo = null;
                updateControlStates();
            }
        }
    }
    
    function setupFallbackChain() {
        // Set up fallback video
        if (fallbackVideo) {
            fallbackVideo.addEventListener('error', () => {
                console.log('Fallback video also failed, using static image');
                fallbackVideo.style.display = 'none';
                if (fallbackImage) {
                    fallbackImage.style.display = 'block';
                    currentVideo = null;
                    updateControlStates();
                }
            });
        }
    }
    
    function updateControlStates() {
        if (!currentVideo) {
            // Hide controls when using static image
            if (playPauseBtn) playPauseBtn.style.display = 'none';
            if (muteBtn) muteBtn.style.display = 'none';
            if (fullscreenBtn) fullscreenBtn.style.display = 'none';
            return;
        }
        
        // Show controls when video is available
        if (playPauseBtn) playPauseBtn.style.display = 'flex';
        if (muteBtn) muteBtn.style.display = 'flex';
        if (fullscreenBtn) fullscreenBtn.style.display = 'flex';
        
        // Update button states
        if (playPauseBtn) {
            const playIcon = playPauseBtn.querySelector('.play-icon');
            const pauseIcon = playPauseBtn.querySelector('.pause-icon');
            if (playIcon && pauseIcon) {
                playIcon.style.display = isPlaying ? 'none' : 'inline';
                pauseIcon.style.display = isPlaying ? 'inline' : 'none';
            }
        }
        
        if (muteBtn) {
            const muteIcon = muteBtn.querySelector('.mute-icon');
            const unmuteIcon = muteBtn.querySelector('.unmute-icon');
            if (muteIcon && unmuteIcon) {
                muteIcon.style.display = isMuted ? 'inline' : 'none';
                unmuteIcon.style.display = isMuted ? 'none' : 'inline';
            }
        }
    }
    
    // Play/Pause functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (currentVideo) {
                if (currentVideo === heroYouTube) {
                    // YouTube controls via URL manipulation
                    const currentSrc = heroYouTube.src;
                    if (isPlaying) {
                        // Pause by removing autoplay
                        heroYouTube.src = currentSrc.replace('autoplay=1', 'autoplay=0');
                        isPlaying = false;
                    } else {
                        // Play by adding autoplay
                        heroYouTube.src = currentSrc.replace('autoplay=0', 'autoplay=1');
                        isPlaying = true;
                    }
                } else {
                    // Regular video controls
                    if (isPlaying) {
                        currentVideo.pause();
                    } else {
                        currentVideo.play().catch(e => console.log('Play failed:', e));
                    }
                }
                updateControlStates();
            }
        });
    }
    
    // Mute/Unmute functionality
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (currentVideo) {
                if (currentVideo === heroYouTube) {
                    // YouTube controls via URL manipulation
                    const currentSrc = heroYouTube.src;
                    isMuted = !isMuted;
                    if (isMuted) {
                        heroYouTube.src = currentSrc.replace('mute=0', 'mute=1');
                    } else {
                        heroYouTube.src = currentSrc.replace('mute=1', 'mute=0');
                    }
                } else {
                    // Regular video controls
                    isMuted = !isMuted;
                    currentVideo.muted = isMuted;
                }
                updateControlStates();
            }
        });
    }
    
    // Fullscreen functionality
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (currentVideo) {
                if (currentVideo === heroYouTube) {
                    // YouTube fullscreen
                    if (heroYouTube.requestFullscreen) {
                        heroYouTube.requestFullscreen();
                    } else if (heroYouTube.webkitRequestFullscreen) {
                        heroYouTube.webkitRequestFullscreen();
                    } else if (heroYouTube.msRequestFullscreen) {
                        heroYouTube.msRequestFullscreen();
                    }
                } else {
                    // Regular video fullscreen
                    if (currentVideo.requestFullscreen) {
                        currentVideo.requestFullscreen();
                    } else if (currentVideo.webkitRequestFullscreen) {
                        currentVideo.webkitRequestFullscreen();
                    } else if (currentVideo.msRequestFullscreen) {
                        currentVideo.msRequestFullscreen();
                    }
                }
            }
        });
    }
    
    // Initialize video system
    initVideoSystem();
    
    // Add debugging info for video status
    setTimeout(() => {
        console.log('Video system status check:');
        console.log('- YouTube video:', heroYouTube ? 'found' : 'not found');
        console.log('- Fallback video:', fallbackVideo ? 'found' : 'not found');
        console.log('- Fallback image:', fallbackImage ? 'found' : 'not found');
        console.log('- Current video:', currentVideo ? 'active' : 'none');
        console.log('- Video load attempts:', videoLoadAttempts);
    }, 3000);
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header Scroll Effect - Show/Hide on Scroll
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    
    if (header && hero) {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateHeader() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            
            // Show header when scrolled past hero section
            if (scrollY > heroHeight * 0.8) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
            
            // Change background opacity based on scroll
            if (scrollY > 100) {
                header.style.background = 'rgba(10, 11, 26, 0.95)';
            } else {
                header.style.background = 'rgba(10, 11, 26, 0.9)';
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Card Hover Effects
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Enhanced Intersection Observer for Beautiful Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add sophisticated staggered animation for cards
                if (entry.target.classList.contains('card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                            card.classList.add('animate-in');
                        }, index * 150);
                    });
                }
                
                // Add special effects for value items
                if (entry.target.classList.contains('value-item')) {
                    entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections with enhanced animations
    document.querySelectorAll('.card, .section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
    
    // Enhanced Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const particles = document.querySelector('.floating-particles');
        const titleLogo = document.querySelector('.title-logo');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && particles) {
            const rate = scrolled * -0.3;
            particles.style.transform = `translateY(${rate}px)`;
        }
        
        if (titleLogo) {
            const logoRate = scrolled * -0.1;
            titleLogo.style.transform = `translateY(${logoRate}px)`;
        }
        
        if (heroContent) {
            const contentRate = scrolled * -0.2;
            heroContent.style.transform = `translateY(${contentRate}px)`;
        }
        
        // Add parallax to individual particles
        const individualParticles = document.querySelectorAll('.particle');
        individualParticles.forEach((particle, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            particle.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Add hover effects to numbers
    document.querySelectorAll('.index-number').forEach(number => {
        number.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        number.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Event Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // Animated Counter for Metrics
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target % 1 === 0) {
                element.textContent = Math.floor(current);
            } else {
                element.textContent = current.toFixed(1);
            }
        }, 16);
    }
    
    // Animated Chart Bars
    function animateChart() {
        const bars = document.querySelectorAll('.bar-fill');
        bars.forEach((bar, index) => {
            const value = bar.parentElement.getAttribute('data-value');
            const height = (value / 100) * 150; // Max height of 150px
            
            setTimeout(() => {
                bar.style.height = height + 'px';
            }, index * 200);
        });
    }
    
    // Intersection Observer for Animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate counters
                const metricNumbers = entry.target.querySelectorAll('.metric-number');
                metricNumbers.forEach(number => {
                    const target = parseFloat(number.getAttribute('data-target'));
                    animateCounter(number, target);
                });
                
                // Animate chart
                if (entry.target.querySelector('.chart')) {
                    animateChart();
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observe dashboard section
    const dashboard = document.querySelector('.cultural-index');
    if (dashboard) {
        animationObserver.observe(dashboard);
    }
    
    // Enhanced Magnetic Cursor Effect
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.1;
    
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
    });
    
    function animate() {
        ballX += (mouseX - ballX) * speed;
        ballY += (mouseY - ballY) * speed;
        
        const magneticElements = document.querySelectorAll('.btn, .card, .event-card, .value-item');
        magneticElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const x = mouseX - rect.left - rect.width / 2;
            const y = mouseY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            if (distance < 120) {
                const force = (120 - distance) / 120;
                const moveX = x * force * 0.15;
                const moveY = y * force * 0.15;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.05})`;
                element.style.transition = 'transform 0.1s ease';
            } else {
                element.style.transform = 'translate(0, 0) scale(1)';
            }
        });
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Enhanced Button Ripple Effect
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Famewall Testimonials Enhancement
    function enhanceFamewallTestimonials() {
        const famewallContainer = document.querySelector('.famewall-embed');
        if (!famewallContainer) return;
        
        // Wait for Famewall to load
        const checkFamewall = setInterval(() => {
            const testimonialCards = famewallContainer.querySelectorAll('.fw-card');
            if (testimonialCards.length > 0) {
                clearInterval(checkFamewall);
                
                // Add staggered animation to testimonial cards
                testimonialCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                // Add intersection observer for testimonials
                const testimonialObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, { threshold: 0.1 });
                
                testimonialCards.forEach(card => {
                    testimonialObserver.observe(card);
                });
            }
        }, 500);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkFamewall), 10000);
    }
    
    // Initialize testimonials enhancement
    enhanceFamewallTestimonials();
    
    // Re-initialize if Famewall content changes
    const famewallObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                enhanceFamewallTestimonials();
            }
        });
    });
    
    const famewallContainer = document.querySelector('.famewall-embed');
    if (famewallContainer) {
        famewallObserver.observe(famewallContainer, { childList: true, subtree: true });
    }
    
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    themeToggle?.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    });
    
    // Contact Form Functionality
    const contactForm = document.getElementById('contactForm');
    
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        const isValid = validateForm();
        
        if (isValid) {
            submitForm();
        }
    });
    
    function validateForm() {
        let isValid = true;
        const formData = new FormData(contactForm);
        
        // Validate name
        const name = formData.get('name')?.trim();
        if (!name) {
            showError('name-error', 'Name is required');
            isValid = false;
        }
        
        // Validate email
        const email = formData.get('email')?.trim();
        if (!email) {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        const message = formData.get('message')?.trim();
        if (!message) {
            showError('message-error', 'Message is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function submitForm() {
        const submitButton = contactForm.querySelector('.form-submit');
        const submitText = submitButton.querySelector('.submit-text');
        const submitLoading = submitButton.querySelector('.submit-loading');
        
        // Show loading state
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success message
            showSuccessMessage();
            
            // Reset button state
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
            submitButton.disabled = false;
        }, 2000);
    }
    
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div style="background: var(--surface); border: 1px solid var(--accent); border-radius: var(--radius); padding: var(--space-lg); text-align: center; margin-top: var(--space-lg);">
                <h3 style="color: var(--accent); margin-bottom: var(--space-sm);">Thank you!</h3>
                <p style="color: var(--text);">We'll get back to you within 24 hours.</p>
            </div>
        `;
        
        contactForm.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Escape key to close any open modals or overlays
        if (e.key === 'Escape') {
            // Add functionality for closing modals if needed
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Smooth scroll-triggered animations
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Enhanced parallax effect for hero
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                heroContent.style.transform = `translateY(${rate}px)`;
            });
        }
    }
    
    // Initialize parallax effect
    initParallaxEffect();
    
    // Smooth reveal animations for cards
    function initCardAnimations() {
        const cards = document.querySelectorAll('.card, .value-item');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }
    
    // Initialize card animations
    initCardAnimations();
    
    // Enhanced Text Reveal Animations
    function initTextReveal() {
        const textElements = document.querySelectorAll('h1, h2, h3, p, .hero-subtitle');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                }
            });
        }, { threshold: 0.1 });
        
        textElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            textObserver.observe(element);
        });
    }
    
    // Initialize text reveal
    initTextReveal();
    
    // Scroll Progress Indicator
    function initScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            if (scrollProgress) {
                scrollProgress.style.width = scrollPercent + '%';
            }
        });
    }
    
    // Initialize scroll progress
    initScrollProgress();
    
    // Enhanced Event Gallery with Lightbox
    function initEventGallery() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const eventCards = document.querySelectorAll('.event-card');
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxBackdrop = document.getElementById('lightboxBackdrop');
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter cards with animation
                eventCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Lightbox functionality
        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const category = card.querySelector('.event-category').textContent;
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('.event-info p').textContent;
                const stats = card.querySelector('.event-stats').textContent;
                const quote = card.querySelector('.event-quote span').textContent;
                const cite = card.querySelector('.event-quote cite').textContent;
                
                // Populate lightbox
                document.getElementById('lightboxImg').src = img.src;
                document.getElementById('lightboxImg').alt = img.alt;
                document.getElementById('lightboxCategory').textContent = category;
                document.getElementById('lightboxTitle').textContent = title;
                document.getElementById('lightboxDescription').textContent = description;
                document.getElementById('lightboxStats').textContent = stats;
                document.getElementById('lightboxQuote').textContent = quote;
                document.getElementById('lightboxCite').textContent = cite;
                
                // Show lightbox
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
    
    // Initialize event gallery
    initEventGallery();
    
    
});