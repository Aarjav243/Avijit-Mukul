/* 
  Avijit Mukul Kishore - Cinematic Portfolio script
  Aesthetic: Museum-Archival, Documentary & High-End Editorial
  Configured by Taste-Skill & UI/UX Pro Max Principles
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. MOBILE NAVIGATION TOGGLE
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      
      // Animate hamburger to X
      const spans = navToggle.querySelectorAll('span');
      if (navToggle.classList.contains('active')) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // 2. HERO VISUAL CAROUSEL (Fades stills with scaling effect)
  const stills = document.querySelectorAll('.visual-still');
  const stillTitle = document.querySelector('.still-title');
  const stillMeta = document.querySelector('.still-meta');
  
  if (stills.length > 0) {
    let currentIdx = 0;
    
    // Metadata for the hero carousel
    const stillsData = [
      { title: "A Minuscule Minority", meta: "2025 · DIRECTED BY AVIJIT MUKUL KISHORE" },
      { title: "Lovely Villa - Architecture as Autobiography", meta: "2019 · CO-DIRECTED WITH ROHAN SHIVKUMAR" },
      { title: "To Let the World In", meta: "2013 · DIRECTED BY AVIJIT MUKUL KISHORE" },
      { title: "Nostalgia for the Future", meta: "2017 · CO-DIRECTED WITH ROHAN SHIVKUMAR" }
    ];

    setInterval(() => {
      stills[currentIdx].classList.remove('active');
      currentIdx = (currentIdx + 1) % stills.length;
      stills[currentIdx].classList.add('active');
      
      // Smooth text update with slight fade
      if (stillTitle && stillMeta) {
        stillTitle.style.opacity = '0';
        stillMeta.style.opacity = '0';
        
        setTimeout(() => {
          stillTitle.textContent = stillsData[currentIdx].title;
          stillMeta.textContent = stillsData[currentIdx].meta;
          stillTitle.style.opacity = '1';
          stillMeta.style.opacity = '1';
        }, 300);
      }
    }, 5000);
  }

  // 3. INTERSECTION OBSERVER FOR SCROLL REVEALS & SPECIAL ANIMATIONS
  
  // A. PREPARE DOM FOR FILM-CUT AND COUNTER ANIMATIONS
  const cutElements = document.querySelectorAll('.film-cut-reveal');
  cutElements.forEach(el => {
    const originalHTML = el.innerHTML;
    el.innerHTML = `
      <span class="film-cut-content">${originalHTML}</span>
      <span class="film-cut-overlay"></span>
    `;
  });

  const counterElements = document.querySelectorAll('.film-counter');
  counterElements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    if (!isNaN(target)) {
      el.textContent = "1900"; // Starting count year
    }
  });

  const ongoingElements = document.querySelectorAll('.timeline-date-ongoing');
  ongoingElements.forEach(el => {
    el.textContent = ""; // Blank initially for typewriter typing effect
  });

  // Prep Film Items (Shutter / Slate Board)
  const filmItems = document.querySelectorAll('.film-item');
  filmItems.forEach(el => {
    const img = el.querySelector('.film-showcase-visual img');
    if (img) {
      // Smooth hover scale zoom using GSAP
      el.addEventListener('mouseenter', () => {
        if (el.classList.contains('animated-film')) {
          window.gsap.to(img, { scale: 1.06, duration: 0.6, ease: "power2.out" });
        }
      });
      el.addEventListener('mouseleave', () => {
        if (el.classList.contains('animated-film')) {
          window.gsap.to(img, { scale: 1.0, duration: 0.6, ease: "power2.out" });
        }
      });
    }
    // Initialize immediately to hidden state
    resetFilmItem(el);
  });

  // B. ANIMATION HELPERS
  const animateFilmCut = (el) => {
    if (el.classList.contains('animating') || el.classList.contains('animated')) return;
    el.classList.add('animating');
    
    const content = el.querySelector('.film-cut-content');
    const overlay = el.querySelector('.film-cut-overlay');
    
    if (window.gsap && content && overlay) {
      const tl = window.gsap.timeline({
        onComplete: () => {
          el.classList.remove('animating');
          el.classList.add('animated');
        }
      });
      
      tl.to(overlay, {
        scaleX: 1,
        duration: 0.5,
        ease: "power2.inOut"
      })
      .set(content, {
        opacity: 1
      })
      .to(overlay, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.5,
        ease: "power2.inOut"
      });
    } else {
      if (content) content.style.opacity = '1';
      if (overlay) overlay.style.display = 'none';
      el.classList.add('animated');
    }
  };

  const animateFilmCounter = (el) => {
    if (el.classList.contains('animating') || el.classList.contains('animated')) return;
    el.classList.add('animating');
    
    const targetVal = parseInt(el.getAttribute('data-target'));
    if (isNaN(targetVal)) return;
    
    if (window.gsap) {
      const obj = { val: 1900 };
      window.gsap.to(obj, {
        val: targetVal,
        duration: 1.8,
        ease: "power3.out",
        snap: { val: 1 },
        onUpdate: () => {
          el.textContent = Math.floor(obj.val);
        },
        onComplete: () => {
          el.textContent = targetVal;
          el.classList.remove('animating');
          el.classList.add('animated');
        }
      });
    } else {
      el.textContent = targetVal;
      el.classList.add('animated');
    }
  };

  const animateTypewriter = (el) => {
    if (el.classList.contains('animating') || el.classList.contains('animated')) return;
    el.classList.add('animating');
    
    const text = el.getAttribute('data-text') || "Ongoing";
    el.textContent = "";
    
    let i = 0;
    const speed = 120; // Typing speed in ms
    
    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.remove('animating');
        el.classList.add('animated');
      }
    };
    type();
  };

  function animateFilmItem(filmItem) {
    // Always force-restart — remove stale state classes so fast scrolling never gets stuck
    filmItem.classList.remove('animating-film', 'animated-film');
    filmItem.classList.add('animating-film');

    const img = filmItem.querySelector('.film-showcase-visual img');
    const infoElements = filmItem.querySelectorAll('.film-showcase-info > *');

    if (window.gsap) {
      // Kill any in-flight tweens immediately before starting fresh
      if (img) window.gsap.killTweensOf(img);
      infoElements.forEach(el => window.gsap.killTweensOf(el));

      const tl = window.gsap.timeline({
        onComplete: () => {
          filmItem.classList.remove('animating-film');
          filmItem.classList.add('animated-film');
        }
      });

      // overwrite:"auto" cancels any competing tween on the same property
      tl.to(img, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.2,
        ease: "power4.out",
        overwrite: "auto"
      })
      .to(infoElements, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto"
      }, "-=0.8");
    } else {
      if (img) {
        img.style.clipPath = "inset(0% 0% 0% 0%)";
        img.style.transform = "scale(1)";
      }
      infoElements.forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      filmItem.classList.add('animated-film');
    }
  }

  // D. RESET HELPERS (For scroll-out-of-view resets to trigger again)
  const resetFilmCut = (el) => {
    el.classList.remove('animating', 'animated');
    const content = el.querySelector('.film-cut-content');
    const overlay = el.querySelector('.film-cut-overlay');
    if (window.gsap) {
      if (overlay) window.gsap.killTweensOf(overlay);
      if (content) window.gsap.killTweensOf(content);
    }
    if (content) content.style.opacity = '0';
    if (overlay) {
      if (window.gsap) {
        window.gsap.set(overlay, { scaleX: 0, transformOrigin: "left" });
      } else {
        overlay.style.transform = 'scaleX(0)';
      }
    }
  };

  const resetFilmCounter = (el) => {
    el.classList.remove('animating', 'animated');
    if (window.gsap) {
      window.gsap.killTweensOf(el);
    }
    el.textContent = "1900";
  };

  const resetTypewriter = (el) => {
    el.classList.remove('animating', 'animated');
    el.textContent = "";
  };

  function resetFilmItem(filmItem) {
    filmItem.classList.remove('animating-film', 'animated-film');

    const img = filmItem.querySelector('.film-showcase-visual img');
    const infoElements = filmItem.querySelectorAll('.film-showcase-info > *');

    if (window.gsap) {
      // Kill all in-flight tweens — snap instantly, no lingering mid-state
      if (img) window.gsap.killTweensOf(img);
      infoElements.forEach(el => window.gsap.killTweensOf(el));
      
      if (img) {
        // overwrite:true forcibly clears any competing queued set on this element
        window.gsap.set(img, {
          clipPath: "inset(0% 50% 0% 50%)",
          scale: 1.08,
          overwrite: true
        });
      }
      if (infoElements.length > 0) {
        window.gsap.set(infoElements, {
          opacity: 0,
          y: 15,
          overwrite: true
        });
      }
    } else {
      if (img) {
        img.style.clipPath = "inset(0% 50% 0% 50%)";
        img.style.transform = "scale(1.08)";
      }
      infoElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(15px)";
      });
    }
  }

  // E. SETUP INTERSECTION OBSERVER
  const revealElements = document.querySelectorAll('.reveal-element');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          if (entry.target.classList.contains('film-item')) {
            // Film items: make the container visible instantly so only
            // the inner shutter/slate animations run — no competing opacity tween
            if (window.gsap) {
              window.gsap.killTweensOf(entry.target);
              window.gsap.set(entry.target, { opacity: 1, y: 0, overwrite: true });
            }
            animateFilmItem(entry.target);
          } else {
            // Non-film elements: smooth fade-up as before
            if (window.gsap) {
              window.gsap.to(entry.target, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                overwrite: "auto"
              });
            }
          }
          
          // Trigger Film Cut reveal on target itself if applicable
          if (entry.target.classList.contains('film-cut-reveal')) {
            animateFilmCut(entry.target);
          }
          
          // Trigger Film Cut reveals inside the container with stagger
          const cutReveals = entry.target.querySelectorAll('.film-cut-reveal');
          cutReveals.forEach((el, index) => {
            setTimeout(() => {
              // Only run animation if the element is still in view/revealed
              if (entry.target.classList.contains('revealed')) {
                animateFilmCut(el);
              }
            }, index * 150); // 150ms stagger
          });
          
          // Trigger Film Counters inside the container
          const counters = entry.target.querySelectorAll('.film-counter');
          counters.forEach(el => animateFilmCounter(el));
          
          // Trigger Typewriter inside the container
          const typewriters = entry.target.querySelectorAll('.timeline-date-ongoing');
          typewriters.forEach(el => animateTypewriter(el));
          
        } else {
          // Reset elements when they scroll out of view
          entry.target.classList.remove('revealed');
          
          if (window.gsap) {
            window.gsap.killTweensOf(entry.target);
            // film-item handles its own visibility — don't reset it
            if (!entry.target.classList.contains('film-item')) {
              window.gsap.set(entry.target, { opacity: 0, y: 30, overwrite: true });
            }
          }
          
          // Reset Film Shutter & Slate Board if target is a film item
          if (entry.target.classList.contains('film-item')) {
            resetFilmItem(entry.target);
          }
          
          // Reset Film Cut reveal on target itself if applicable
          if (entry.target.classList.contains('film-cut-reveal')) {
            resetFilmCut(entry.target);
          }
          
          // Reset Film Cut reveals inside the container
          const cutReveals = entry.target.querySelectorAll('.film-cut-reveal');
          cutReveals.forEach(el => resetFilmCut(el));
          
          // Reset Film Counters inside the container
          const counters = entry.target.querySelectorAll('.film-counter');
          counters.forEach(el => resetFilmCounter(el));
          
          // Reset Typewriter inside the container
          const typewriters = entry.target.querySelectorAll('.timeline-date-ongoing');
          typewriters.forEach(el => resetTypewriter(el));
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
    // Expose so CMS-rendered elements can be observed after the fact
    window.__observeNew = (els) => els.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => {
      el.classList.add('revealed');
      
      // Instantly reveal special animations in fallback
      if (el.classList.contains('film-item')) animateFilmItem(el);
      
      const cutReveals = el.querySelectorAll('.film-cut-reveal');
      if (el.classList.contains('film-cut-reveal')) animateFilmCut(el);
      cutReveals.forEach(c => animateFilmCut(c));
      
      const counters = el.querySelectorAll('.film-counter');
      counters.forEach(c => animateFilmCounter(c));
      
      const typewriters = el.querySelectorAll('.timeline-date-ongoing');
      typewriters.forEach(t => animateTypewriter(t));
    });
  }

  // 4. TAB FILTERING SYSTEM (cinematographer.html) — iris wipe transition + timecode-scramble meta text
  const tabButtons = document.querySelectorAll('.tab-btn');
  const cinemaRows = document.querySelectorAll('.cinema-row');
  const tabIndicator = document.querySelector('.tab-indicator-bar');
  const cinemaGrid = document.querySelector('.cinema-dual-grid');

  if (tabButtons.length > 0 && cinemaRows.length > 0) {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateIndicator = (activeBtn) => {
      if (tabIndicator) {
        tabIndicator.style.left = `${activeBtn.offsetLeft}px`;
        tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
      }
    };

    const applyFilter = (filterValue) => {
      document.querySelectorAll('.cinema-row').forEach(row => {
        const cat = row.getAttribute('data-category');
        row.style.display = (filterValue === 'all' || cat === filterValue) ? 'grid' : 'none';
      });
    };

    // Timecode-style scramble: meta text (e.g. "Cinematographer") flickers before locking in
    const scrambleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:';
    const scrambleText = (el, duration = 900) => {
      if (!el.dataset.finalText) el.dataset.finalText = el.textContent;
      const finalText = el.dataset.finalText;
      if (reduceMotion || !finalText.trim()) return;
      const token = Symbol();
      el._scrambleToken = token;
      const start = performance.now();
      const tick = (now) => {
        if (el._scrambleToken !== token) return;
        const progress = Math.min((now - start) / duration, 1);
        const revealCount = Math.floor(progress * finalText.length);
        el.textContent = finalText.split('').map((ch, i) => {
          if (ch === ' ' || i < revealCount) return ch;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = finalText;
      };
      requestAnimationFrame(tick);
    };

    const scrambleVisibleMeta = () => {
      document.querySelectorAll('.cinema-row').forEach(row => {
        if (row.style.display === 'none') return;
        const meta = row.querySelector('.cinema-meta-block');
        if (meta) scrambleText(meta);
      });
    };

    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) setTimeout(() => updateIndicator(activeTab), 100);

    scrambleVisibleMeta();

    // Re-apply current filter to newly CMS-rendered rows
    window.__tabsInit = () => {
      const current = document.querySelector('.tab-btn.active');
      applyFilter(current ? current.getAttribute('data-filter') : 'all');
      scrambleVisibleMeta();
    };

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateIndicator(btn);

        const filterValue = btn.getAttribute('data-filter');

        // Iris wipe: close, swap the row set behind the wipe, reopen onto the new set
        if (reduceMotion || !cinemaGrid) {
          applyFilter(filterValue);
          scrambleVisibleMeta();
          return;
        }
        cinemaGrid.classList.add('iris-closing');
        setTimeout(() => {
          applyFilter(filterValue);
          scrambleVisibleMeta();
          cinemaGrid.classList.remove('iris-closing');
        }, 500);
      });
    });

    window.addEventListener('resize', () => {
      const currentActive = document.querySelector('.tab-btn.active');
      if (currentActive) updateIndicator(currentActive);
    });
  }

  // 4b. DEPTH PARALLAX (cinematographer.html) — title/meta drift at different rates, easing behind scroll
  if (cinemaRows.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const vh = () => window.innerHeight;
    const parallaxState = new WeakMap();
    const AMPLITUDE = 24;
    const EASE = 0.06; // lower = slower, more visible lag behind the scroll

    const computeTargets = () => {
      document.querySelectorAll('.cinema-row').forEach(row => {
        const rect = row.getBoundingClientRect();
        const inRange = !(rect.bottom < -150 || rect.top > vh() + 150);
        const target = inRange ? (rect.top + rect.height / 2 - vh() / 2) / vh() : 0;
        const state = parallaxState.get(row) || { current: 0, target: 0 };
        state.target = target;
        parallaxState.set(row, state);
      });
    };

    let rafId = null;
    const tick = () => {
      let stillMoving = false;
      document.querySelectorAll('.cinema-row').forEach(row => {
        const state = parallaxState.get(row);
        if (!state) return;
        const diff = state.target - state.current;
        if (Math.abs(diff) > 0.0008) stillMoving = true;
        state.current += diff * EASE;
        const title = row.querySelector('.cinema-title-block');
        const meta = row.querySelector('.cinema-meta-block');
        if (title) title.style.transform = `translateY(${state.current * -AMPLITUDE}px)`;
        if (meta) meta.style.transform = `translateY(${state.current * AMPLITUDE}px)`;
      });
      rafId = stillMoving ? requestAnimationFrame(tick) : null;
    };

    const onScroll = () => {
      computeTargets();
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Re-run after CMS re-renders rows, so freshly injected rows get their first parallax pass
    const prevTabsInit = window.__tabsInit;
    window.__tabsInit = () => {
      if (prevTabsInit) prevTabsInit();
      onScroll();
    };
  }

  // 4c. TIMECODE SCROLL COUNTER (cinematographer.html) — synthetic timecode readout tied to scroll position
  const timecodeEl = document.getElementById('timecode-counter');
  const timecodeValueEl = timecodeEl && timecodeEl.querySelector('.timecode-value');
  if (timecodeEl && timecodeValueEl && cinemaRows.length > 0) {
    const pad = (n) => String(n).padStart(2, '0');
    const FPS = 24;

    const updateTimecode = () => {
      const total = document.querySelectorAll('.cinema-row').length;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      timecodeEl.classList.toggle('visible', window.scrollY > 40);

      const totalFrames = Math.round(progress * total * FPS);
      const frames = totalFrames % FPS;
      const totalSeconds = Math.floor(totalFrames / FPS);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      timecodeValueEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    };

    window.addEventListener('scroll', updateTimecode, { passive: true });
    updateTimecode();

    const prevTabsInitTC = window.__tabsInit;
    window.__tabsInit = () => {
      if (prevTabsInitTC) prevTabsInitTC();
      updateTimecode();
    };
  }

  // 4d. FILM-STRIP SCROLL TRACK (cinematographer.html) — perforated rails (both edges) fill as the page scrolls
  const filmstripFills = document.querySelectorAll('.filmstrip-fill');
  if (filmstripFills.length > 0) {
    const updateFilmstrip = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      filmstripFills.forEach((el) => {
        el.style.height = `${progress * 100}%`;
      });
    };

    window.addEventListener('scroll', updateFilmstrip, { passive: true });
    window.addEventListener('resize', updateFilmstrip, { passive: true });
    updateFilmstrip();
  }

  // 4e. WRITING PAGE — card scroll-reveal, gold progress line, title glow, drop-in nodes (writing.html)
  const writingProgressFill = document.querySelector('.writing-progress-line-fill');
  const writingProgressWrap = document.querySelector('.writing-progress-wrap');
  const writingProgressLine = document.querySelector('.writing-progress-line');
  let writingNodes = [];

  const initWritingCards = () => {
    const cards = document.querySelectorAll('.writing-card');
    if (cards.length === 0) return;
    if ('IntersectionObserver' in window) {
      const writingObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('revealed', entry.isIntersecting);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      cards.forEach((card, i) => {
        card.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
        writingObserver.observe(card);
      });
    } else {
      cards.forEach(card => card.classList.add('revealed'));
    }
  };

  // One drop-in node per article, positioned on the progress line beside that article's title
  const buildWritingNodes = () => {
    if (!writingProgressLine) return;
    writingProgressLine.querySelectorAll('.writing-progress-node').forEach(n => n.remove());
    const lineRect = writingProgressLine.getBoundingClientRect();
    writingNodes = Array.from(document.querySelectorAll('.writing-card-title')).map((title) => {
      const node = document.createElement('div');
      node.className = 'writing-progress-node';
      const r = title.getBoundingClientRect();
      node.style.top = `${r.top - lineRect.top + r.height / 2}px`;
      writingProgressLine.appendChild(node);
      return node;
    });
    // Force the browser to commit the pre-drop state before any class toggle,
    // otherwise a same-tick add of "dropped" right after creation can skip the transition.
    void writingProgressLine.offsetHeight;
  };

  const updateWritingProgress = () => {
    if (!writingProgressFill || !writingProgressWrap) return;
    const wrapRect = writingProgressWrap.getBoundingClientRect();
    const readingLineY = window.innerHeight * 0.45;
    // Near the bottom of the page there's no scroll room left for the reading line to
    // reach the last card, so force completion instead of leaving the fill/divider short.
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const fillPx = atBottom ? wrapRect.height : Math.min(wrapRect.height, Math.max(0, readingLineY - wrapRect.top));
    writingProgressFill.style.height = wrapRect.height > 0 ? `${(fillPx / wrapRect.height) * 100}%` : '0%';

    document.querySelectorAll('.writing-card').forEach((card, i) => {
      if (atBottom) card.classList.add('revealed');

      const title = card.querySelector('.writing-card-title');
      const r = title.getBoundingClientRect();
      const center = r.top + r.height / 2;
      // Node pop and underline draw fire the moment the reading line enters the glow
      // zone (same -70px threshold as the glow check) so all three happen together.
      const crossed = atBottom || readingLineY >= center - 70;
      title.classList.toggle('glow', Math.abs(center - readingLineY) < 70);
      card.classList.toggle('line-drawn', crossed);
      // Toggle (not just add) so the drop replays every time the line crosses back and forth
      if (writingNodes[i]) writingNodes[i].classList.toggle('dropped', crossed);
    });
  };

  if (document.querySelectorAll('.writing-card').length > 0) {
    initWritingCards();
    buildWritingNodes();
    window.addEventListener('scroll', updateWritingProgress, { passive: true });
    window.addEventListener('resize', () => {
      buildWritingNodes();
      updateWritingProgress();
    }, { passive: true });
    updateWritingProgress();

    // Re-run after CMS replaces #cms-writing-list's contents
    window.__writingCardsInit = () => {
      initWritingCards();
      buildWritingNodes();
      updateWritingProgress();
    };
  }

  // 5. GSAP CINEMATIC ENTRANCE ANIMATIONS
  if (window.gsap) {
    // Hero Entrance Sequence
    const tl = window.gsap.timeline();

    tl.from('header.site-nav', {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    if (document.querySelector('.home-hero')) {
      tl.from('.hero-role', {
        x: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      .from('.hero-title span', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power4.out'
      }, '-=0.6')
      .from('.hero-description', {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, '-=0.6')
      .from('.hero-ctas .btn', {
        opacity: 0,
        y: 15,
        stagger: 0.1,
        duration: 0.6
      }, '-=0.4')
      .from('.hero-visual', {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.8');
    }
  }
});
