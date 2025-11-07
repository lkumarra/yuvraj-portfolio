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
// Carousel state
let carousels = {};
let autoScrollIntervals = {};

function populatePortfolio(portfolio) {
    // Store portfolio items globally
    portfolioItems = portfolio.items || [];
    
    // Populate filters
    const filtersContainer = document.getElementById('portfolioFilters');
    if (filtersContainer && portfolio.categories) {
        const categoryButtons = portfolio.categories.map(cat => `
            <button class="filter-btn" data-filter="${cat.id}">${cat.name}</button>
        `).join('');
        filtersContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            ${categoryButtons}
        `;
    }
    
    // Create carousels for each category
    createPortfolioCarousels(portfolio);
}

function createPortfolioCarousels(portfolio) {
    const container = document.getElementById('portfolioCarousels');
    if (!container) return;
    
    // Group items by category
    const categorizedItems = {
        'all': portfolioItems
    };
    
    // Group items by their categories
    if (portfolio.categories) {
        portfolio.categories.forEach(cat => {
            const items = portfolioItems.filter(item => item.category === cat.id);
            if (items.length > 0) {
                categorizedItems[cat.id] = items;
            }
        });
    }
    
    // Create carousels for each category that has items
    const carouselsHTML = [];
    
    // Add "All" carousel first
    if (categorizedItems['all'] && categorizedItems['all'].length > 0) {
        carouselsHTML.push(createCarouselHTML({
            id: 'all',
            name: 'All Projects',
            items: categorizedItems['all']
        }));
    }
    
    // Add individual category carousels
    if (portfolio.categories) {
        portfolio.categories.forEach(cat => {
            if (cat.id !== 'all' && categorizedItems[cat.id] && categorizedItems[cat.id].length > 0) {
                carouselsHTML.push(createCarouselHTML({
                    id: cat.id,
                    name: cat.name,
                    items: categorizedItems[cat.id]
                }));
            }
        });
    }
    
    container.innerHTML = carouselsHTML.join('');
    
    // Initialize all carousels
    Object.keys(categorizedItems).forEach(categoryId => {
        if (categorizedItems[categoryId].length > 0) {
            initCarousel(categoryId);
        }
    });
    
    // Show only "all" category initially
    showCategory('all');
}

function createCarouselHTML(category) {
    return `
        <div class="portfolio-category fade-in" data-category="${category.id}">
            <div class="category-header">
                <h3 class="category-title">${category.name}</h3>
                <div class="carousel-controls">
                    <button class="carousel-btn play-pause" data-carousel="${category.id}" aria-label="Toggle auto-scroll">
                        <i class="fas fa-pause"></i>
                    </button>
                    <button class="carousel-btn prev" data-carousel="${category.id}" aria-label="Previous">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-btn next" data-carousel="${category.id}" aria-label="Next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="carousel-container">
                <div class="carousel-track" data-carousel="${category.id}">
                    ${category.items.map((item, localIndex) => {
                        // Find the global index in portfolioItems for lightbox
                        const globalIndex = portfolioItems.findIndex(p => 
                            p.image === item.image && p.title === item.title
                        );
                        return `
                        <div class="carousel-slide" data-index="${globalIndex}" data-category="${category.id}">
                            <img src="${item.image}" alt="${item.title}" loading="lazy">
                            <div class="portfolio-overlay">
                                <div class="portfolio-content">
                                    <h3>${item.title}</h3>
                                    <p>${item.description}</p>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
            <div class="carousel-dots" data-carousel="${category.id}">
                ${category.items.map((_, index) => `
                    <div class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                `).join('')}
            </div>
        </div>
    `;
}

function initCarousel(categoryId) {
    const track = document.querySelector(`.carousel-track[data-carousel="${categoryId}"]`);
    const slides = track.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector(`.carousel-btn.prev[data-carousel="${categoryId}"]`);
    const nextBtn = document.querySelector(`.carousel-btn.next[data-carousel="${categoryId}"]`);
    const playPauseBtn = document.querySelector(`.carousel-btn.play-pause[data-carousel="${categoryId}"]`);
    const dots = document.querySelectorAll(`.carousel-dots[data-carousel="${categoryId}"] .carousel-dot`);
    
    if (!track || slides.length === 0) return;
    
    // Initialize carousel state
    carousels[categoryId] = {
        currentIndex: 0,
        totalSlides: slides.length,
        isPlaying: true,
        track: track,
        slides: slides,
        dots: dots
    };
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveCarousel(categoryId, -1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveCarousel(categoryId, 1));
    }
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => toggleAutoScroll(categoryId));
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(categoryId, index));
    });
    
    // Click on slides to open lightbox
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const index = parseInt(slide.dataset.index);
            openLightbox(index);
        });
    });
    
    // Start auto-scroll
    startAutoScroll(categoryId);
}

