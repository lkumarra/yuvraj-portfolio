/* ====================================
   Apple-Style Portfolio - JavaScript
   Smooth animations & interactions
   ==================================== */

// Global state
let siteConfig = null;
let currentFilter = 'all';
let currentLightboxIndex = 0;
let portfolioItems = [];

/* ====================================
   Configuration Loading
   ==================================== */
async function loadConfig() {
    try {
        console.log('🔄 Loading configuration...');
        const response = await fetch('config.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        siteConfig = await response.json();
        console.log('✅ Configuration loaded successfully:', siteConfig);
        
        populateContent();
    } catch (error) {
        console.error('❌ Error loading config:', error);
        showError('Failed to load content. Please make sure you\'re running a local server.');
    }
}

function showError(message) {
    const hero = document.querySelector('.hero');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff3b30;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
        z-index: 10000;
        font-size: 14px;
        max-width: 90%;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

/* ====================================
   Content Population
   ==================================== */
function populateContent() {
    if (!siteConfig) {
        console.error('❌ No configuration loaded');
        return;
    }
    
    console.log('🎨 Populating content...');
    
    // Update brand name
    updateElements('#brandName, #footerBrand', siteConfig.brand?.name);
    
    // Update hero section
    if (siteConfig.hero) {
        updateElement('#heroTitle', siteConfig.hero.title);
        updateElement('#heroHighlight', siteConfig.hero.titleHighlight);
        updateElement('#heroSubtitle', siteConfig.hero.subtitle);
        
        if (siteConfig.hero.primaryButton && siteConfig.hero.secondaryButton) {
            updateElement('#heroBtn1Text', siteConfig.hero.primaryButton.text);
            updateElement('#heroBtn2Text', siteConfig.hero.secondaryButton.text);
            
            // Add button click handlers
            const btn1 = document.getElementById('heroBtn1');
            const btn2 = document.getElementById('heroBtn2');
            if (btn1 && siteConfig.hero.primaryButton.link) {
                btn1.onclick = () => smoothScroll(siteConfig.hero.primaryButton.link);
            }
            if (btn2 && siteConfig.hero.secondaryButton.link) {
                btn2.onclick = () => smoothScroll(siteConfig.hero.secondaryButton.link);
            }
        }
    }
    
    // Populate services
    if (siteConfig.services && siteConfig.services.items) {
        populateServices(siteConfig.services.items);
    }
    
    // Populate portfolio
    if (siteConfig.portfolio) {
        populatePortfolio(siteConfig.portfolio);
    }
    
    // Populate about section
    if (siteConfig.about) {
        populateAbout(siteConfig.about);
    }
    
    // Populate contact information
    if (siteConfig.contact) {
        populateContact(siteConfig.contact);
    }
    
    // Update footer
    if (siteConfig.footer) {
        updateElement('#footerText', siteConfig.footer.text);
        updateElement('#footerCopyright', siteConfig.footer.copyright);
    }
    
    console.log('✅ Content populated successfully');
    
    // Re-observe all elements after content is loaded
    setTimeout(() => {
        observeElements();
    }, 100);
}

function updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element && content) {
        element.textContent = content;
    }
}

function updateElements(selector, content) {
    const elements = document.querySelectorAll(selector);
    if (content) {
        elements.forEach(el => el.textContent = content);
    }
}

/* ====================================
   Services Population
   ==================================== */
