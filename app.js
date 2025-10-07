// Application State
const app = {
    currentPage: 'home',
    isMenuOpen: false,
    countersAnimated: false
};

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const contactForm = document.getElementById('contact-form');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeScrollEffects();
    
    // Show home page by default
    showPage('home');
    
    console.log('Ge8tfit-First application initialized successfully');
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
                closeMobileMenu();
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });

    // Handle footer navigation links
    const footerLinks = document.querySelectorAll('.footer-links a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
                
                // Update corresponding nav link
                const correspondingNavLink = document.querySelector(`.nav-link[data-page="${page}"]`);
                if (correspondingNavLink) {
                    updateActiveNavLink(correspondingNavLink);
                }
            }
        });
    });

    // Handle hash-based navigation
    window.addEventListener('hashchange', handleHashNavigation);
    
    // Handle initial hash if present
    if (window.location.hash) {
        handleHashNavigation();
    }
}

function toggleMobileMenu() {
    app.isMenuOpen = !app.isMenuOpen;
    
    if (app.isMenuOpen) {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    app.isMenuOpen = false;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function showPage(pageName) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        app.currentPage = pageName;
        
        // Update URL hash
        history.pushState(null, null, `#${pageName}`);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger page-specific animations
        triggerPageAnimations(pageName);
        
        // Update page title
        updatePageTitle(pageName);
    }
}

function handleHashNavigation() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showPage(hash);
        
        // Update corresponding nav link
        const correspondingNavLink = document.querySelector(`.nav-link[data-page="${hash}"]`);
        if (correspondingNavLink) {
            updateActiveNavLink(correspondingNavLink);
        }
    }
}

function updatePageTitle(pageName) {
    const titles = {
        home: 'Ge8tfit-First - Abu Dhabi\'s Premier Personal Training',
        about: 'About Us - Ge8tfit-First',
        services: 'Our Services - Ge8tfit-First',
        programs: 'Training Programs - Ge8tfit-First',
        contact: 'Contact Us - Ge8tfit-First'
    };
    
    document.title = titles[pageName] || titles.home;
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                
                // Trigger counter animation if this is a stats section
                if (entry.target.classList.contains('hero-stats') || 
                    entry.target.classList.contains('about-stats') ||
                    entry.target.classList.contains('metrics-grid')) {
                    animateCounters(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .value-card, .program-card, .hero-stats, .about-stats, .metrics-grid, .process-step, .reason-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function animateCounters(container) {
    const counters = container.querySelectorAll('.stat-number[data-target], .metric-number[data-target]');
    
    counters.forEach(counter => {
        // Skip if already animated
        if (counter.classList.contains('animated')) return;
        
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
                counter.classList.add('animated');
            }
            
            // Format number display
            if (target >= 1000) {
                counter.textContent = Math.floor(current).toLocaleString();
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

function triggerPageAnimations(pageName) {
    // Reset counter animation flag when switching pages
    if (pageName !== app.currentPage) {
        app.countersAnimated = false;
        
        // Remove animated class from counters to allow re-animation
        const counters = document.querySelectorAll('.stat-number.animated, .metric-number.animated');
        counters.forEach(counter => {
            counter.classList.remove('animated');
        });
    }

    // Page-specific animations
    switch (pageName) {
        case 'home':
            animateHeroElements();
            break;
        case 'about':
            animateAboutElements();
            break;
        case 'services':
            animateServiceElements();
            break;
        case 'programs':
            animateProgramElements();
            break;
        case 'contact':
            animateContactElements();
            break;
    }
}

function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        setTimeout(() => heroTitle.classList.add('animate-fade-in-up'), 200);
    }
    if (heroSubtitle) {
        setTimeout(() => heroSubtitle.classList.add('animate-fade-in-up'), 400);
    }
    if (heroButtons) {
        setTimeout(() => heroButtons.classList.add('animate-fade-in-up'), 600);
    }
}

function animateAboutElements() {
    const aboutText = document.querySelector('.about-text');
    const aboutStats = document.querySelector('.about-stats');
    
    if (aboutText) {
        setTimeout(() => aboutText.classList.add('animate-fade-in-up'), 200);
    }
    if (aboutStats) {
        setTimeout(() => {
            aboutStats.classList.add('animate-fade-in-up');
            animateCounters(aboutStats);
        }, 400);
    }
}

function animateServiceElements() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    serviceCards.forEach((card, index) => {
        setTimeout(() => card.classList.add('animate-fade-in-up'), index * 200);
    });
}

function animateProgramElements() {
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach((card, index) => {
        setTimeout(() => card.classList.add('animate-fade-in-up'), index * 200);
    });
}

function animateContactElements() {
    const contactForm = document.querySelector('.contact-form-section');
    const contactInfo = document.querySelector('.contact-info-section');
    
    if (contactForm) {
        setTimeout(() => contactForm.classList.add('animate-fade-in-up'), 200);
    }
    if (contactInfo) {
        setTimeout(() => contactInfo.classList.add('animate-fade-in-up'), 400);
    }
}

// Form Handling
function initializeFormHandling() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(data)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Log form data (in production, send to server)
        console.log('Form submitted:', data);
        
    }, 2000);
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'service'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = data[field];
        if (!value || value.trim() === '') {
            showFieldError(field, 'This field is required.');
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address.');
        isValid = false;
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number.');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(fieldName);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'This field is required.');
        return;
    }
    
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(fieldName, 'Please enter a valid email address.');
        return;
    }
    
    if (fieldName === 'phone' && value && !isValidPhone(value)) {
        showFieldError(fieldName, 'Please enter a valid phone number.');
        return;
    }
}

