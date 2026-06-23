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

  // ── Helper: Letterpress Stamp for Writing Cards ─────────────────────────
  function animateWritingCard(card) {
    if (!window.gsap) return;
    
    const title = card.querySelector('.writing-card-title');
    const desc = card.querySelector('.writing-card-desc');
    const meta = card.querySelector('.writing-card-meta');
    const link = card.querySelector('.writing-card-link');
    
    window.gsap.killTweensOf([card, title, desc, meta, link]);
    
    // Snap the card container itself to visible since we'll animate children
    window.gsap.set(card, { opacity: 1, y: 0, overwrite: true });
    
    // Initial setup: title is large, desc stays static
    if (title) window.gsap.set(title, { opacity: 0, scale: 1.15, transformOrigin: "left center" });
    if (meta) window.gsap.set(meta, { opacity: 0, y: 10 });
    if (link) window.gsap.set(link, { opacity: 0 });
    
    const tl = window.gsap.timeline();
    
    if (title) {
      tl.to(title, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power4.out" // Hard, heavy ease like a stamp
      });
    }
    
    if (meta) {
      tl.to(meta, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }, "-=0.6");
    }
    if (link) {
      tl.to(link, { opacity: 1, duration: 1.4, ease: "power2.out" }, "-=1.2");
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
          } else if (entry.target.classList.contains('writing-card')) {
            // Writing cards: bespoke letterpress stamp reveal
            animateWritingCard(entry.target);
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
            // For film items the container stays visible (opacity handled by animateFilmItem)
            // For others, hide the container
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

    revealElements.forEach(el => {
      observer.observe(el);
    });
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

  // 4. TAB FILTERING SYSTEM (cinematographer.html) — 3 unique animation modes
  const tabButtons = document.querySelectorAll('.tab-btn');
  const cinemaRows = document.querySelectorAll('.cinema-row');
  const tabIndicator = document.querySelector('.tab-indicator-bar');

  // Track active filter globally so scroll-observer can pick the right animation
  let activeTabFilter = 'all';

  if (tabButtons.length > 0 && cinemaRows.length > 0) {

    // ── Inject clapperboard line element into every film row ──────────────────
    cinemaRows.forEach(row => {
      if (row.getAttribute('data-category') === 'film') {
        if (!row.querySelector('.cinema-clap-line')) {
          const line = document.createElement('span');
          line.className = 'cinema-clap-line';
          row.prepend(line);
        }
      }
    });

    // ── Indicator bar position helper ─────────────────────────────────────────
    const updateIndicator = (activeBtn) => {
      if (tabIndicator) {
        tabIndicator.style.left = `${activeBtn.offsetLeft}px`;
        tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
      }
    };

    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) setTimeout(() => updateIndicator(activeTab), 100);

    // ── RESET: snap a row back to its hidden initial state ────────────────────
    const resetCinemaRow = (row, filter) => {
      if (!window.gsap) return;
      window.gsap.killTweensOf(row);
      const children = Array.from(row.querySelectorAll('.cinema-title-block, .cinema-meta-block'));
      children.forEach(c => window.gsap.killTweensOf(c));

      const f = filter || activeTabFilter;
      if (f === 'art') {
        window.gsap.set(row, { opacity: 0, filter: 'blur(6px)', y: 0, x: 0, overwrite: true });
      } else if (f === 'film') {
        window.gsap.set(row, { opacity: 0, y: 0, x: 0, filter: 'none', overwrite: true });
        window.gsap.set(children, { opacity: 0, y: 8, overwrite: true });
        const clapLine = row.querySelector('.cinema-clap-line');
        if (clapLine) window.gsap.set(clapLine, { width: '0%', opacity: 1, overwrite: true });
      } else {
        // 'all' — slide state
        window.gsap.set(row, { opacity: 0, x: 0, y: 0, filter: 'none', overwrite: true });
      }
    };

    // ── ANIMATE: All Collaborations — alternating L/R slide ──────────────────
    const animateCinemaRowAll = (row, index, baseDelay = 0) => {
      if (!window.gsap) { row.style.opacity = '1'; return; }
      window.gsap.killTweensOf(row);
      const fromX = index % 2 === 0 ? -50 : 50;
      window.gsap.set(row, { opacity: 0, x: fromX, y: 0, filter: 'none', overwrite: true });
      window.gsap.to(row, {
        opacity: 1,
        x: 0,
        duration: 1.3,
        ease: 'power3.out',
        delay: baseDelay,
        overwrite: 'auto'
      });
    };

    // ── ANIMATE: Documentary & Fiction — clapperboard sweep + text rise ───────
    const animateCinemaRowFilm = (row, index, baseDelay = 0) => {
      if (!window.gsap) { row.style.opacity = '1'; return; }
      window.gsap.killTweensOf(row);
      const clapLine = row.querySelector('.cinema-clap-line');
      const children = Array.from(row.querySelectorAll('.cinema-title-block, .cinema-meta-block'));
      children.forEach(c => window.gsap.killTweensOf(c));

      const delay = baseDelay;

      window.gsap.set(row, { opacity: 1, x: 0, y: 0, filter: 'none', overwrite: true });
      window.gsap.set(children, { opacity: 0, y: 12, overwrite: true });

      const tl = window.gsap.timeline({ delay });
      if (clapLine) {
        tl.set(clapLine, { width: '0%', opacity: 1 })
          .to(clapLine, { width: '100%', duration: 0.65, ease: 'power2.inOut' })
          .to(clapLine, { opacity: 0, duration: 0.35, ease: 'power1.out' }, '+=0.06');
      }
      tl.to(children, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power3.out',
        overwrite: 'auto'
      }, clapLine ? '-=0.45' : 0);
    };

    // ── ANIMATE: Visual Art Projects — blur dissolve to clarity ───────────────
    const animateCinemaRowArt = (row, index, baseDelay = 0) => {
      if (!window.gsap) { row.style.opacity = '1'; return; }
      window.gsap.killTweensOf(row);
      window.gsap.set(row, { opacity: 0, filter: 'blur(6px)', x: 0, y: 0, overwrite: true });
      window.gsap.to(row, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.6,
        ease: 'power2.out',
        delay: baseDelay,
        overwrite: 'auto'
      });
    };

    // ── Initial state: hide all rows so first scroll-in feels fresh ───────────
    cinemaRows.forEach(row => {
      if (window.gsap) {
        window.gsap.set(row, { opacity: 0, x: -50, filter: 'none', overwrite: true });
      } else {
        row.style.opacity = '0';
      }
    });

    // Tracks rows that have already been animated — shared between observer and tab handler
    const revealedRows = new Set();

    // ── IntersectionObserver for cinema-rows (scroll-reveal per row) ──────────
    if ('IntersectionObserver' in window) {
      const cinemaObserverOptions = {
        root: null,
        threshold: 0.05,
        // 100px top margin: pre-trigger animation when scrolling UP
        // 40px bottom margin: pre-trigger animation when scrolling DOWN
        rootMargin: '100px 0px 40px 0px'
      };

      const cinemaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const row = entry.target;

          if (entry.isIntersecting) {
            // If the row is already in revealedRows from a tab switch, don't re-animate it 
            // on the very first slight scroll. But if it's genuinely entering the viewport
            // (we reset it when it leaves), we want to animate it.
            // Wait, we DO want to protect rows during tab switches. 
            if (revealedRows.has(row)) {
              // It's already revealed and visible. Leave it alone until it exits.
              return;
            }

            // Mark as revealed so a slight scroll doesn't re-trigger it
            revealedRows.add(row);

            if (activeTabFilter === 'art') {
              animateCinemaRowArt(row, 0, 0);
            } else if (activeTabFilter === 'film') {
              animateCinemaRowFilm(row, 0, 0);
            } else {
              const globalIndex = Array.from(cinemaRows).indexOf(row);
              animateCinemaRowAll(row, globalIndex, 0);
            }

          } else {
            // Row left the viewport (either scrolled past the top or bottom).
            // Reset it so it animates fresh next time it scrolls into view (up or down).
            revealedRows.delete(row);
            resetCinemaRow(row, activeTabFilter);
          }
        });
      }, cinemaObserverOptions);

      cinemaRows.forEach(row => cinemaObserver.observe(row));
    }

    // ── Tab click handler ─────────────────────────────────────────────────────
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateIndicator(btn);

        const previousFilter = activeTabFilter;          // what was showing before
        const filterValue = btn.getAttribute('data-filter');
        if (previousFilter === filterValue) return;      // same tab, nothing to do

        activeTabFilter = filterValue;
        revealedRows.clear();

        // ── Classify rows using previousFilter (not DOM state, which can be
        //    mid-animation and unreliable) ──────────────────────────────────────

        // Rows that should be visible in the NEW filter
        const rowsToShow = Array.from(cinemaRows).filter(row => {
          const cat = row.getAttribute('data-category');
          return filterValue === 'all' || cat === filterValue;
        });

        // Among those, which were ALREADY visible (matched the previous filter)
        // These must NOT be touched — no reset, no re-animation
        const rowsAlreadyVisible = rowsToShow.filter(row => {
          const cat = row.getAttribute('data-category');
          return previousFilter === 'all' || cat === previousFilter;
        });

        // Among those, which were HIDDEN (didn't match the previous filter)
        // These need to be revealed — observer will animate them
        const rowsToReveal = rowsToShow.filter(row => {
          const cat = row.getAttribute('data-category');
          return previousFilter !== 'all' && cat !== previousFilter;
        });

        // Rows that must leave the screen
        const rowsToHide = Array.from(cinemaRows).filter(row => {
          const cat = row.getAttribute('data-category');
          return filterValue !== 'all' && cat !== filterValue;
        });

        // 1. Protect already-visible rows — add to revealedRows so observer
        //    leaves them exactly as they are (fully visible, no flash)
        rowsAlreadyVisible.forEach(row => {
          revealedRows.add(row);
          // Ensure GSAP state is clean (opacity:1, no residual transforms)
          if (window.gsap) {
            window.gsap.killTweensOf(row);
            window.gsap.set(row, { opacity: 1, x: 0, filter: 'none', overwrite: true });
            const children = row.querySelectorAll('.cinema-title-block, .cinema-meta-block');
            if (children.length) window.gsap.set(children, { opacity: 1, y: 0, overwrite: true });
          }
        });

        // 2. Fade out and hide departing rows
        if (window.gsap && rowsToHide.length) {
          rowsToHide.forEach(row => {
            window.gsap.killTweensOf(row);
            window.gsap.to(row, {
              opacity: 0, duration: 0.25, ease: 'power2.in', overwrite: true,
              onComplete: () => { row.style.display = 'none'; }
            });
          });
        } else {
          rowsToHide.forEach(row => { row.style.display = 'none'; });
        }

        // 3. Make newly-arriving rows visible at opacity:0, then let the
        //    IntersectionObserver animate them — NO manual rAF loop needed.
        //    Observer fires naturally when display changes from none → grid.
        rowsToReveal.forEach(row => {
          if (window.gsap) {
            window.gsap.killTweensOf(row);
            // Set to hidden state appropriate for current filter's animation style
            const cat = row.getAttribute('data-category');
            if (filterValue === 'art' || (filterValue === 'all' && cat === 'art')) {
              window.gsap.set(row, { opacity: 0, filter: 'blur(6px)', x: 0, overwrite: true });
            } else {
              window.gsap.set(row, { opacity: 0, x: 0, filter: 'none', overwrite: true });
            }
          }
          row.style.display = 'grid'; // triggers IntersectionObserver
        });
      });
    });

    // Handle resize for indicator bar
    window.addEventListener('resize', () => {
      const currentActive = document.querySelector('.tab-btn.active');
      if (currentActive) updateIndicator(currentActive);
    });
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
