// ============================================
// YOLANDA R. MOVEMENT STUDIO
// Interactive Behaviors & Animations
// ============================================

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Optional: unobserve after revealing
      // revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Observe all elements with 'reveal' class
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => revealObserver.observe(el));

  // Initialize specific features
  initMobileMenu();
  initSmoothScroll();
  initFormValidation();
  initScrollAnimations();
  initStickyCTA();
  initBackToTop();
  initScrollProgressBar();
  initAccordions();
  initStaggeredCards();
  
  // Initialize Optimized Scroll Handler
  initOptimizedScroll();
});

// ============================================
// OPTIMIZED SCROLL HANDLER (Centralized)
// ============================================
function initOptimizedScroll() {
  let tick = false;

  window.addEventListener('scroll', () => {
    if (!tick) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Call decoupled update functions
        updateActiveNavLink();
        updateHeroParallax();
        
        // Note: BackToTop and ProgressBar have their own lightweight listeners
        // which could be moved here but are less critical.
        
        tick = false;
      });
      tick = true;
    }
  }, { passive: true });
}
function initStickyCTA() {
  const stickyCTA = document.createElement('div');
  stickyCTA.innerHTML = '<a href="contact.html" class="btn btn-primary" style="padding: 0.75rem 2rem; box-shadow: 0 4px 12px rgba(247, 55, 24, 0.4);">Book Free Assessment</a>';
  stickyCTA.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(10px); padding: 1rem; text-align: center; z-index: 999; transform: translateY(-100%); transition: transform 0.3s ease; border-bottom: 1px solid var(--color-gray-800);';
  document.body.appendChild(stickyCTA);

  // Show after scrolling past hero
  const hero = document.querySelector('.section-hero') || document.body;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If hero is NOT intersecting (we scrolled past it), show CTA
      if (!entry.isIntersecting) {
        stickyCTA.style.transform = 'translateY(0)';
      } else {
        stickyCTA.style.transform = 'translateY(-100%)';
      }
    });
  }, { threshold: 0 }); // Promptly active when hero leaves view
  
  observer.observe(hero);
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.style.cssText = 'position: fixed; bottom: 100px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--color-accent); color: white; border: none; font-size: 24px; cursor: pointer; opacity: 0; transition: opacity 0.3s, transform 0.3s; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      backToTop.style.opacity = '1';
      backToTop.style.pointerEvents = 'all';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.pointerEvents = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.addEventListener('mouseenter', () => backToTop.style.transform = 'scale(1.1)');
  backToTop.addEventListener('mouseleave', () => backToTop.style.transform = 'scale(1)');
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: var(--color-accent); z-index: 9999; transition: width 0.1s;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Prevent division by zero
    if (windowHeight <= 0) return;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// ============================================