function clearFieldError(e) {
    const fieldName = typeof e === 'string' ? e : e.target.name;
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff4444;
            font-size: 12px;
            margin-top: 4px;
        `;
        
        field.parentElement.appendChild(errorElement);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Scroll Effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar scroll effect
        if (navbar) {
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
        
        lastScrollTop = scrollTop;
    }, false);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colors = {
        success: '#D4AF37',
        error: '#ff4444',
        warning: '#ff8800',
        info: '#0088ff'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(26, 26, 26, 0.95);
        border: 1px solid ${colors[type]};
        border-left: 4px solid ${colors[type]};
        border-radius: 8px;
        padding: 16px;
        color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a page navigation link
            if (this.hasAttribute('data-page')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Keyboard Navigation Support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape' && app.isMenuOpen) {
            closeMobileMenu();
        }
        
        // Arrow keys for navigation (when focused on nav)
        if (e.target.classList.contains('nav-link')) {
            const navItems = Array.from(navLinks);
            const currentIndex = navItems.indexOf(e.target);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % navItems.length;
                navItems[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
                navItems[prevIndex].focus();
            }
        }
    });
}

// Performance Optimization
function initializePerformanceOptimizations() {
    // Lazy loading for images (if any were added)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Prefetch next page content (simple implementation)
    const prefetchLinks = document.querySelectorAll('.nav-link[data-page]');
    prefetchLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const page = this.getAttribute('data-page');
            // Could implement actual prefetching logic here
            console.log(`Prefetching ${page} page`);
        });
    });
}

// Error Handling
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        showNotification('An error occurred. Please refresh the page.', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        showNotification('A network error occurred. Please try again.', 'error');
        e.preventDefault();
    });
}

// Analytics and Tracking (placeholder)
function initializeAnalytics() {
    // Track page views
    function trackPageView(pageName) {
        console.log(`Page view: ${pageName}`);
        // In production, send to analytics service
        // gtag('config', 'GA_MEASUREMENT_ID', { page_title: pageName });
    }
    
    // Track form submissions
    function trackFormSubmission(formType) {
        console.log(`Form submission: ${formType}`);
        // In production, send to analytics service
    }
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            const buttonText = e.target.textContent.trim();
            console.log(`Button click: ${buttonText}`);
            // In production, send to analytics service
        }
    });
    
    // Expose tracking functions
    window.trackPageView = trackPageView;
    window.trackFormSubmission = trackFormSubmission;
}

// Add CSS for animations and notifications
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 16px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .form-control.error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1) !important;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
    
    /* Focus styles for accessibility */
    .nav-link:focus-visible {
        outline: 2px solid #D4AF37;
        outline-offset: 2px;
        border-radius: 4px;
    }
    
    .btn:focus-visible {
        outline: 2px solid #D4AF37;
        outline-offset: 2px;
    }
    
    /* Smooth transitions for better UX */
    .page {
        transition: opacity 0.3s ease-in-out;
    }
    
    .page:not(.active) {
        opacity: 0;
        pointer-events: none;
    }
`;

document.head.appendChild(additionalStyles);

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    initializeKeyboardNavigation();
    initializePerformanceOptimizations();
    initializeErrorHandling();
    initializeAnalytics();
    
    console.log('All Ge8tfit-First features initialized');
});

// Export functions for potential external use
window.Ge8tfitApp = {
    showPage,
    showNotification,
    toggleMobileMenu,
    animateCounters,
    trackPageView: window.trackPageView,
    trackFormSubmission: window.trackFormSubmission
};