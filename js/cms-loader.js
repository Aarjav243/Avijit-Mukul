// CMS Loader — reads content from Firestore and updates the page.
// Falls back silently to hardcoded HTML if Firebase is unavailable.
(function () {
  const FIREBASE_CDN = 'https://www.gstatic.com/firebasejs/10.7.0/';

  function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function detectPage() {
    const p = window.location.pathname;
    if (p.includes('about')) return 'about';
    if (p.includes('contact')) return 'contact';
    if (p.includes('director')) return 'director';
    if (p.includes('cinematographer')) return 'cinematographer';
    if (p.includes('writing')) return 'writing';
    return 'homepage';
  }

  function setText(field, val) {
    document.querySelectorAll('[data-cms="' + field + '"]').forEach(el => {
      el.textContent = val;
    });
  }

  function setHtml(field, val) {
    document.querySelectorAll('[data-cms="' + field + '"]').forEach(el => {
      el.innerHTML = val;
    });
  }

  function setSrc(field, val) {
    document.querySelectorAll('[data-cms-src="' + field + '"]').forEach(el => {
      el.src = val;
    });
  }

  function applyHomepage(d) {
    if (d.heroRole) setText('hero-role', d.heroRole);
    if (d.heroDesc) setText('hero-desc', d.heroDesc);
    if (d.statement) setText('statement', d.statement);
    if (d.stat1) setText('stat-1', d.stat1);
    if (d.stat2) setText('stat-2', d.stat2);
    if (d.stat3) setText('stat-3', d.stat3);
  }

  function applyAbout(d) {
    if (d.bio1) setText('bio-1', d.bio1);
    if (d.bio2) setText('bio-2', d.bio2);
    if (d.bio3) setText('bio-3', d.bio3);
  }

  function applyContact(d) {
    if (d.address) setHtml('contact-address', d.address.replace(/\n/g, '<br>'));
    if (d.phone) {
      document.querySelectorAll('[data-cms="contact-phone"]').forEach(el => {
        el.textContent = d.phone;
        el.href = 'tel:' + d.phone.replace(/[\s-]/g, '');
      });
    }
    if (d.email) {
      document.querySelectorAll('[data-cms="contact-email"]').forEach(el => {
        el.textContent = d.email;
        el.href = 'mailto:' + d.email;
      });
    }
    if (d.professional) setText('contact-professional', d.professional);
  }

  function renderFilms(films) {
    const container = document.getElementById('cms-films-list');
    if (!container) return;
    container.innerHTML = '';
    films.forEach(film => {
      const slug = film.id;
      container.innerHTML += `
        <a class="film-item reveal-element" href="films/${slug}.html">
          <div class="film-showcase-visual">
            <img src="${film.thumbnail || ''}" alt="${film.title} still" />
          </div>
          <div class="film-showcase-info">
            <h2 class="film-showcase-title">${film.title}</h2>
            <div class="film-showcase-meta">
              ${film.year ? `<span>${film.year}</span>` : ''}
              ${film.duration ? `<span>${film.duration}</span>` : ''}
              ${film.format ? `<span>${film.format}</span>` : ''}
              ${film.language ? `<span>${film.language}</span>` : ''}
            </div>
            <p class="film-showcase-desc">${film.desc || ''}</p>
            ${film.venues ? `<div class="film-showcase-venues"><span class="venues-title">Screenings</span><span class="venues-list">${film.venues}</span></div>` : ''}
          </div>
        </a>`;
    });
    // Re-init lucide icons if present
    if (window.lucide) lucide.createIcons();
  }

  function init() {
    if (!window.firebase) return;
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const page = detectPage();

    if (page === 'homepage') {
      db.collection('content').doc('homepage').get()
        .then(doc => { if (doc.exists) applyHomepage(doc.data()); })
        .catch(() => {});
    } else if (page === 'about') {
      db.collection('content').doc('about').get()
        .then(doc => { if (doc.exists) applyAbout(doc.data()); })
        .catch(() => {});
    } else if (page === 'contact') {
      db.collection('content').doc('contact').get()
        .then(doc => { if (doc.exists) applyContact(doc.data()); })
        .catch(() => {});
    } else if (page === 'director') {
      db.collection('films').orderBy('order').get()
        .then(snapshot => {
          if (!snapshot.empty) {
            const films = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            renderFilms(films);
          }
        })
        .catch(() => {});
    }
  }

  // Load Firebase compat SDK then run
  loadScript(FIREBASE_CDN + 'firebase-app-compat.js', function () {
    loadScript(FIREBASE_CDN + 'firebase-firestore-compat.js', init);
  });
})();