// SCROLL ANIMATIONS (Consolidated)
// ============================================

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when clicking on a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if it's just '#'
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// FORM VALIDATION & HANDLING
// ============================================
function initFormValidation() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateForm(data)) {
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    try {
      // await submitContactForm(data);
      
      // For now, just show success message
      setTimeout(() => {
        showFormMessage('success', 'Thank you for reaching out. I\'ll be in touch soon.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
      
    } catch (error) {
      showFormMessage('error', 'Something went wrong. Please try again or email directly.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function validateForm(data) {
  const { name, email, message } = data;
  
  if (!name || name.trim().length < 2) {
    showFormMessage('error', 'Please enter your name.');
    return false;
  }
  
  if (!email || !isValidEmail(email)) {
    showFormMessage('error', 'Please enter a valid email address.');
    return false;
  }
  
  if (!message || message.trim().length < 10) {
    showFormMessage('error', 'Please share a bit more about what you\'re looking for.');
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFormMessage(type, message) {
  // Remove existing messages
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message-${type}`;
  messageEl.textContent = message;
  
  const form = document.querySelector('.contact-form');
  form.insertBefore(messageEl, form.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

// Active Nav Link Logic - Moved to centralized scroll handler
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ============================================
// STAGGERED CARD ANIMATIONS
// ============================================
function staggerCards() {
  const cardGrids = document.querySelectorAll('.card-grid');
  
  cardGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 100}ms`;
    });
  });
}

// Initialize staggered animations
document.addEventListener('DOMContentLoaded', staggerCards);

// ============================================
// UTILITY: Debounce function for performance
// ============================================
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

// ============================================
// AI ASSISTANT WIDGET CONTROLLER
// ============================================
// YolandaAI class definition and initialization moved to ai-agent.js


// ===================================
// FAQ ACCORDION - ENHANCED
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach((question, index) => {
    const faqItem = question.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    
    // Add ARIA attributes for accessibility
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', `faq-answer-${index}`);
    answer.setAttribute('id', `faq-answer-${index}`);
    answer.setAttribute('role', 'region');
    
    question.addEventListener('click', () => {
      const isActive = faqItem.classList.contains('faq-active');
      
      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('faq-active');
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current item
      if (!isActive) {
        faqItem.classList.add('faq-active');
        question.setAttribute('aria-expanded', 'true');
        
        // Smooth scroll to item if it's below viewport
        setTimeout(() => {
          const rect = faqItem.getBoundingClientRect();
          if (rect.top < 100) {
            faqItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      } else {
        question.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Keyboard navigation
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
});

// ===================================
// FAQ CATEGORY FILTERING
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.faq-filter-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter FAQ items
      faqItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category');
        
        if (category === 'all' || (itemCategories && itemCategories.includes(category))) {
          item.classList.add('faq-visible');
          item.style.display = 'block';
        } else {
          item.classList.remove('faq-visible');
          item.classList.remove('faq-active'); // Close if open
          item.style.display = 'none';
        }
      });
      
      // Smooth scroll to FAQ container
      const faqContainer = document.querySelector('.faq-container');
      if (faqContainer) {
        faqContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
  
  // Initialize - show all items
  faqItems.forEach(item => {
    item.classList.add('faq-visible');
    item.style.display = 'block';
  });
});

// ===================================
// FAQ "SHOW MORE" FUNCTIONALITY
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const showAllBtn = document.getElementById('show-all-faqs');
  
  if (showAllBtn) {
    showAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const hiddenFaqs = document.querySelectorAll('.faq-hidden-initially');
      const isShowing = showAllBtn.textContent === 'View all FAQs';
      
      hiddenFaqs.forEach(faq => {
        if (isShowing) {
          faq.classList.remove('faq-hidden-initially');
          faq.style.display = 'block';
        } else {
          faq.classList.add('faq-hidden-initially');
          faq.style.display = 'none';
        }
      });
      
      // Update button text
      showAllBtn.textContent = isShowing ? 'Show less FAQs' : 'View all FAQs';
      
      // Scroll to FAQ section if showing less
      if (!isShowing) {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
});

// ===================================
// TESTIMONIAL CAROUSEL & FILTERING
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  
  // Elements
  const allCards = Array.from(document.querySelectorAll('.testimonial-card'));
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  const filterBtns = document.querySelectorAll('.testimonial-filters .filter-btn');
  
  // State
  let currentCards = [...allCards]; // Start with all
  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let autoPlayTimer;
  
  // 1. Initialize
  function updateCarousel() {
    // Clear current track content
    track.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Add filtered cards to track
    if (currentCards.length === 0) {
      // Handle empty state if needed
      track.innerHTML = '<div style="text-align:center; padding: 2rem; color: #fff;">No stories found in this category.</div>';
      return;
    }
    
    currentCards.forEach(card => {
      // Ensure card is visible
      card.style.display = 'block';
      track.appendChild(card);
    });
    
    // Generate dots
    currentCards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    // Reset position
    currentIndex = 0;
    updateTrackPosition();
  }
  
  function goToSlide(index) {
    if (index < 0) index = currentCards.length - 1;
    if (index >= currentCards.length) index = 0;
    
    currentIndex = index;
    updateTrackPosition();
    resetAutoPlay();
  }
  
  function updateTrackPosition() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }
  
  // 2. Filter Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Visual active state
      filterBtns.forEach(b => b.classList.remove('active'));
      const buttons = document.querySelectorAll(`.testimonial-filters .filter-btn[data-filter="${btn.dataset.filter}"]`);
      buttons.forEach(b => b.classList.add('active'));
      
      const category = btn.dataset.filter;
      
      // Filter items
      if (category === 'all') {
        currentCards = [...allCards];
      } else {
        currentCards = allCards.filter(card => card.dataset.category === category);
      }
      
      updateCarousel();
    });
  });
  
  // 3. Navigation Controls
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // 4. Touch / Swipe Support
  track.parentElement.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    resetAutoPlay();
  }, { passive: true });
  
  track.parentElement.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Threshold
      if (diff > 0) goToSlide(currentIndex + 1); // Swipe Left -> Next
      else goToSlide(currentIndex - 1); // Swipe Right -> Prev
    }
    isDragging = false;
  }, { passive: true });
  
  // 5. Auto Play
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); // 5 seconds
  }
  
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }
  
  // Setup
  updateCarousel();
  startAutoPlay();
  
  // Handle resize to fix widths
  window.addEventListener('resize', updateTrackPosition);
});

