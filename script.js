/**
 * ==========================================================================
 * TASTORA – THE ART OF FINE DINING
 * Main JavaScript Application (script.js)
 * Clean, Modular, and Well-Commented Vanilla JavaScript
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ========================================================================
     1. GLOBAL SELECTORS & STATE
     ======================================================================== */
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // Menu filtering elements
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');

  // Gallery & Lightbox elements
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  // Table reservation form & modal elements
  const reservationForm = document.getElementById('reservationForm');
  const bookNameInput = document.getElementById('bookName');
  const bookPhoneInput = document.getElementById('bookPhone');
  const bookEmailInput = document.getElementById('bookEmail');
  const bookDateInput = document.getElementById('bookDate');
  const bookTimeInput = document.getElementById('bookTime');
  const bookGuestsInput = document.getElementById('bookGuests');
  const bookRequestsInput = document.getElementById('bookRequests');

  // Reservation confirmation modal elements
  const bookingModal = document.getElementById('bookingModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const confirmRef = document.getElementById('confirmRef');
  const confirmName = document.getElementById('confirmName');
  const confirmDateTime = document.getElementById('confirmDateTime');
  const confirmGuests = document.getElementById('confirmGuests');
  const confirmRequests = document.getElementById('confirmRequests');
  const confirmRequestsRow = document.getElementById('confirmRequestsRow');

  // Contact & Newsletter forms
  const contactForm = document.getElementById('contactForm');
  const contactFeedbackMsg = document.getElementById('contactFeedbackMsg');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');


  /* ========================================================================
     2. MOBILE NAVIGATION HAMBURGER MENU
     ======================================================================== */
  /**
   * Toggles the mobile navigation drawer and backdrop.
   */
  const toggleMobileNav = (forceState = null) => {
    const isCurrentlyOpen = navMenu.classList.contains('open');
    const shouldOpen = forceState !== null ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      navMenu.classList.add('open');
      hamburgerBtn.classList.add('open');
      navBackdrop.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      navBackdrop.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore background scrolling
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileNav());
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => toggleMobileNav(false));
  }

  // Auto-close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        toggleMobileNav(false);
      }
    });
  });

  // Close mobile navigation on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMobileNav(false);
    }
  });


  /* ========================================================================
     3. STICKY HEADER & SCROLLSPY ACTIVE NAV LINK
     ======================================================================== */
  const sections = document.querySelectorAll('section[id]');

  const handleHeaderOnScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Add glassmorphic background & border on scroll
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy: Highlight the current active section in nav
    const headerHeight = header.offsetHeight + 40;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });

    // Toggle Back-to-Top Button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleHeaderOnScroll, { passive: true });
  // Call once on init to handle pages refreshed while scrolled
  handleHeaderOnScroll();

  // Back to top click event
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ========================================================================
     4. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ========================================================================
     5. MENU CATEGORY FILTERING & "RESERVE DISH" INTEGRATION
     ======================================================================== */
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active class on clicked button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.getAttribute('data-category');

      // Filter cards with smooth opacity / display transition
      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          item.classList.remove('hide');
          item.style.animation = 'modalPop 0.4s ease forwards';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // "Reserve Dish" button click handler: pre-fills special requests in table booking!
  const reserveDishButtons = document.querySelectorAll('.btn-item-order');
  reserveDishButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const foodName = btn.getAttribute('data-food-name');
      
      if (bookRequestsInput) {
        const currentRequests = bookRequestsInput.value.trim();
        const dishNote = `Requested Dish: ${foodName}`;
        
        if (!currentRequests.includes(dishNote)) {
          bookRequestsInput.value = currentRequests 
            ? `${currentRequests} | ${dishNote}` 
            : dishNote;
        }
      }

      // Smooth scroll to booking section
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        const headerOffset = header.offsetHeight;
        const targetPos = bookingSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Highlight input field briefly
        if (bookRequestsInput) {
          bookRequestsInput.focus();
        }
      }
    });
  });


  /* ========================================================================
     6. INTERACTIVE GALLERY & LIGHTBOX MODAL
     ======================================================================== */
  let currentImageIndex = 0;
  const galleryData = [];

  // Populate gallery data array from DOM elements
  galleryItems.forEach((item, index) => {
    const src = item.getAttribute('data-image-src') || item.querySelector('img').src;
    const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-title')?.textContent || 'TASTORA Gallery';
    galleryData.push({ src, caption });

    // Open lightbox when gallery item is clicked
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  const openLightbox = (index) => {
    currentImageIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const updateLightboxContent = () => {
    if (galleryData.length === 0) return;
    const item = galleryData[currentImageIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.caption;
    lightboxCaption.textContent = `${item.caption} (${currentImageIndex + 1} / ${galleryData.length})`;
  };

  const nextLightboxImage = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    updateLightboxContent();
  };

  const prevLightboxImage = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxImage);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxImage);

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
  });


  /* ========================================================================
     7. TABLE RESERVATION FORM VALIDATION & PREVENTING PAST DATES
     ======================================================================== */
  /**
   * Dynamically sets the minimum date for the reservation calendar
   * so users cannot select past dates.
   */
  const setupDateInputConstraints = () => {
    if (!bookDateInput) return;

    const today = new Date();
    // Format YYYY-MM-DD in local time
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDateString = `${year}-${month}-${day}`;

    // Set the HTML5 min attribute
    bookDateInput.setAttribute('min', minDateString);

    // Default value set to tomorrow for convenience
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tmrwYear = tomorrow.getFullYear();
    const tmrwMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tmrwDay = String(tomorrow.getDate()).padStart(2, '0');
    bookDateInput.value = `${tmrwYear}-${tmrwMonth}-${tmrwDay}`;
  };

  setupDateInputConstraints();

  // Helper validation functions
  const showError = (inputElement, errorElementId, message) => {
    inputElement.classList.add('input-error');
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  const clearError = (inputElement, errorElementId) => {
    inputElement.classList.remove('input-error');
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = '';
    }
  };

  // Real-time input clearing on user input
  const registerInputListeners = () => {
    if (bookNameInput) {
      bookNameInput.addEventListener('input', () => clearError(bookNameInput, 'bookNameError'));
    }
    if (bookPhoneInput) {
      bookPhoneInput.addEventListener('input', () => clearError(bookPhoneInput, 'bookPhoneError'));
    }
    if (bookEmailInput) {
      bookEmailInput.addEventListener('input', () => clearError(bookEmailInput, 'bookEmailError'));
    }
    if (bookGuestsInput) {
      bookGuestsInput.addEventListener('change', () => clearError(bookGuestsInput, 'bookGuestsError'));
    }
    if (bookDateInput) {
      bookDateInput.addEventListener('change', () => clearError(bookDateInput, 'bookDateError'));
    }
    if (bookTimeInput) {
      bookTimeInput.addEventListener('change', () => clearError(bookTimeInput, 'bookTimeError'));
    }
  };

  registerInputListeners();

  /**
   * Validates table reservation form fields with strict constraints.
   */
  const validateReservationForm = () => {
    let isValid = true;

    // 1. Full Name: at least 2 characters, letters & spaces
    const nameVal = bookNameInput.value.trim();
    if (!nameVal) {
      showError(bookNameInput, 'bookNameError', 'Please enter your full name.');
      isValid = false;
    } else if (nameVal.length < 2) {
      showError(bookNameInput, 'bookNameError', 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(bookNameInput, 'bookNameError');
    }

    // 2. Phone Number: valid length and phone format
    const phoneVal = bookPhoneInput.value.trim();
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!phoneVal) {
      showError(bookPhoneInput, 'bookPhoneError', 'Please provide a valid contact phone number.');
      isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
      showError(bookPhoneInput, 'bookPhoneError', 'Please enter a valid phone number (min 7 digits).');
      isValid = false;
    } else {
      clearError(bookPhoneInput, 'bookPhoneError');
    }

    // 3. Email Address
    const emailVal = bookEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      showError(bookEmailInput, 'bookEmailError', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(bookEmailInput, 'bookEmailError', 'Please provide a valid email format.');
      isValid = false;
    } else {
      clearError(bookEmailInput, 'bookEmailError');
    }

    // 4. Number of Guests
    const guestsVal = bookGuestsInput.value;
    if (!guestsVal) {
      showError(bookGuestsInput, 'bookGuestsError', 'Please select number of guests.');
      isValid = false;
    } else {
      clearError(bookGuestsInput, 'bookGuestsError');
    }

    // 5. Reservation Date: must be non-empty and NOT in the past
    const dateVal = bookDateInput.value;
    if (!dateVal) {
      showError(bookDateInput, 'bookDateError', 'Please select a reservation date.');
      isValid = false;
    } else {
      const selectedDate = new Date(dateVal + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        showError(bookDateInput, 'bookDateError', 'Reservations cannot be made for past dates.');
        isValid = false;
      } else {
        clearError(bookDateInput, 'bookDateError');
      }
    }

    // 6. Reservation Time
    const timeVal = bookTimeInput.value;
    if (!timeVal) {
      showError(bookTimeInput, 'bookTimeError', 'Please select a dining time slot.');
      isValid = false;
    } else {
      clearError(bookTimeInput, 'bookTimeError');
    }

    return isValid;
  };

  /**
   * Reservation form submit handler
   */
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isFormValid = validateReservationForm();

      if (isFormValid) {
        // Collect form data for presentation
        const fullName = bookNameInput.value.trim();
        const guests = bookGuestsInput.value;
        const resDate = bookDateInput.value;
        const resTime = bookTimeInput.value;
        const requests = bookRequestsInput.value.trim();

        // Format date nicely (e.g. Nov 28, 2026)
        const dateObj = new Date(resDate + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        // Generate realistic booking reference code
        const randomRef = 'TST-' + Math.floor(1000 + Math.random() * 9000);

        // Populate confirmation modal fields
        confirmRef.textContent = `#${randomRef}`;
        confirmName.textContent = fullName;
        confirmDateTime.textContent = `${formattedDate} at ${resTime}`;
        confirmGuests.textContent = guests;

        if (requests) {
          confirmRequests.textContent = requests;
          confirmRequestsRow.style.display = 'flex';
        } else {
          confirmRequestsRow.style.display = 'none';
        }

        // Display confirmation modal
        bookingModal.classList.add('active');
        bookingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Reset reservation form cleanly
        reservationForm.reset();
        setupDateInputConstraints(); // Reset to tomorrow
      } else {
        // Scroll to first error field smoothly
        const firstErrorInput = reservationForm.querySelector('.input-error');
        if (firstErrorInput) {
          firstErrorInput.focus();
        }
      }
    });
  }

  // Close reservation modal
  const closeBookingModal = () => {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeBookingModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
      closeBookingModal();
    }
  });


  /* ========================================================================
     8. CONTACT FORM CLIENT-SIDE HANDLING
     ======================================================================== */
  if (contactForm) {
    const contactNameInput = document.getElementById('contactName');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactMessageInput = document.getElementById('contactMessage');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isContactValid = true;

      if (!contactNameInput.value.trim()) {
        showError(contactNameInput, 'contactNameError', 'Please enter your name.');
        isContactValid = false;
      } else {
        clearError(contactNameInput, 'contactNameError');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contactEmailInput.value.trim() || !emailRegex.test(contactEmailInput.value.trim())) {
        showError(contactEmailInput, 'contactEmailError', 'Please provide a valid email.');
        isContactValid = false;
      } else {
        clearError(contactEmailInput, 'contactEmailError');
      }

      if (!contactMessageInput.value.trim()) {
        showError(contactMessageInput, 'contactMessageError', 'Please provide your message.');
        isContactValid = false;
      } else {
        clearError(contactMessageInput, 'contactMessageError');
      }

      if (isContactValid) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<span>Transmitting...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

        setTimeout(() => {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.innerHTML = '<span>Message Sent</span> <i class="fa-solid fa-check"></i>';
          
          contactFeedbackMsg.className = 'contact-feedback-msg success';
          contactFeedbackMsg.textContent = 'Thank you! Your message has been received by our concierge team.';

          contactForm.reset();

          setTimeout(() => {
            contactSubmitBtn.innerHTML = '<span>Send Message</span> <i class="fa-regular fa-paper-plane"></i>';
            contactFeedbackMsg.textContent = '';
          }, 5000);
        }, 800);
      }
    });

    // Clear errors on input
    [contactNameInput, contactEmailInput, contactMessageInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => {
          inp.classList.remove('input-error');
          const errEl = document.getElementById(inp.id + 'Error');
          if (errEl) errEl.textContent = '';
        });
      }
    });
  }


  /* ========================================================================
     9. FOOTER NEWSLETTER SUBSCRIPTION
     ======================================================================== */
  if (newsletterForm) {
    const newsletterEmail = document.getElementById('newsletterEmail');
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email && emailRegex.test(email)) {
        newsletterFeedback.style.color = 'var(--gold-primary)';
        newsletterFeedback.textContent = 'Welcome to The Connoisseur Club. Invitation confirmed.';
        newsletterEmail.value = '';

        setTimeout(() => {
          newsletterFeedback.textContent = '';
        }, 4000);
      } else {
        newsletterFeedback.style.color = 'var(--color-error)';
        newsletterFeedback.textContent = 'Please enter a valid email address.';
      }
    });
  }


  /* ========================================================================
     10. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ======================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once for performance
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser does not support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  /* ========================================================================
     11. DYNAMIC COPYRIGHT YEAR
     ======================================================================== */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