function populateServices(services) {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    grid.innerHTML = services.map(service => `
        <div class="service-card fade-in">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

/* ====================================
   Portfolio Population
   ==================================== */

function populatePortfolio(portfolio) {
    // Store portfolio items globally
    portfolioItems = portfolio.items || [];
    
    // Create unified photo gallery
    createPhotoGallery(portfolioItems);
}

/* ====================================
   Unified Photo Gallery
   ==================================== */
let galleryState = {
    currentIndex: 0,
    totalItems: 0,
    isPlaying: true,
    autoScrollInterval: null
};

let lightboxState = {
    currentIndex: 0,
    zoomLevel: 1,
    isDragging: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0
};

function createPhotoGallery(items) {
    const galleryTrack = document.getElementById('galleryTrack');
    const dotsContainer = document.getElementById('galleryDots');
    
    if (!galleryTrack || !items || items.length === 0) return;
    
    galleryState.totalItems = items.length;
    
    // Create gallery items
    galleryTrack.innerHTML = items.map((item, index) => `
        <div class="gallery-item" data-index="${index}">
            <img src="${item.image}" alt="${item.alt || item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <span class="gallery-item-category">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
    
    // Create dots
    const slidesPerView = getSlidesPerView();
    const dotCount = Math.max(1, items.length - slidesPerView + 1);
    dotsContainer.innerHTML = Array.from({ length: dotCount }, (_, i) => `
        <div class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
    `).join('');
    
    // Initialize gallery controls
    initGalleryControls();
    
    // Start auto-scroll
    startGalleryAutoScroll();
}

function initGalleryControls() {
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const playPauseBtn = document.getElementById('galleryPlayPauseBtn');
    const dots = document.querySelectorAll('.gallery-dot');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveGallery(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveGallery(1));
    }
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleGalleryAutoScroll);
    }
    
    // Dots navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            goToGallerySlide(index);
        });
    });
    
    // Click on items to open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openLightbox(index);
        });
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            goToGallerySlide(galleryState.currentIndex);
        }, 250);
    });
}

function getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1440) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
}

function moveGallery(direction) {
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, galleryState.totalItems - slidesPerView);
    
    let newIndex = galleryState.currentIndex + direction;
    
    // Loop around
    if (newIndex < 0) {
        newIndex = maxIndex;
    } else if (newIndex > maxIndex) {
        newIndex = 0;
    }
    
    goToGallerySlide(newIndex);
}

function goToGallerySlide(index) {
    const track = document.getElementById('galleryTrack');
    const items = document.querySelectorAll('.gallery-item');
    const dots = document.querySelectorAll('.gallery-dot');
    
    if (!track || items.length === 0) return;
    
    galleryState.currentIndex = index;
    
    // Calculate slide width including gap
    const slideWidth = items[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const offset = -(slideWidth + gap) * index;
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function startGalleryAutoScroll() {
    stopGalleryAutoScroll();
    
    if (!galleryState.isPlaying) return;
    
    galleryState.autoScrollInterval = setInterval(() => {
        moveGallery(1);
    }, 4000); // Auto-scroll every 4 seconds
}

function stopGalleryAutoScroll() {
    if (galleryState.autoScrollInterval) {
        clearInterval(galleryState.autoScrollInterval);
        galleryState.autoScrollInterval = null;
    }
}

function toggleGalleryAutoScroll() {
    const playPauseBtn = document.getElementById('galleryPlayPauseBtn');
    if (!playPauseBtn) return;
    
    galleryState.isPlaying = !galleryState.isPlaying;
    
    const icon = playPauseBtn.querySelector('i');
    if (galleryState.isPlaying) {
        icon.className = 'fas fa-pause';
        startGalleryAutoScroll();
    } else {
        icon.className = 'fas fa-play';
        stopGalleryAutoScroll();
    }
}

/* ====================================
   Lightbox with Zoom
   ==================================== */
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    if (!lightbox || !portfolioItems[index]) return;
    
    lightboxState.currentIndex = index;
    lightboxState.zoomLevel = 1;
    lightboxState.translateX = 0;
    lightboxState.translateY = 0;
    
    const item = portfolioItems[index];
    
    lightboxImage.src = item.image;
    lightboxImage.alt = item.alt || item.title;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    lightboxCounter.textContent = `${index + 1} / ${portfolioItems.length}`;
    
    updateLightboxImageTransform();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize lightbox controls if not already done
    if (!window.lightboxInitialized) {
        initLightboxControls();
        window.lightboxInitialized = true;
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function initLightboxControls() {
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomResetBtn = document.getElementById('zoomReset');
    const lightbox = document.getElementById('lightbox');
    const imageContainer = document.getElementById('lightboxImageContainer');
    const lightboxImage = document.getElementById('lightboxImage');
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateLightbox(1));
    }
    
    // Zoom controls
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => zoomLightbox(0.2));
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => zoomLightbox(-0.2));
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', resetZoom);
    }
    
    // Click outside to close
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
            case '+':
            case '=':
                zoomLightbox(0.2);
                break;
            case '-':
            case '_':
                zoomLightbox(-0.2);
                break;
            case '0':
                resetZoom();
                break;
        }
    });
    
    // Mouse wheel zoom
    if (imageContainer) {
        imageContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            zoomLightbox(delta);
        });
    }
    
    // Drag to pan when zoomed
    if (lightboxImage) {
        lightboxImage.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch support
        lightboxImage.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag({ clientX: touch.clientX, clientY: touch.clientY });
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!lightboxState.isDragging) return;
            const touch = e.touches[0];
            drag({ clientX: touch.clientX, clientY: touch.clientY });
        });
        
        document.addEventListener('touchend', stopDrag);
    }
}