// ============================================
// ENHANCED SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  // Parallax logic moved to centralized handler
  const heroSection = document.querySelector('.section-hero');
  if (heroSection) {
    // Initial check
    heroSection.style.transform = `translateY(0px)`;
  }
}

function updateHeroParallax() {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector('.section-hero');
  
  if (heroSection && scrolled < window.innerHeight) {
    heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    heroSection.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
  }
}

// ============================================
// CARD GRID STAGGER ANIMATIONS
// ============================================
function initStaggeredCards() {
  const cardGridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('active');
          }, index * 100);
        });
        cardGridObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all card grids
  const cardGrids = document.querySelectorAll('.card-grid');
  cardGrids.forEach(grid => cardGridObserver.observe(grid));
}

// ============================================
// ACCORDION SYSTEM
// ============================================
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');

  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Toggle current
      header.setAttribute('aria-expanded', !isExpanded);
      content.classList.toggle('active');

      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }

      // Optional: Close others in the same group?
      // For now, allow multiple open for flexibility
    });
  });

  // Handle window resize to recalculate heights of open items
  window.addEventListener('resize', debounce(() => {
    document.querySelectorAll('.accordion-content.active').forEach(content => {
      content.style.maxHeight = content.scrollHeight + "px";
    });
  }, 200));
}

// ============================================
// FORM ENHANCEMENT - VISUAL FEEDBACK
// ============================================

// Add visual feedback to form inputs
document.addEventListener('DOMContentLoaded', () => {
  const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
  
  formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement?.classList.remove('focused');
      }
    });
    
    // Add validation feedback
    input.addEventListener('invalid', (e) => {
      e.preventDefault();
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    });
  });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = this.querySelector('::before');
      // Ripple effect is handled by CSS ::before pseudo-element
    });
  });
});

// ===================================
// FLOATING IMAGE MODAL SYSTEM
// ===================================

// Inspiring messages in Yolanda's voice
const inspiringMessages = {
  strength: {
    title: "Strength Takes Time",
    message: "Your body is capable of more than you think. Every session is a step toward the strength you deserve—not the strength you think you should have. Be patient with yourself. I'm patient with you."
  },
  balance: {
    title: "Balance is a Practice",
    message: "Balance isn't about perfection—it's about awareness. It's okay to wobble. It's okay to fall. What matters is that you showed up and tried. That's where real growth happens."
  },
  flexibility: {
    title: "Flexibility is Freedom",
    message: "Movement should make you feel capable, not broken. Each stretch, each mindful breath, is teaching your body to trust itself again. You're not too stiff. You're not too old. You're exactly where you need to be."
  },
  mindful: {
    title: "Move with Intention",
    message: "Your body speaks to you in whispers. My job is to help you listen. Every movement is a conversation—not a punishment, not a test. Just presence. Just patience. Just you, becoming stronger."
  }
};

// Initialize modal system
document.addEventListener('DOMContentLoaded', function() {
  
  // Get modal elements
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalInspiration = document.getElementById('modalInspiration');
  const modalClose = document.querySelector('.modal-close');
  
  if (!modal) return; // Exit if modal doesn't exist
  
  // Add click handlers to all clickable images
  const clickableImages = document.querySelectorAll('.clickable-image');
  
  clickableImages.forEach(image => {
    image.addEventListener('click', function() {
      const imageSrc = this.querySelector('img').src;
      const messageKey = this.dataset.message;
      const message = inspiringMessages[messageKey];
      
      // Set modal content
      modalImage.src = imageSrc;
      modalImage.alt = message.title;
      modalTitle.textContent = message.title;
      modalInspiration.textContent = message.message;
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
  });
  
  // Close modal handlers
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close on overlay click (outside modal content)
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Scroll reveal observer for floating images
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        scrollRevealObserver.unobserve(entry.target); // Only reveal once
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all elements with scroll-reveal data attribute
  const scrollRevealElements = document.querySelectorAll('[data-scroll-reveal]');
  scrollRevealElements.forEach(el => scrollRevealObserver.observe(el));
});
