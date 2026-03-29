/* ===================================
   KimiClaw AI â€“ script.js
   Premium SaaS Interactions
   =================================== */

(function () {
  'use strict';

  const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isCompactMobile = window.innerWidth <= 768;

  /* â”€â”€ NAVBAR: Scroll + Mobile Toggle â”€â”€ */
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Open mobile overlay
  function openMobileNav() {
    mobileNavOverlay.classList.add('open');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Close mobile overlay
  function closeMobileNav() {
    mobileNavOverlay.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavOverlay.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
  }
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }
  if (mobileNavOverlay) {
    // Close on link click
    mobileNavOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
    // Close when clicking backdrop (outside inner panel - but inner covers full screen so use Escape only)
  }

  const handleViewportChange = () => {
    if (window.innerWidth > 1024 && mobileNavOverlay?.classList.contains('open')) {
      closeMobileNav();
    }
  };

  window.addEventListener('resize', handleViewportChange, { passive: true });
  window.addEventListener('orientationchange', handleViewportChange, { passive: true });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* â”€â”€ NAV INDICATOR: Sliding pill â”€â”€ */
  const navIndicator = document.getElementById('navIndicator');
  const navLinks = document.querySelectorAll('.nav-link');

  function moveIndicatorTo(link) {
    if (!navIndicator || !link) return;
    const navLinksContainer = document.getElementById('navLinks');
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    navIndicator.style.left = (linkRect.left - containerRect.left) + 'px';
    navIndicator.style.width = linkRect.width + 'px';
    navIndicator.classList.add('active');
  }

  function clearIndicator() {
    if (navIndicator) navIndicator.classList.remove('active');
  }

  // Hover: move indicator on mouseenter
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicatorTo(link));
  });
  document.getElementById('navLinks')?.addEventListener('mouseleave', () => {
    // Revert to active link, or hide
    const activeLink = document.querySelector('.nav-link.active-link');
    if (activeLink) {
      moveIndicatorTo(activeLink);
    } else {
      clearIndicator();
    }
  });
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger by position in parent
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const proofStats = document.querySelectorAll('[data-countup]');

  const animateCount = (el) => {
    const target = Number(el.getAttribute('data-countup') || '0');
    if (!Number.isFinite(target)) return;

    const original = el.textContent.trim();
    const prefix = original.startsWith('$') ? '$' : '';
    const suffix = original.endsWith('h') ? 'h' : '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  };

  if (proofStats.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCount(el);
        }
        statObserver.unobserve(el);
      });
    }, { threshold: 0.4 });

    proofStats.forEach((el) => statObserver.observe(el));
  } else {
    proofStats.forEach((el) => {
      if (!el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCount(el);
      }
    });
  }

  if (!reduceMotionMedia.matches && window.gsap && !isCompactMobile) {
    document.querySelectorAll('.proof-card').forEach((card, index) => {
      gsap.to(card, {
        y: index % 2 === 0 ? -8 : -12,
        duration: 3.8 + (index * 0.35),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  /* â”€â”€ FAQ ACCORDION â”€â”€ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        const t = fi.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* â”€â”€ FAQ CATEGORY TABS â”€â”€ */
  const faqTabs = document.querySelectorAll('.faq-tab');
  faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      faqTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      // Close any open accordion item first
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        const t = fi.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Show/hide items based on category
      faqItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('faq-hidden');
        } else {
          item.classList.add('faq-hidden');
        }
      });
    });
  });

  /* CONTACT FORM */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const contactFormFields = document.getElementById('contactFormFields');
  const contactFormActions = document.getElementById('contactFormActions');
  const contactSuccessPanel = document.getElementById('contactSuccessPanel');
  const contactResetBtn = document.getElementById('contactResetBtn');

  const getFieldErrorEl = (field) => document.getElementById(`${field.id}Error`);
  const getFieldLabel = (field) => {
    const label = contactForm?.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : 'This field';
  };

  const clearFieldState = (field) => {
    const errorEl = getFieldErrorEl(field);
    field.removeAttribute('aria-invalid');
    field.closest('.form-group')?.classList.remove('has-error');
    field.style.borderColor = '';
    if (errorEl) errorEl.textContent = '';
  };

  const setFieldError = (field, message) => {
    const errorEl = getFieldErrorEl(field);
    field.setAttribute('aria-invalid', 'true');
    field.closest('.form-group')?.classList.add('has-error');
    field.style.borderColor = '#EF4444';
    if (errorEl) errorEl.textContent = message;
  };

  const validateField = (field) => {
    const value = field.value.trim();
    const label = getFieldLabel(field);

    if (!value) {
      return `${label} is required.`;
    }

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Enter a valid email address.';
    }

    return '';
  };

  const resetContactFormUI = () => {
    if (contactFormFields) contactFormFields.hidden = false;
    if (contactFormActions) contactFormActions.hidden = false;
    if (contactSuccessPanel) contactSuccessPanel.hidden = true;
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    contactForm?.querySelectorAll('[required]').forEach((field) => {
      clearFieldState(field);
    });
  };

  const toggleSubmitState = (isSubmitting) => {
    if (!submitBtn) return;

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    submitBtn.disabled = isSubmitting;
    submitBtn.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
    contactForm?.classList.toggle('is-submitting', isSubmitting);
    if (btnText) btnText.style.display = isSubmitting ? 'none' : 'inline';
    if (btnLoading) btnLoading.style.display = isSubmitting ? 'inline' : 'none';
  };

  const setFormMessage = (type, message = '') => {
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    if (type === 'success' && formSuccess) {
      formSuccess.innerHTML = `<span>&#10003;</span> ${message}`;
      formSuccess.style.display = 'block';
    }

    if (type === 'error' && formError) {
      formError.textContent = message;
      formError.style.display = 'block';
    }
  };

  if (contactForm) {
    resetContactFormUI();

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setFormMessage();

      let valid = true;
      let firstInvalidField = null;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach((field) => {
        const errorMessage = validateField(field);

        if (errorMessage) {
          setFieldError(field, errorMessage);
          valid = false;
          if (!firstInvalidField) firstInvalidField = field;
        } else {
          clearFieldState(field);
        }
      });

      if (!valid) {
        contactForm.style.animation = 'shake 0.4s ease';
        setTimeout(() => { contactForm.style.animation = ''; }, 400);
        setFormMessage('error', 'Please complete all required fields before sending your inquiry.');
        firstInvalidField?.focus();
        return;
      }

      toggleSubmitState(true);

      try {
        const formData = new FormData(contactForm);
        formData.set('sourcePage', window.location.pathname || '/');

        // If custom budget is selected, use the custom input value
        if (formData.get('budget') === 'custom') {
          const customVal = document.getElementById('customBudget')?.value.trim();
          if (customVal) {
            formData.set('budget', 'Custom: ' + customVal);
          }
        }

        const response = await fetch(contactForm.action || '/api/contact', {
          method: contactForm.method || 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: new URLSearchParams(formData)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || 'Something went wrong while sending your inquiry.');
        }

        contactForm.reset();
        requiredFields.forEach((field) => clearFieldState(field));

        if (contactFormFields) contactFormFields.hidden = true;
        if (contactFormActions) contactFormActions.hidden = true;

        if (contactSuccessPanel) {
          const successCopy = contactSuccessPanel.querySelector('p');
          if (successCopy) {
            successCopy.textContent = result.message || "Thank you! We've received your inquiry and will get back to you within 24 hours.";
          }
          contactSuccessPanel.hidden = false;
        } else {
          setFormMessage('success', result.message || "Thank you! We've received your inquiry and will get back to you within 24 hours.");
        }
      } catch (error) {
        setFormMessage('error', error.message || 'We could not send your inquiry right now. Please try again in a moment.');
      } finally {
        toggleSubmitState(false);
      }
    });

    contactForm.querySelectorAll('[required]').forEach((field) => {
      const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        if (!field.value.trim()) {
          clearFieldState(field);
        } else {
          const errorMessage = validateField(field);
          if (errorMessage) {
            setFieldError(field, errorMessage);
          } else {
            clearFieldState(field);
          }
        }

        if (formError) formError.style.display = 'none';
      });
    });

    if (contactResetBtn) {
      contactResetBtn.addEventListener('click', () => {
        contactForm.reset();
        resetContactFormUI();
        document.getElementById('name')?.focus();
      });
    }

    // Custom Budget Toggle Logic
    const budgetSelect = document.getElementById('budget');
    const customBudgetContainer = document.getElementById('customBudgetContainer');
    const customBudgetInput = document.getElementById('customBudget');

    if (budgetSelect && customBudgetContainer && customBudgetInput) {
      budgetSelect.addEventListener('change', () => {
        if (budgetSelect.value === 'custom') {
          customBudgetContainer.style.display = 'block';
          customBudgetInput.setAttribute('required', '');
          customBudgetInput.focus();
        } else {
          customBudgetContainer.style.display = 'none';
          customBudgetInput.removeAttribute('required');
          customBudgetInput.value = '';
          clearFieldState(customBudgetInput);
        }
      });

      // Add real-time validation to custom budget input
      customBudgetInput.addEventListener('input', () => {
        if (!customBudgetInput.value.trim()) {
          clearFieldState(customBudgetInput);
        } else {
          const errorMessage = validateField(customBudgetInput);
          if (errorMessage) {
            setFieldError(customBudgetInput, errorMessage);
          } else {
            clearFieldState(customBudgetInput);
          }
        }
      });
    }
  }

  const currencyRates = {
    USD: { symbol: '$', rate: 1, locale: 'en-US' },
    EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
    GBP: { symbol: '£', rate: 0.83, locale: 'en-GB' },
    AUD: { symbol: 'A$', rate: 1.47, locale: 'en-AU' }
  };

  const pricingTabButtons = document.querySelectorAll('.currency-tab');
  const pricingPriceEls = document.querySelectorAll('.pricing-price[data-base-amount]');

  const formatAmount = (value, options) => {
    try {
      return new Intl.NumberFormat(options.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } catch {
      return Math.round(value).toString();
    }
  };

  const updatePricingCurrency = (code) => {
    const currency = currencyRates[code] || currencyRates.USD;
    pricingPriceEls.forEach((priceEl) => {
      const base = Number(priceEl.dataset.baseAmount);
      if (!Number.isFinite(base)) return;
      const converted = base * currency.rate;
      const amountEl = priceEl.querySelector('.amount');
      const currencyEl = priceEl.querySelector('.currency');

      if (amountEl) amountEl.textContent = formatAmount(converted, currency);
      if (currencyEl) currencyEl.textContent = currency.symbol;
    });
  };

  const setActiveTab = (code) => {
    pricingTabButtons.forEach((btn) => {
      const matches = btn.dataset.currency === code;
      btn.classList.toggle('is-active', matches);
      btn.setAttribute('aria-selected', matches ? 'true' : 'false');
    });
  };

  if (pricingTabButtons.length && pricingPriceEls.length) {
    const savedCurrency = (() => {
      try {
        return localStorage.getItem('preferredCurrency');
      } catch {
        return null;
      }
    })();

    const detectDefaultCurrency = () => {
      const locale = navigator.language || '';
      if (locale.startsWith('en-GB')) return 'GBP';
      if (locale.startsWith('en-AU')) return 'AUD';
      if (locale.startsWith('fr') || locale.startsWith('de') || locale.startsWith('es')) return 'EUR';
      return 'USD';
    };

    const initialCurrency = savedCurrency && currencyRates[savedCurrency] ? savedCurrency : detectDefaultCurrency();

    setActiveTab(initialCurrency);
    updatePricingCurrency(initialCurrency);

    pricingTabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.currency;
        if (!next) return;
        updatePricingCurrency(next);
        setActiveTab(next);
        try {
          localStorage.setItem('preferredCurrency', next);
        } catch (error) {
          console.warn('Unable to persist currency preference', error);
        }
      });
    });
  }

  /* SMOOTH ANCHOR SCROLL (offset for fixed navbar) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: reduceMotionMedia.matches ? 'auto' : 'smooth' });
    });
  });
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');
  const navH = 80;

  if (navAnchors.length && sections.length && 'IntersectionObserver' in window) {
    const activeSpy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active-link', isActive);
            if (isActive) moveIndicatorTo(link);
          });
        }
      });
    }, { rootMargin: `-${navH}px 0px -55% 0px` });

    sections.forEach(sec => activeSpy.observe(sec));
  }

  /* â”€â”€ SHAKE ANIMATION (for form errors) â”€â”€ */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* â”€â”€ LOGO TRACK: pause on hover â”€â”€ */
  const logoTrack = document.querySelector('.logo-track');
  if (logoTrack) {
    logoTrack.addEventListener('mouseenter', () => {
      logoTrack.style.animationPlayState = 'paused';
    });
    logoTrack.addEventListener('mouseleave', () => {
      logoTrack.style.animationPlayState = 'running';
    });
  }

  /* â”€â”€ SERVICE CARD MOUSE GLOW + 3D TILT â”€â”€ */
  if (!isCoarsePointer && !isCompactMobile) {
    document.querySelectorAll('.service-card, .pricing-card, .testimonial-card').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.25s, background 0.25s';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        card.style.setProperty('--mouse-x', `${x * 100}%`);
        card.style.setProperty('--mouse-y', `${y * 100}%`);

        const tiltX = (y - 0.5) * -6;
        const tiltY = (x - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }


  /* ── REDUNDANT HERO/WORKFLOW LOGIC REMOVED ── 
     Logic moved to hero-workflow-animation.js for modularity.
  */
/* â”€â”€ PRICING LOCALIZATION â”€â”€ */
  const localizePricing = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      
      let currency = { sym: '$', code: 'USD', rate: 1.0, format: 'en-US' };
      
      if (tz.includes('Europe/London')) {
        currency = { sym: 'Â£', code: 'GBP', rate: 0.78, format: 'en-GB' };
      } else if (tz.includes('Europe/')) {
        currency = { sym: 'â‚¬', code: 'EUR', rate: 0.92, format: 'de-DE' };
      } else if (tz.includes('Australia/')) {
        currency = { sym: '$', code: 'AUD', rate: 1.5, format: 'en-AU' };
      } else if (tz.includes('America/Toronto') || tz.includes('America/Vancouver') || tz.includes('America/Montreal') || tz.includes('America/Edmonton') || tz.includes('America/Winnipeg')) {
        currency = { sym: '$', code: 'CAD', rate: 1.35, format: 'en-CA' };
      }
      
      if (currency.code === 'USD') return;

      const formatPrice = (price) => {
        return Math.round(price * currency.rate).toLocaleString(currency.format);
      };

      const startPriceEl = document.querySelector('.pricing-grid-v2 .pricing-card:nth-child(1) .amount');
      const startCurrEl = document.querySelector('.pricing-grid-v2 .pricing-card:nth-child(1) .currency');
      const bizPriceEl = document.querySelector('.pricing-grid-v2 .pricing-card:nth-child(2) .amount');
      const bizCurrEl = document.querySelector('.pricing-grid-v2 .pricing-card:nth-child(2) .currency');

      if (startPriceEl && startCurrEl) {
        startCurrEl.textContent = currency.sym;
        startPriceEl.textContent = formatPrice(399);
      }
      if (bizPriceEl && bizCurrEl) {
        bizCurrEl.textContent = currency.sym;
        bizPriceEl.textContent = formatPrice(899);
      }
      
      const noteEl = document.querySelector('.pricing-footer-note p');
      if (noteEl) {
        noteEl.innerHTML = `Pay only when your website is ready. <br><small style="opacity:0.75; font-size:13px;">Pricing is natively localized to ${currency.code}.</small>`;
      }

    } catch(e) { console.warn("Currency localization failed", e); }
  };
  
  // Run on load
  // Currency switching is handled by the tabbed pricing logic above.

})();
