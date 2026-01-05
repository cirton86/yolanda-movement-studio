document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initAccordions();
    initScrollRevel();
    initCarousel();
    initModal();
    initFloatingImages();
    initLibraryFilters();
});

// ... (existing functions)

// 7. Movement Library Filters
function initLibraryFilters() {
    const filterButtons = document.querySelectorAll('.section-sm .flex button'); // Better selector might be needed if structure changes
    const videoCards = document.querySelectorAll('.video-card');

    if (filterButtons.length === 0 || videoCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
             // 1. Update Buttons State
            filterButtons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');

            // 2. Filter Content
            const category = btn.textContent.trim();

            videoCards.forEach(card => {
                // Support both new category badge and legacy accent badge
                const badge = card.querySelector('.badge-category') || card.querySelector('.badge-accent');
                if (!badge) return;
                
                const cardCategory = badge.textContent.trim();

                if (category === 'All' || cardCategory === category) {
                    card.style.display = 'block';
                    // Re-trigger scroll reveal if hidden
                    setTimeout(() => card.classList.add('active'), 50); 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 1. Mobile Menu Logic
function initMobileMenu() {
    // Support both old (.mobile-toggle) and new (.menu-toggle) classes
    const toggle = document.querySelector('.mobile-toggle') || document.querySelector('.menu-toggle');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
             // Create overlay nav if not exists
             let overlay = document.querySelector('.mobile-overlay');
             if (!overlay) {
                 overlay = document.createElement('div');
                 overlay.className = 'mobile-overlay';
                 overlay.innerHTML = `
                    <div class="mobile-nav-content">
                        <button class="close-menu">&times;</button>
                        <nav>
                            <a href="index.html">Home</a>
                            <a href="about.html">About</a>
                            <a href="programs.html">Programs</a>
                            <a href="results.html">Results</a>
                            <a href="movement-library.html">Library</a>
                            <a href="thank-you.html">Thank You</a>
                            <a href="faq.html">FAQ</a>
                            <a href="contact.html">Contact</a>
                        </nav>
                    </div>
                 `;
                 document.body.appendChild(overlay);
                 
                 // Styles
                 overlay.style.position = 'fixed';
                 overlay.style.top = '0';
                 overlay.style.left = '0';
                 overlay.style.width = '100%';
                 overlay.style.height = '100%';
                 overlay.style.background = '#0A0A0A';
                 overlay.style.zIndex = '2000';
                 overlay.style.display = 'flex';
                 overlay.style.alignItems = 'center';
                 overlay.style.justifyContent = 'center';
                 overlay.style.opacity = '0';
                 overlay.style.transition = 'opacity 0.3s ease';
                 
                 const nav = overlay.querySelector('nav');
                 nav.style.display = 'flex';
                 nav.style.flexDirection = 'column';
                 nav.style.gap = '2rem';
                 nav.style.textAlign = 'center';
                 
                 const links = nav.querySelectorAll('a');
                 links.forEach(link => {
                     link.style.fontFamily = "'Cormorant Garamond', serif";
                     link.style.fontSize = '2rem';
                     link.style.color = 'white';
                     link.style.textDecoration = 'none';
                 });

                 const close = overlay.querySelector('.close-menu');
                 close.style.position = 'absolute';
                 close.style.top = '20px';
                 close.style.right = '20px';
                 close.style.fontSize = '3rem';
                 close.style.color = 'white';
                 close.style.background = 'none';
                 close.style.border = 'none';
                 close.style.cursor = 'pointer';
                 
                 close.addEventListener('click', () => {
                     overlay.style.opacity = '0';
                     setTimeout(() => overlay.remove(), 300);
                 });
             }
             
             // Show it
             overlay.offsetHeight; 
             overlay.style.opacity = '1';
        });
    }
}

// 2. Accordion Logic
// 2. Accordion Logic
function initAccordions() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            
            // Icon handling (supports generic Plus or Chevron)
            const icon = trigger.querySelector('[data-lucide="plus"]') || 
                         trigger.querySelector('.lucide-plus') ||
                         trigger.querySelector('[data-lucide="chevron-down"]') ||
                         trigger.querySelector('.lucide-chevron-down') ||
                         trigger.querySelector('.icon-chevron');
            
            // Toggle Content
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
                if(icon) icon.style.transform = 'rotate(0deg)';
            } else {
                // Optional: Close others
                triggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        const otherContent = otherTrigger.nextElementSibling;
                        const otherIcon = otherTrigger.querySelector('[data-lucide="plus"]') || 
                                          otherTrigger.querySelector('.lucide-plus') ||
                                          otherTrigger.querySelector('[data-lucide="chevron-down"]') ||
                                          otherTrigger.querySelector('.lucide-chevron-down') ||
                                          otherTrigger.querySelector('.icon-chevron');
                        
                        if(otherContent) {
                            otherContent.style.maxHeight = null;
                            otherContent.classList.remove('active');
                        }
                        if(otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
                
                // Rotation Logic
                if(icon) {
                    // Check if is plus or chevron
                    const isPlus = icon.getAttribute('data-lucide') === 'plus' || icon.classList.contains('lucide-plus');
                    icon.style.transform = isPlus ? 'rotate(45deg)' : 'rotate(180deg)';
                }
            }
        });
    });
}

// 3. Scroll Reveal
function initScrollRevel() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// 4. Carousel Logic
function initCarousel() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card-wrapper');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    const container = document.querySelector('.testimonial-carousel-container') || track?.parentElement;
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let autoplayInterval;
    const intervalTime = 6000;
    
    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                 goToSlide(index);
                 resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
    
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        const translateX = -(currentIndex * 100);
        track.style.transform = `translateX(${translateX}%)`;
        updateDots();
    }
    
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, intervalTime);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
    });
    
    // Pause on hover
    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }
    
    // Start
    startAutoplay();
}

// 5. Modal System for Floating Images
// 5. Modal System for Floating Images
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalInspiration = document.getElementById('modalInspiration');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    if (!modal) return;
    
    let galleryItems = [];
    let currentIndex = 0;
    
    // Refresh modal trigger list
    function updateGalleryItems() {
        galleryItems = Array.from(document.querySelectorAll('.open-modal'));
    }
    updateGalleryItems();
    
    function showImage(index) {
        if (!galleryItems.length) return;
        
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        
        currentIndex = index;
        const item = galleryItems[currentIndex];
        
        // Get data from attributes or child img
        let imageSrc = item.dataset.image;
        let title = item.dataset.title;
        let message = item.dataset.message;
        
        if (!imageSrc) {
            const img = item.querySelector('img');
            if (img) imageSrc = img.src;
        }
        
        modalImage.src = imageSrc;
        modalImage.alt = title || 'Gallery Image';
        modalTitle.textContent = title || '';
        modalInspiration.textContent = message || '';
        
        if (!modal.classList.contains('active')) {
            modal.classList.add('active');
        }
    }
    
    // Attach click listeners to all triggers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Re-query in case DOM changed, or just use current list
            updateGalleryItems(); 
            // Find current index in the potentially updated list
            const clickedIndex = galleryItems.indexOf(this);
            showImage(clickedIndex !== -1 ? clickedIndex : index);
        });
    });
    
    // Navigation Buttons
    if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });
    
    if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });
    
    // Close Logic
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
             modalImage.src = ''; // Clear src to stop video/loading
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
}

// 6. Floating Image Scroll Reveal
function initFloatingImages() {
    const floatingContainers = document.querySelectorAll('[data-scroll-reveal]');
    
    if (floatingContainers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    floatingContainers.forEach(container => {
        observer.observe(container);
    });
}