function navigateLightbox(direction) {
    let newIndex = lightboxState.currentIndex + direction;
    
    if (newIndex < 0) {
        newIndex = portfolioItems.length - 1;
    } else if (newIndex >= portfolioItems.length) {
        newIndex = 0;
    }
    
    openLightbox(newIndex);
}

function zoomLightbox(delta) {
    lightboxState.zoomLevel = Math.max(0.5, Math.min(3, lightboxState.zoomLevel + delta));
    updateLightboxImageTransform();
}

function resetZoom() {
    lightboxState.zoomLevel = 1;
    lightboxState.translateX = 0;
    lightboxState.translateY = 0;
    updateLightboxImageTransform();
}

function updateLightboxImageTransform() {
    const lightboxImage = document.getElementById('lightboxImage');
    if (!lightboxImage) return;
    
    lightboxImage.style.transform = `
        scale(${lightboxState.zoomLevel})
        translate(${lightboxState.translateX}px, ${lightboxState.translateY}px)
    `;
}

function startDrag(e) {
    if (lightboxState.zoomLevel <= 1) return;
    
    lightboxState.isDragging = true;
    lightboxState.startX = e.clientX - lightboxState.translateX;
    lightboxState.startY = e.clientY - lightboxState.translateY;
    
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightboxImage) {
        lightboxImage.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (!lightboxState.isDragging) return;
    
    e.preventDefault();
    lightboxState.translateX = e.clientX - lightboxState.startX;
    lightboxState.translateY = e.clientY - lightboxState.startY;
    updateLightboxImageTransform();
}

function stopDrag() {
    lightboxState.isDragging = false;
    
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightboxImage) {
        lightboxImage.style.cursor = lightboxState.zoomLevel > 1 ? 'move' : 'default';
    }
}

/* ====================================
   OLD CAROUSEL CODE - REMOVE
   ==================================== */
function createPortfolioCarousels(portfolio) {
    // Deprecated - replaced by createPhotoGallery
    console.log('Old carousel function called - using new gallery instead');
}

function initCarousel(categoryId) {
    // Deprecated
}

function moveCarousel(categoryId, direction) {
    // Deprecated
}

function goToSlide(categoryId, index) {
    // Deprecated
}

function startAutoScroll(categoryId) {
    // Deprecated
}

function stopAutoScroll(categoryId) {
    // Deprecated
}

function toggleAutoScroll(categoryId) {
    // Deprecated
}

function showCategory(categoryId) {
    // Deprecated
}

/* ====================================
   About Section Population
   ==================================== */
