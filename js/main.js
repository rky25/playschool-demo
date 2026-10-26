/* ═══════════════════════════════════════════════════════════
   LITTLE SPROUTS — Play School Demo Website
   Interactive JavaScript
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initTimelineReveal();
  initTestimonialSlider();
  initGalleryFilters();
  initSmoothScroll();
  initActiveNavHighlight();
});

/* ══════════════════════════════════════
   NAVBAR — Scroll shrink & background
   ══════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ══════════════════════════════════════
   HAMBURGER MENU (Mobile)
   ══════════════════════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
   ══════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on sibling index
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        let delay = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) delay = i * 100;
        });
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   TIMELINE REVEAL (Daily Routine)
   ══════════════════════════════════════ */
function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  if (items.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger based on index
        const allItems = Array.from(document.querySelectorAll('.timeline-item'));
        const index = allItems.indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });

  items.forEach(item => observer.observe(item));
}

/* ══════════════════════════════════════
   TESTIMONIAL SLIDER
   ══════════════════════════════════════ */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!track || !dotsContainer) return;

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');
  let currentIndex = 0;
  let autoSlideInterval;

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Click on dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      goToSlide(index);
      resetAutoSlide();
    });
  });

  // Auto-slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % dots.length;
      goToSlide(nextIndex);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < dots.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
      resetAutoSlide();
    }
  }, { passive: true });
}

/* ══════════════════════════════════════
   GALLERY FILTER TABS
   ══════════════════════════════════════ */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items with animation
      galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            item.style.display = 'block';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }, index * 60);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ══════════════════════════════════════
   SMOOTH SCROLL (Nav links)
   ══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ══════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT
   ══════════════════════════════════════ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ══════════════════════════════════════
   MODAL FUNCTIONS
   ══════════════════════════════════════ */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form state after closing
    setTimeout(() => {
      const form = modal.querySelector('form');
      const formContainer = document.getElementById(modalId + 'Form');
      const successContainer = document.getElementById(modalId + 'Success');
      
      if (form) form.reset();
      if (formContainer) formContainer.style.display = 'block';
      if (successContainer) {
        successContainer.classList.remove('show');
        successContainer.style.display = 'none';
      }
    }, 300);
  }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

/* ══════════════════════════════════════
   FORM SUBMISSION HANDLERS
   ══════════════════════════════════════ */
function handleModalSubmit(e, modalId) {
  e.preventDefault();

  const formContainer = document.getElementById(modalId + 'Form');
  const successContainer = document.getElementById(modalId + 'Success');

  if (formContainer && successContainer) {
    formContainer.style.display = 'none';
    successContainer.style.display = 'block';
    successContainer.classList.add('show');
  }

  // Auto close after 3 seconds
  setTimeout(() => {
    closeModal(modalId);
  }, 3500);
}

function submitQuickEnquiry() {
  const program = document.getElementById('admissionProgram');
  const phone = document.getElementById('admissionPhone');

  if (!program.value) {
    program.focus();
    program.style.borderColor = '#EF4444';
    setTimeout(() => { program.style.borderColor = ''; }, 2000);
    return;
  }

  if (!phone.value || phone.value.length < 10) {
    phone.focus();
    phone.style.borderColor = '#EF4444';
    setTimeout(() => { phone.style.borderColor = ''; }, 2000);
    return;
  }

  // Simulate success
  const btn = document.querySelector('.admission-bar .btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✅ Request Sent!';
  btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    program.value = '';
    phone.value = '';
  }, 3000);
}

function submitTourForm(e) {
  e.preventDefault();
  
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '✅ Tour Booked! We\'ll confirm on WhatsApp';
  btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    form.reset();
  }, 3500);
}

/* ══════════════════════════════════════
   COUNTER ANIMATION (for stats)
   ══════════════════════════════════════ */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    element.textContent = current.toLocaleString() + '+';
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
