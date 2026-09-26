/**
 * Vintage Motorworks - Pure Vanilla JavaScript
 * Production-Ready, Zero Libraries
 * 
 * Includes:
 * 1. Automatic Footer Year Update
 * 2. Header Scroll Shadow Effect
 * 3. Mobile Navigation Drawer & Accessibility
 * 4. Client-side Contact Form Validation & Live Status Messages
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. FOOTER YEAR UPDATE
     ========================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. HEADER SCROLL SHADOW EFFECT
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    let ticking = false;

    const onScroll = () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      if (scrollPosition > 20) {
        siteHeader.classList.add('header-scrolled');
      } else {
        siteHeader.classList.remove('header-scrolled');
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on page load
    onScroll();
  }

  /* ==========================================================================
     3. ACCESSIBLE MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    const toggleNav = (open) => {
      const isExpanded = open !== undefined ? open : navToggle.getAttribute('aria-expanded') === 'true';
      const targetState = !isExpanded;

      navToggle.setAttribute('aria-expanded', String(targetState));
      if (targetState) {
        primaryNav.classList.add('nav-open');
        navToggle.setAttribute('aria-label', 'მენიუს დახურვა');
      } else {
        primaryNav.classList.remove('nav-open');
        navToggle.setAttribute('aria-label', 'მენიუს გახსნა');
      }
    };

    navToggle.addEventListener('click', () => {
      toggleNav();
    });

    // Close mobile nav when clicking on any navigation link
    const navLinks = primaryNav.querySelectorAll('.nav-link, .btn');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          toggleNav(true); // force close
        }
      });
    });

    // Close mobile nav when pressing the Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        toggleNav(true); // force close
        navToggle.focus();
      }
    });

    // Close when clicking outside of nav on mobile
    document.addEventListener('click', (event) => {
      if (
        window.innerWidth <= 900 &&
        navToggle.getAttribute('aria-expanded') === 'true' &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        toggleNav(true); // force close
      }
    });
  }

  /* ==========================================================================
     4. CLIENT-SIDE CONTACT FORM VALIDATION & FEEDBACK
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('client-name');
  const emailInput = document.getElementById('client-email');
  const messageInput = document.getElementById('client-message');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // Simple and robust email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /**
   * Set field error state
   */
  const setFieldError = (inputElement, errorElement, message) => {
    inputElement.classList.add('has-error');
    inputElement.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
  };

  /**
   * Clear field error state
   */
  const clearFieldError = (inputElement, errorElement) => {
    inputElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');
    errorElement.textContent = '';
  };

  /**
   * Validate a single input field
   */
  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) {
      setFieldError(nameInput, nameError, 'გთხოვთ მიუთითოთ თქვენი სახელი და გვარი');
      return false;
    }
    if (val.length < 2) {
      setFieldError(nameInput, nameError, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს');
      return false;
    }
    clearFieldError(nameInput, nameError);
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!val) {
      setFieldError(emailInput, emailError, 'გთხოვთ მიუთითოთ ელექტრონული ფოსტის მისამართი');
      return false;
    }
    if (!emailRegex.test(val)) {
      setFieldError(emailInput, emailError, 'გთხოვთ მიუთითოთ სწორი ელფოსტა (მაგ. name@example.com)');
      return false;
    }
    clearFieldError(emailInput, emailError);
    return true;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    if (!val) {
      setFieldError(messageInput, messageError, 'გთხოვთ შეავსოთ პროექტის აღწერა');
      return false;
    }
    if (val.length < 10) {
      setFieldError(messageInput, messageError, 'აღწერა უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს');
      return false;
    }
    clearFieldError(messageInput, messageError);
    return true;
  };

  // Live input validation on blur and input after first error
  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('has-error')) validateName();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('has-error')) validateEmail();
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('has-error')) validateMessage();
    });
  }

  /**
   * Handle Form Submission
   */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset previous status messages
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      // Run full validation
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        // Focus on first invalid input
        if (!isNameValid) {
          nameInput.focus();
        } else if (!isEmailValid) {
          emailInput.focus();
        } else if (!isMessageValid) {
          messageInput.focus();
        }

        formStatus.className = 'form-status status-error';
        formStatus.textContent = 'გთხოვთ შეასწოროთ ფორმაში მონიშნული შეცდომები.';
        return;
      }

      // Valid: Simulate transmission
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>მუშავდება...</span>';

      setTimeout(() => {
        // Successful submission simulation
        formStatus.className = 'form-status status-success';
        formStatus.innerHTML = '<strong>გმადლობთ!</strong> თქვენი მოთხოვნა მიღებულია. ჩვენი მთავარი რესტავრატორი უახლოეს 24 საათში დაგიკავშირდებათ დეტალების დასაზუსტებლად.';

        // Clear input values
        contactForm.reset();
        clearFieldError(nameInput, nameError);
        clearFieldError(emailInput, emailError);
        clearFieldError(messageInput, messageError);

        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Auto clear success notice after 8 seconds (optional)
        setTimeout(() => {
          if (formStatus.classList.contains('status-success')) {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
          }
        }, 8000);
      }, 700);
    });
  }
});