function moveCarousel(categoryId, direction) {
    const carousel = carousels[categoryId];
    if (!carousel) return;
    
    let newIndex = carousel.currentIndex + direction;
    
    // Calculate how many slides fit in view
    const slidesPerView = window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
    const maxIndex = Math.max(0, carousel.totalSlides - slidesPerView);
    
    // Loop around
    if (newIndex < 0) {
        newIndex = maxIndex;
    } else if (newIndex > maxIndex) {
        newIndex = 0;
    }
    
    goToSlide(categoryId, newIndex);
}

function goToSlide(categoryId, index) {
    const carousel = carousels[categoryId];
    if (!carousel) return;
    
    carousel.currentIndex = index;
    
    // Calculate slide width including gap
    const slideWidth = carousel.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(carousel.track).gap) || 0;
    const offset = -(slideWidth + gap) * index;
    
    carousel.track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    carousel.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function startAutoScroll(categoryId) {
    stopAutoScroll(categoryId); // Clear any existing interval
    
    const carousel = carousels[categoryId];
    if (!carousel || !carousel.isPlaying) return;
    
    autoScrollIntervals[categoryId] = setInterval(() => {
        moveCarousel(categoryId, 1);
    }, 4000); // Auto-scroll every 4 seconds
}

function stopAutoScroll(categoryId) {
    if (autoScrollIntervals[categoryId]) {
        clearInterval(autoScrollIntervals[categoryId]);
        autoScrollIntervals[categoryId] = null;
    }
}

function toggleAutoScroll(categoryId) {
    const carousel = carousels[categoryId];
    const playPauseBtn = document.querySelector(`.carousel-btn.play-pause[data-carousel="${categoryId}"]`);
    
    if (!carousel || !playPauseBtn) return;
    
    carousel.isPlaying = !carousel.isPlaying;
    
    const icon = playPauseBtn.querySelector('i');
    if (carousel.isPlaying) {
        icon.className = 'fas fa-pause';
        startAutoScroll(categoryId);
    } else {
        icon.className = 'fas fa-play';
        stopAutoScroll(categoryId);
    }
}

function showCategory(categoryId) {
    const allCategories = document.querySelectorAll('.portfolio-category');
    allCategories.forEach(cat => {
        const catId = cat.dataset.category;
        if (categoryId === 'all' || catId === categoryId || catId === 'all') {
            cat.classList.remove('hidden');
        } else {
            cat.classList.add('hidden');
        }
    });
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
   Lightbox
   ==================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Navigation
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    currentLightboxIndex = index;
    lightboxImage.src = portfolioItems[index].image;
    lightboxImage.alt = portfolioItems[index].title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = portfolioItems.length - 1;
    } else if (currentLightboxIndex >= portfolioItems.length) {
        currentLightboxIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = portfolioItems[currentLightboxIndex].image;
    lightboxImage.alt = portfolioItems[currentLightboxIndex].title;
}

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
    initLightbox();
    initContactForm();
    initParallax();
    initDarkMode();
    showPageLoadAnimation();
    
    // Load configuration and populate content
    // observeElements() will be called after content is loaded
    await loadConfig();
    
    console.log('✅ Portfolio initialized successfully');
});

// Handle window resize for carousel responsiveness
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reset all carousels to first slide on resize
        Object.keys(carousels).forEach(categoryId => {
            goToSlide(categoryId, 0);
        });
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