// ============================================
// YOLANDA R. MOVEMENT STUDIO
// Premium Interactive Behaviors (Refactored)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobile Menu (New Drawer Logic)
  initMobileMenu();

  // 3. Smooth Scroll
  initSmoothScroll();

  // 4. Scroll Animations (Reveal on Scroll)
  initScrollAnimations();

  // 5. Header Visuals
  initHeaderScroll();
});

// ============================================
// MOBILE MENU DRAWER
// ============================================
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  
  if (!toggle || !drawer || !overlay) return;

  function openMenu() {
    overlay.classList.remove('hidden');
    // Force reflow
    void overlay.offsetWidth; 
    overlay.classList.remove('opacity-0');
    
    document.body.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.add('opacity-0');
    document.body.classList.remove('drawer-open');
    document.body.style.overflow = '';
    
    // Wait for transition
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  }

  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  
  // Close on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ============================================
// SCROLL ANIMATIONS (Reveal)
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// HEADER EFFECT
// ============================================
function initHeaderScroll() {
  const header = document.querySelector('header');
  
  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('bg-slate-950/90', 'backdrop-blur-md', 'shadow-lg');
    } else {
      header.classList.remove('bg-slate-950/90', 'backdrop-blur-md', 'shadow-lg');
    }
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader(); // Init check
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 90; 
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
