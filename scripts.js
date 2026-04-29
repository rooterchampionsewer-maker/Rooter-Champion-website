    // Force scroll to top on page load
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Scroll-triggered reveal animation
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 100px 0px' });
    document.querySelectorAll('.scroll-reveal, .scroll-fade').forEach(function(el) {
      revealObserver.observe(el);
    });

    // Immediately reveal elements already in viewport on load
    setTimeout(function() {
      document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-fade:not(.revealed)').forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
    }, 100);

    // Safety net: reveal anything stuck in hidden state on scroll past it
    var revealOnScroll = function() {
      document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-fade:not(.revealed)').forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    // Final safety net: after 2.5s, force-reveal anything still hidden
    setTimeout(function() {
      document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-fade:not(.revealed)').forEach(function(el) {
        el.classList.add('revealed');
      });
      window.removeEventListener('scroll', revealOnScroll);
    }, 2500);

    // Nav: floating glass card — hide on scroll down, show on scroll up
    const nav = document.getElementById('main-nav');
    var lastScrollY = 0;
    var navHidden = false;
    function updateNav() {
      var currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        nav.style.background = 'rgba(39,74,106,0.75)';
        nav.style.borderColor = 'rgba(83,166,220,0.3)';
        nav.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
      } else {
        nav.style.background = 'rgba(39,74,106,0.55)';
        nav.style.borderColor = 'rgba(83,166,220,0.2)';
        nav.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      }

      // Hide/show based on scroll direction (with threshold)
      var scrollDiff = currentScrollY - lastScrollY;
      if (scrollDiff > 5 && currentScrollY > 100) {
        nav.style.transform = 'translateY(calc(-100% - 2rem))';
        navHidden = true;
      } else if (scrollDiff < -5) {
        nav.style.transform = 'translateY(0)';
        navHidden = false;
      }

      lastScrollY = currentScrollY;
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // Quick Quote side tab
    const quotePanel = document.getElementById('quote-panel');
    const quoteBtn   = document.getElementById('quote-tab-btn');
    let quoteManual  = false; // true once the user has manually toggled

    function openQuote() {
      quotePanel.style.maxWidth = '272px';
      quotePanel.dataset.open   = 'true';
      quoteBtn.style.background = '#53A6DC';
    }
    function closeQuote() {
      quotePanel.style.maxWidth = '0';
      quotePanel.dataset.open   = 'false';
      quoteBtn.style.background = '#53A6DC';
    }
    function toggleQuote() {
      quoteManual = true;
      quotePanel.dataset.open === 'true' ? closeQuote() : openQuote();
    }
    function submitQuote() {
      quoteManual = true;
      closeQuote();
    }

    // Auto-open after 1s, auto-close when user scrolls
    setTimeout(openQuote, 1000);
    let autoRetracted = false;
    window.addEventListener('scroll', function() {
      if (!autoRetracted && !quoteManual && quotePanel.dataset.open === 'true' && window.scrollY > 80) {
        closeQuote();
        autoRetracted = true;
      }
    }, { passive: true });

    const dz = document.getElementById('drop-zone');
    if (dz) {
      dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = '#53A6DC'; });
      dz.addEventListener('dragleave', () => dz.style.borderColor = 'rgba(83,166,220,0.25)');
      dz.addEventListener('drop', e => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) document.getElementById('file-name').textContent = f.name;
        dz.style.borderColor = 'rgba(83,166,220,0.25)';
      });
    }

    // ── Our Process interactive steps ──
    var processStepData = [
      { label: 'Step 01', title: 'Inspect', desc: "Our high-definition cameras provide a complete view of your sewer line's condition, pinpointing exact locations of damage, blockages, and deterioration.", color: '#53A6DC', borderActive: 'rgba(83,166,220,0.3)', bgActive: 'rgba(83,166,220,0.08)', glowActive: '0 0 15px rgba(83,166,220,0.3)' },
      { label: 'Step 02', title: 'Clean', desc: 'Hydro jetting at up to 4,000 PSI blasts away years of grease, scale, and root intrusion — leaving your pipes completely clean and flowing like new.', color: '#81B752', borderActive: 'rgba(129,183,82,0.3)', bgActive: 'rgba(129,183,82,0.08)', glowActive: '0 0 15px rgba(129,183,82,0.3)' },
      { label: 'Step 03', title: 'Repair', desc: "We apply the best solution — trenchless lining, pipe bursting, or descaling — based on your pipe's specific condition. No unnecessary work.", color: '#53A6DC', borderActive: 'rgba(83,166,220,0.3)', bgActive: 'rgba(83,166,220,0.08)', glowActive: '0 0 15px rgba(83,166,220,0.3)' },
      { label: 'Step 04', title: 'Verify', desc: 'Final camera inspection confirms the repair is perfect. We show you the before and after footage before we leave — complete transparency.', color: '#81B752', borderActive: 'rgba(129,183,82,0.3)', bgActive: 'rgba(129,183,82,0.08)', glowActive: '0 0 15px rgba(129,183,82,0.3)' }
    ];

    window.activateStep = function(index) {
      var steps = document.querySelectorAll('.process-step-item');
      var photos = document.querySelectorAll('.process-photo');
      var dots = document.querySelectorAll('.process-photo-dot');

      steps.forEach(function(step, i) {
        var detail = step.querySelector('.process-step-detail');
        var numEl = step.querySelector('.process-step-num');
        var iconEl = step.querySelector('.process-step-icon');
        var circle = step.querySelector('.process-step-circle');
        var titleEl = step.querySelector('h3');
        var d = processStepData[i];

        if (i === index) {
          // Active: show icon, hide number, expand detail, highlight
          step.style.background = d.bgActive;
          step.style.borderColor = d.borderActive;
          if (numEl) numEl.classList.add('hidden');
          if (iconEl) iconEl.classList.remove('hidden');
          circle.style.borderColor = d.borderActive;
          circle.style.boxShadow = d.glowActive;
          if (titleEl) { titleEl.style.color = 'white'; titleEl.style.fontSize = '1.25rem'; }
          detail.style.maxHeight = '80px';
          detail.style.opacity = '1';
        } else {
          // Inactive: show number, hide icon, collapse detail, dim
          step.style.background = 'transparent';
          step.style.borderColor = 'rgba(83,166,220,0.08)';
          if (numEl) numEl.classList.remove('hidden');
          if (iconEl) iconEl.classList.add('hidden');
          circle.style.borderColor = i % 2 === 0 ? 'rgba(83,166,220,0.2)' : 'rgba(129,183,82,0.2)';
          circle.style.boxShadow = 'none';
          if (titleEl) { titleEl.style.color = 'rgba(255,255,255,0.6)'; titleEl.style.fontSize = '1.125rem'; }
          detail.style.maxHeight = '0';
          detail.style.opacity = '0';
        }
      });

      // Update photos
      photos.forEach(function(photo, i) {
        photo.style.opacity = i === index ? '1' : '0';
      });

      // Update dots
      dots.forEach(function(dot, i) {
        dot.style.width = i === index ? '2rem' : '0.5rem';
        dot.style.background = i === index ? processStepData[index].color : 'rgba(239,240,241,0.2)';
      });

      // Update photo overlay info
      var d = processStepData[index];
      document.getElementById('process-photo-label').textContent = d.label;
      document.getElementById('process-photo-label').style.color = d.color;
      document.getElementById('process-photo-title').textContent = d.title;
      document.getElementById('process-photo-desc').textContent = d.desc;
      // Update photo circle border and icon
      var circle = document.getElementById('process-photo-circle');
      circle.style.borderColor = d.color;
      // Copy the icon SVG from the active step
      var activeIcon = steps[index].querySelector('.process-step-icon');
      if (activeIcon) {
        document.getElementById('process-photo-svg').outerHTML = activeIcon.outerHTML.replace('class="process-step-icon"', 'id="process-photo-svg"').replace('hidden', '').replace('width="22"', 'width="18"').replace('height="22"', 'height="18"');
      }
    };

    // ── Process section: mobile tap + swipe support ──
    (function() {
      var stepItems = document.querySelectorAll('.process-step-item');
      var dots = document.querySelectorAll('.process-photo-dot');
      var photoContainer = document.getElementById('process-photo-container');
      if (!stepItems.length) return;

      var currentStep = 0;

      // Tap on step cards
      stepItems.forEach(function(step, i) {
        step.addEventListener('click', function() {
          currentStep = i;
          window.activateStep(i);
        });
      });

      // Tap on dot indicators
      dots.forEach(function(dot, i) {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', function() {
          currentStep = i;
          window.activateStep(i);
        });
      });

      // Swipe on the photo container
      if (photoContainer) {
        var touchStartX = 0, touchStartY = 0;
        photoContainer.addEventListener('touchstart', function(e) {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        photoContainer.addEventListener('touchend', function(e) {
          var diffX = touchStartX - e.changedTouches[0].screenX;
          var diffY = touchStartY - e.changedTouches[0].screenY;
          if (Math.abs(diffX) < 50) return;
          if (Math.abs(diffY) > Math.abs(diffX)) return;
          if (diffX > 0) {
            currentStep = Math.min(currentStep + 1, stepItems.length - 1);
          } else {
            currentStep = Math.max(currentStep - 1, 0);
          }
          window.activateStep(currentStep);
        }, { passive: true });
      }
    })();

    // ── Mobile hamburger menu ──
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function() {
        const isOpen = mobileMenu.dataset.open === 'true';
        if (isOpen) {
          mobileMenu.style.maxHeight = '0';
          mobileMenu.style.opacity = '0';
          mobileMenu.dataset.open = 'false';
          menuBtn.setAttribute('aria-expanded', 'false');
        } else {
          mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
          mobileMenu.style.opacity = '1';
          mobileMenu.dataset.open = 'true';
          menuBtn.setAttribute('aria-expanded', 'true');
        }
      });
      // Close menu when a link is clicked
      mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          mobileMenu.style.maxHeight = '0';
          mobileMenu.style.opacity = '0';
          mobileMenu.dataset.open = 'false';
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // ── Before/After Comparison Slider ──
    (function() {
      const slider = document.getElementById('comparison-slider');
      const afterLayer = document.getElementById('comp-after');
      const handle = document.getElementById('comp-handle');
      const labelBefore = document.getElementById('comp-label-before');
      const labelAfter = document.getElementById('comp-label-after');
      if (!slider || !afterLayer || !handle) return;

      let dragging = false;

      function updatePosition(clientX) {
        const rect = slider.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        afterLayer.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
        handle.style.left = pct + '%';

        // "Before" red label (left): visible only when slider reveals 75%+ of the before image
        if (labelBefore) labelBefore.style.opacity = pct < 25 ? '1' : '0';
        // "After" green label (right): visible only when slider reveals 75%+ of the after image
        if (labelAfter) labelAfter.style.opacity = pct > 75 ? '1' : '0';
      }

      slider.addEventListener('mousedown', function(e) { dragging = true; updatePosition(e.clientX); });
      slider.addEventListener('touchstart', function(e) { dragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });

      window.addEventListener('mousemove', function(e) { if (dragging) updatePosition(e.clientX); });
      window.addEventListener('touchmove', function(e) { if (dragging) updatePosition(e.touches[0].clientX); }, { passive: true });

      window.addEventListener('mouseup', function() { dragging = false; });
      window.addEventListener('touchend', function() { dragging = false; });
    })();
