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

  // 3. INTERSECTION OBSERVER FOR SCROLL REVEALS
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
          
          // GSAP alternate support if loaded
          if (window.gsap) {
            window.gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out"
            });
          }
          
          observer.unobserve(entry.target);
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
    });
  }

  // 4. TAB FILTERING SYSTEM (cinematographer.html)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const cinemaRows = document.querySelectorAll('.cinema-row');
  const tabIndicator = document.querySelector('.tab-indicator-bar');

  if (tabButtons.length > 0 && cinemaRows.length > 0) {
    // Function to update the bar size and position dynamically
    const updateIndicator = (activeBtn) => {
      if (tabIndicator) {
        tabIndicator.style.left = `${activeBtn.offsetLeft}px`;
        tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
      }
    };

    // Initialize position for the active tab on load
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      // Small timeout to ensure offsets are fully computed by browser
      setTimeout(() => updateIndicator(activeTab), 100);
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active states
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update bar location
        updateIndicator(btn);
        
        const filterValue = btn.getAttribute('data-filter');
        
        cinemaRows.forEach(row => {
          const category = row.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            row.style.display = 'grid';
            // Trigger quick entry animation with power4 decelleration
            if (window.gsap) {
              window.gsap.fromTo(row, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power4.out" });
            } else {
              row.style.opacity = '1';
            }
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    // Handle recalculation on resize so bar doesn't break alignment
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