function populateAbout(about) {
    console.log('👤 Populating about section:', about);
    
    // Populate description
    const descriptionContainer = document.getElementById('aboutDescription');
    if (descriptionContainer && about.paragraphs) {
        descriptionContainer.innerHTML = about.paragraphs.map(para => `
            <p class="about-description">${para}</p>
        `).join('');
    }
    
    // Populate skills
    const skillsContainer = document.getElementById('skillsContainer');
    if (skillsContainer && about.skills) {
        console.log('Skills data:', about.skills);
        skillsContainer.innerHTML = `
            <h3 style="margin-bottom: var(--spacing-md); font-size: 21px; font-weight: 600;">Our Expertise</h3>
            ${about.skills.map(skill => `
                <div class="skill-item fade-in">
                    <div class="skill-header">
                        <span>${skill.name}</span>
                        <span>${skill.percentage}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-progress="${skill.percentage}" style="width: 0%"></div>
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    console.log('✅ About section populated');
}

/* ====================================
   Contact Information Population
   ==================================== */
function populateContact(contact) {
    console.log('📞 Populating contact section:', contact);
    
    // Update contact details
    if (contact.email) {
        console.log('Email value:', contact.email.value);
        updateElement('#contactEmail', contact.email.value);
        const emailLink = document.getElementById('contactEmailLink');
        if (emailLink) {
            emailLink.href = contact.email.link || `mailto:${contact.email.value}`;
            emailLink.textContent = contact.email.linkText || 'Send a message';
        }
    }
    
    if (contact.phone) {
        console.log('Phone value:', contact.phone.value);
        updateElement('#contactPhone', contact.phone.value);
        const phoneLink = document.getElementById('contactPhoneLink');
        if (phoneLink) {
            phoneLink.href = contact.phone.link || `tel:${contact.phone.value.replace(/\s/g, '')}`;
            phoneLink.textContent = contact.phone.linkText || 'Call us now';
        }
    }
    
    if (contact.location) {
        console.log('Location value:', contact.location.value);
        updateElement('#contactLocation', contact.location.value);
    }
    
    // Populate social links
    const socialContainer = document.getElementById('socialLinks');
    if (socialContainer && contact.socialLinks) {
        socialContainer.innerHTML = contact.socialLinks.map(social => `
            <a href="${social.url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${social.platform}">
                <i class="${social.icon}"></i>
            </a>
        `).join('');
    }
    
    console.log('✅ Contact section populated');
}

/* ====================================
   Navigation & Smooth Scrolling
   ==================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScroll(target);
            navMenu.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 60;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/* ====================================
   Portfolio Filtering
   ==================================== */
function initPortfolioFilter() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Show/hide categories based on filter
            const filter = e.target.dataset.filter;
            currentFilter = filter;
            showCategory(filter);
            
            // Re-observe elements for fade-in animation
            setTimeout(() => observeElements(), 100);
        }
    });
}

/* ====================================
   OLD Lightbox Code - REMOVED (replaced with new zoom lightbox)
   ==================================== */
// Old lightbox code removed - see unified gallery lightbox above

/* ====================================
   Scroll Animations
   ==================================== */
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    const progress = entry.target.querySelector('.skill-progress');
                    if (progress) {
                        const targetWidth = progress.dataset.progress;
                        setTimeout(() => {
                            progress.style.width = `${targetWidth}%`;
                        }, 100);
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/* ====================================
   Form Handling
   ==================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        showSuccess('Thank you! Your message has been sent successfully.');
        
        // Reset form
        form.reset();
    });
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #34c759;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
        z-index: 10000;
        font-size: 14px;
        max-width: 90%;
        animation: slideDown 0.3s ease;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

/* ====================================
   Parallax Effect
   ==================================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxSpeed = 0.5;
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });
}

/* ====================================
   Dark Mode Toggle
   ==================================== */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        
        console.log(`🌓 Theme switched to: ${newTheme}`);
    });
    
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            lightIcon.classList.remove('active');
            darkIcon.classList.add('active');
        } else {
            darkIcon.classList.remove('active');
            lightIcon.classList.add('active');
        }
    }
}

/* ====================================
   Loading Animation
   ==================================== */
function showPageLoadAnimation() {
    // Add entrance animation to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

/* ====================================
   Initialization
   ==================================== */
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Apple-style portfolio...');
    
    // Initialize all features
    initNavigation();
    initPortfolioFilter();
    // initLightbox(); // Now initialized dynamically when gallery is opened
    initContactForm();
    initParallax();
    initDarkMode();
    showPageLoadAnimation();
    
    // Load configuration and populate content
    // observeElements() will be called after content is loaded
    await loadConfig();
    
    console.log('✅ Portfolio initialized successfully');
});

// Handle window resize for gallery responsiveness
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Gallery handles its own resize via initGalleryControls
        if (galleryState && galleryState.currentIndex !== undefined) {
            goToGallerySlide(galleryState.currentIndex);
        }
```
    }, 250);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);