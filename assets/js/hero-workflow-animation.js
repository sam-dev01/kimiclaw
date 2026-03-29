(function () {
  'use strict';

  const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isCompactMobile = window.innerWidth <= 768;

  /* ── HERO CANVAS STARFIELD ── */
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const reduceMotion = reduceMotionMedia.matches || isCompactMobile;
    const heroAnimatedEls = heroEl.querySelectorAll('.hero-animate');
    const heroProofCards = heroEl.querySelectorAll('.hero-proof-card');
    const heroPreview = heroEl.querySelector('.hero-card-preview');
    const previewCard = heroEl.querySelector('.preview-card');
    const previewBars = heroEl.querySelectorAll('.preview-bar');
    const heroGlows = heroEl.querySelectorAll('.hero-glow');

    if (window.gsap && !reduceMotion) {
      gsap.set(heroAnimatedEls, { autoAlpha: 0, y: 28, filter: 'blur(10px)' });
      gsap.set(heroGlows, { scale: 0.92, autoAlpha: 0.45 });
      if (heroProofCards.length) {
        gsap.set(heroProofCards, {
          autoAlpha: 0,
          y: 24,
          scale: 0.96,
          rotateX: 4,
          transformPerspective: 1400,
          transformOrigin: '50% 100%'
        });
      }
      if (previewCard) {
        gsap.set(previewCard, {
          rotateX: 5,
          rotateY: -6,
          y: 24,
          scale: 0.985,
          transformPerspective: 1600,
          transformOrigin: '50% 0%'
        });
      }

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .to(heroGlows, {
          autoAlpha: 1,
          scale: 1,
          duration: 1.8,
          stagger: 0.08,
          ease: 'sine.out'
        }, 0)
        .to(heroAnimatedEls, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          stagger: 0.1
        }, 0.12)
        .to(heroProofCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        }, 0.34)
        .to(previewCard, {
          y: 0,
          rotateX: 2.5,
          rotateY: -3.5,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out'
        }, 0.18)
        .fromTo(previewBars,
          { scaleY: 0.72, transformOrigin: '50% 100%' },
          {
            scaleY: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: 'elastic.out(1, 0.7)'
          },
          0.55
        );

      if (previewCard) {
        gsap.to(previewCard, {
          y: '-=10',
          rotateX: 3,
          rotateY: -2,
          duration: 5.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (heroProofCards.length && !isCompactMobile) {
        heroProofCards.forEach((card, index) => {
          gsap.to(card, {
            y: index === 1 ? -10 : -6,
            duration: 3.6 + (index * 0.35),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.9 + (index * 0.12)
          });
        });
      }

      const previewLines = heroEl.querySelectorAll('.preview-line');
      const previewStats = heroEl.querySelectorAll('.preview-stat-card');
      const previewDashCard = heroEl.querySelector('.preview-dash-card');

      if (previewLines.length) {
        gsap.to(previewLines, {
          opacity: 0.7,
          duration: 1.8,
          stagger: 0.12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (previewStats.length) {
        gsap.to(previewStats, {
          y: -3,
          duration: 2.4,
          stagger: 0.18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (previewDashCard) {
        gsap.to(previewDashCard, {
          boxShadow: '0 18px 34px rgba(111,115,255,0.16)',
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      heroGlows.forEach((glow, index) => {
        gsap.to(glow, {
          x: index === 1 ? -18 : 18,
          y: index === 2 ? -16 : 14,
          duration: 9 + (index * 2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      if (!isCoarsePointer && !isCompactMobile) {
        const parallaxItems = Array.from(heroEl.querySelectorAll('[data-depth]'));
        let pointerX = 0;
        let pointerY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId = 0;

        const updateParallax = () => {
          currentX += (pointerX - currentX) * 0.08;
          currentY += (pointerY - currentY) * 0.08;

          parallaxItems.forEach((item) => {
            const depth = parseFloat(item.dataset.depth || '0');
            const baseY = item === heroPreview ? -7 : 0;
            gsap.set(item, {
              x: currentX * depth,
              y: baseY + (currentY * depth),
              rotateX: currentY * depth * -0.012,
              rotateY: currentX * depth * 0.015,
              transformPerspective: 1400,
              transformOrigin: '50% 50%'
            });
          });

          rafId = requestAnimationFrame(updateParallax);
        };

        const handlePointerMove = (event) => {
          const rect = heroEl.getBoundingClientRect();
          pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 32;
          pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 24;
        };

        const resetPointer = () => {
          pointerX = 0;
          pointerY = 0;
        };

        heroEl.addEventListener('pointermove', handlePointerMove);
        heroEl.addEventListener('pointerleave', resetPointer);
        rafId = requestAnimationFrame(updateParallax);

        window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId), { once: true });
      }
    } else {
      heroAnimatedEls.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
    }

    if (window.innerWidth > 768 && !reduceMotion) {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.58;';
      heroEl.insertBefore(canvas, heroEl.firstChild);

      const ctx = canvas.getContext('2d');
      let stars = [];
      let animFrame = 0;
      let active = true;

      function resizeCanvas() {
        canvas.width = heroEl.offsetWidth;
        canvas.height = heroEl.offsetHeight;
        initStars();
      }

      function initStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 11000);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.2,
            alpha: Math.random() * 0.45 + 0.08,
            driftX: (Math.random() - 0.5) * 0.12,
            driftY: Math.random() * 0.2 + 0.04,
            twinkle: Math.random() * Math.PI * 2
          });
        }
      }

      function drawStars() {
        if (!active) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach((star) => {
          star.x += star.driftX;
          star.y += star.driftY;
          star.twinkle += 0.02;

          if (star.x < -4) star.x = canvas.width + 4;
          if (star.x > canvas.width + 4) star.x = -4;
          if (star.y > canvas.height + 4) {
            star.y = -4;
            star.x = Math.random() * canvas.width;
          }

          const opacity = star.alpha + Math.sin(star.twinkle) * 0.08;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(215, 210, 255, ${Math.max(0.04, opacity)})`;
          ctx.fill();
        });

        animFrame = requestAnimationFrame(drawStars);
      }

      resizeCanvas();
      drawStars();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      const heroObs = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting;
        if (!isVisible) {
          active = false;
          cancelAnimationFrame(animFrame);
          return;
        }

        if (!active) {
          active = true;
          drawStars();
        }
      });
      heroObs.observe(heroEl);
    }
  }

  /* ── WORKFLOW DEMO: 14s PRODUCT STORY LOOP ── */
  const workflowStage = document.getElementById('workflowStage');
  if (workflowStage) {
    const reduceMotion = reduceMotionMedia.matches;
    const compactMobile = isCompactMobile;
    const compactPhone = window.innerWidth <= 480;
    const workflowIntro = workflowStage.querySelector('.workflow-intro');
    const workflowProofCards = workflowStage.querySelectorAll('.workflow-proof-card');
    const workflowFormPanel = workflowStage.querySelector('.workflow-form-panel');
    const workflowBuildPanel = workflowStage.querySelector('.workflow-build-panel');
    const workflowFloating = workflowStage.querySelectorAll('.workflow-floating');
    const workflowFieldCards = workflowStage.querySelectorAll('.workflow-field-card');
    const workflowBuildSteps = workflowStage.querySelectorAll('.workflow-build-step');
    const workflowBuildBars = workflowStage.querySelectorAll('.build-bar');
    const workflowProgressSegs = workflowStage.querySelectorAll('.workflow-progress-seg');
    const workflowSubmitBtn = workflowStage.querySelector('.workflow-submit-btn');
    const workflowFieldName = document.getElementById('workflowFieldName');
    const workflowFieldEmail = document.getElementById('workflowFieldEmail');
    const workflowFieldBudget = document.getElementById('workflowFieldBudget');
    const workflowFieldPurpose = document.getElementById('workflowFieldPurpose');
    const fieldData = [
      { el: workflowFieldName, value: 'Riya Sharma' },
      { el: workflowFieldEmail, value: 'hello@novafitstudio.com' },
      { el: workflowFieldBudget, value: '$299 - $999' },
      { el: workflowFieldPurpose, value: 'Build a trust-first business website that converts more leads.' }
    ];

    if (window.gsap && !reduceMotion && !compactMobile) {
      const typingStates = fieldData.map(() => ({ count: 0 }));
      const fastMode = !compactMobile;

      gsap.set(workflowIntro, { autoAlpha: 0, scale: 0.96, y: 20 });
      gsap.set(workflowProofCards, { autoAlpha: 0, y: 18, scale: 0.96 });
      gsap.set(workflowFormPanel, { autoAlpha: 0, y: 24, x: -18, scale: 0.98 });
      gsap.set(workflowBuildPanel, { autoAlpha: 0, y: 30, x: 18, scale: 0.98 });
      gsap.set(workflowFloating, { autoAlpha: 0, y: 18, scale: 0.94 });
      gsap.set(workflowFieldCards, { autoAlpha: 0, y: 16 });
      gsap.set(workflowBuildSteps, { autoAlpha: 0, x: 16 });
      gsap.set(workflowBuildBars, { scaleY: 0.35, transformOrigin: '50% 100%' });
      gsap.set('.workflow-bg-gradient', { scale: 1.08, transformOrigin: '50% 50%' });
      fieldData.forEach(({ el }) => {
        if (el) el.textContent = '';
      });

      const animateProgressSegment = (seg, duration) => {
        const bar = seg;
        gsap.fromTo(bar, { '--progress-width': '0%' }, {
          '--progress-width': '100%',
          duration,
          ease: 'none'
        });
      };

      workflowProgressSegs.forEach((seg) => seg.style.setProperty('--progress-width', '0%'));

      const workflowTl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 0.8,
        defaults: { ease: 'power3.out' },
        onRepeat: () => {
          typingStates.forEach((state, index) => {
            state.count = 0;
            if (fieldData[index].el) fieldData[index].el.textContent = '';
          });
          workflowProgressSegs.forEach((seg) => seg.style.setProperty('--progress-width', '0%'));
        }
      });

      const addTypingTween = (state, value, el, duration, position) => {
        workflowTl.to(state, {
          count: value.length,
          duration,
          ease: 'none',
          snap: 'count',
          onUpdate: () => {
            if (el) el.textContent = value.slice(0, state.count);
          }
        }, position);
      };

      workflowTl
        .to(workflowIntro, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: fastMode ? 0.7 : 0.85
        }, 0.1)
        .to('.workflow-bg-gradient', {
          scale: 1,
          duration: fastMode ? 1.8 : 2.2,
          ease: 'sine.out'
        }, 0)
        .call(() => animateProgressSegment(workflowProgressSegs[0], fastMode ? 1.85 : 2.2), null, 0.12)
        .to(workflowProofCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: fastMode ? 0.48 : 0.62
        }, 0.32)
        .to(workflowIntro, {
          autoAlpha: 0,
          scale: 0.98,
          y: -18,
          duration: fastMode ? 0.5 : 0.7
        }, fastMode ? 1.85 : 2.45)
        .to(workflowProofCards, {
          autoAlpha: compactMobile ? 0 : 0.15,
          y: compactMobile ? -10 : 0,
          duration: fastMode ? 0.35 : 0.5,
          stagger: 0.05
        }, fastMode ? 1.95 : 2.55)
        .to(workflowFloating, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: fastMode ? 0.45 : 0.62
        }, fastMode ? 1.92 : 2.5)
        .to(workflowFormPanel, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: fastMode ? 0.62 : 0.88
        }, fastMode ? 2.04 : 2.7)
        .to(workflowFieldCards, {
          autoAlpha: 1,
          y: 0,
          duration: fastMode ? 0.34 : 0.48,
          stagger: fastMode ? 0.05 : 0.08
        }, fastMode ? 2.24 : 2.95)
        .call(() => animateProgressSegment(workflowProgressSegs[1], fastMode ? 2.1 : 2.8), null, fastMode ? 2.2 : 2.92)
        .to(workflowSubmitBtn, {
          scale: 1.04,
          boxShadow: '0 14px 36px rgba(124,108,255,0.32)',
          duration: fastMode ? 0.28 : 0.42,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut'
        }, fastMode ? 4.25 : 5.45)
        .to(workflowFormPanel, {
          x: compactMobile ? 0 : -10,
          y: compactMobile ? 0 : -8,
          autoAlpha: compactMobile ? 0 : 1,
          duration: fastMode ? 0.3 : 0.42
        }, fastMode ? 4.48 : 5.8)
        .to(workflowBuildPanel, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: fastMode ? 0.62 : 0.9
        }, fastMode ? 4.6 : 6.0)
        .to(workflowBuildSteps, {
          autoAlpha: 1,
          x: 0,
          duration: fastMode ? 0.36 : 0.56,
          stagger: fastMode ? 0.08 : 0.12
        }, fastMode ? 4.84 : 6.24)
        .to(workflowBuildBars, {
          scaleY: 1,
          duration: fastMode ? 0.7 : 0.92,
          stagger: fastMode ? 0.04 : 0.06,
          ease: 'elastic.out(1, 0.7)'
        }, fastMode ? 5.32 : 7.05)
        .call(() => animateProgressSegment(workflowProgressSegs[2], fastMode ? 1.95 : 2.65), null, fastMode ? 4.72 : 6.16)
        .to(workflowBuildSteps[1], {
          background: 'rgba(255,255,255,0.24)',
          duration: fastMode ? 0.24 : 0.4
        }, fastMode ? 5.86 : 8.1)
        .to(workflowBuildSteps[2], {
          background: 'rgba(255,255,255,0.24)',
          duration: fastMode ? 0.24 : 0.4
        }, fastMode ? 6.28 : 8.9)
        .call(() => animateProgressSegment(workflowProgressSegs[3], fastMode ? 1.8 : 2.4), null, fastMode ? 5.98 : 8.68)
        .to(workflowBuildPanel, {
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 24px 60px rgba(17,18,32,0.2), 0 0 40px rgba(139,92,246,0.12)',
          duration: fastMode ? 0.46 : 0.72,
          yoyo: true,
          repeat: fastMode ? 2 : 1
        }, fastMode ? 6.24 : 9.15)
        .to([workflowFormPanel, workflowBuildPanel, workflowFloating, workflowProofCards], {
          autoAlpha: 0,
          y: 18,
          duration: fastMode ? 0.45 : 0.65,
          stagger: 0.05
        }, fastMode ? 7.55 : 11.2);

      workflowTl.play();

      addTypingTween(typingStates[0], fieldData[0].value, fieldData[0].el, fastMode ? 0.34 : 0.42, fastMode ? 2.44 : 3.16);
      addTypingTween(typingStates[1], fieldData[1].value, fieldData[1].el, fastMode ? 0.5 : 0.58, fastMode ? 2.72 : 3.46);
      addTypingTween(typingStates[2], fieldData[2].value, fieldData[2].el, fastMode ? 0.34 : 0.4, fastMode ? 3.08 : 3.86);
      addTypingTween(typingStates[3], fieldData[3].value, fieldData[3].el, fastMode ? 0.9 : 0.82, fastMode ? 3.28 : 4.08);

      gsap.to(workflowFloating, {
        yPercent: -18,
        duration: fastMode ? 2.2 : (compactPhone ? 2.3 : 2.7),
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.18,
          from: 'random'
        },
        ease: 'sine.inOut'
      });

      gsap.to('.workflow-ring-1', {
        rotate: 12,
        duration: fastMode ? 8 : (compactPhone ? 9 : 10),
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });

      gsap.to('.workflow-ring-2', {
        rotate: -14,
        duration: fastMode ? 10 : (compactPhone ? 11 : 12),
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });

      gsap.to(workflowBuildBars, {
        scaleY: (index) => index === 3 ? 1.08 : 0.96,
        duration: fastMode ? 0.9 : 1.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.08,
        ease: 'sine.inOut'
      });

      gsap.to(workflowFieldCards, {
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), 0 10px 26px rgba(124,108,255,0.12)',
        duration: fastMode ? 0.8 : 1.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
        ease: 'sine.inOut'
      });

      gsap.to(workflowFormPanel, {
        y: '-=4',
        duration: fastMode ? 2.1 : 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(workflowBuildPanel, {
        y: '+=4',
        duration: fastMode ? 2.4 : 3.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      const workflowObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          workflowTl.play();
        } else {
          workflowTl.pause();
        }
      }, { threshold: 0.28 });

      workflowObs.observe(workflowStage);
    } else {
      fieldData.forEach(({ el, value }) => {
        if (el) el.textContent = value;
      });
      [workflowIntro, workflowFormPanel, workflowBuildPanel].forEach((el) => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      workflowProofCards.forEach((card) => { card.style.opacity = '1'; card.style.transform = 'none'; });
      workflowFieldCards.forEach((card) => { card.style.opacity = '1'; card.style.transform = 'none'; });
      workflowBuildSteps.forEach((step) => { step.style.opacity = '1'; step.style.transform = 'none'; });
      workflowFloating.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
    }
  }

})();
