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
    if (d.edu1Year)  setText('edu1-year',  d.edu1Year);
    if (d.edu1Title) setText('edu1-title', d.edu1Title);
    if (d.edu1Desc)  setText('edu1-desc',  d.edu1Desc);
    if (d.edu2Year)  setText('edu2-year',  d.edu2Year);
    if (d.edu2Title) setText('edu2-title', d.edu2Title);
    if (d.edu2Desc)  setText('edu2-desc',  d.edu2Desc);
    if (d.cur1Year)  setText('cur1-year',  d.cur1Year);
    if (d.cur1Title) setText('cur1-title', d.cur1Title);
    if (d.cur1Desc)  setText('cur1-desc',  d.cur1Desc);
  }

  function applyContact(d) {
    if (d.intro) setText('contact-intro', d.intro);
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
        <a class="film-item" href="films/${slug}.html">
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
    // Register new film items with the scroll-reveal observer
    const newItems = container.querySelectorAll('.film-item');
    if (window.__observeNew) window.__observeNew(newItems);
    else newItems.forEach(el => el.classList.add('revealed'));
  }

  function renderCinematography(entries) {
    const filmList = document.getElementById('cms-cine-film-list');
    const artList  = document.getElementById('cms-cine-art-list');
    if (!filmList && !artList) return;
    const filmEntries = entries.filter(e => e.category === 'film');
    const artEntries  = entries.filter(e => e.category === 'art');
    if (filmList && filmEntries.length) {
      filmList.innerHTML = filmEntries.map(e => `
        <div class="cinema-row" data-category="film">
          <div class="cinema-title-block">
            <h4>${e.title}</h4>
            <div class="cinema-director">${e.director || ''}</div>
          </div>
          <div class="cinema-meta-block">${e.role || 'Cinematographer'}</div>
        </div>`).join('');
    }
    if (artList && artEntries.length) {
      artList.innerHTML = artEntries.map(e => `
        <div class="cinema-row" data-category="art">
          <div class="cinema-title-block">
            <h4>${e.title}</h4>
            <div class="cinema-director">${e.director || ''}</div>
          </div>
          <div class="cinema-meta-block">${e.role || 'Visual Art'}</div>
        </div>`).join('');
    }
    // re-trigger tab filters if main.js already ran
    if (window.__tabsInit) window.__tabsInit();
  }

  function renderWriting(entries) {
    const container = document.getElementById('cms-writing-list');
    if (!container || !entries.length) return;
    container.innerHTML = entries.map(e => `
      <article class="writing-card reveal-element">
        <div class="writing-card-meta">
          <span>${e.publisher || ''}</span>
          <span>${e.year || ''}</span>
        </div>
        <div class="writing-card-content">
          <h2 class="writing-card-title">
            <a href="${e.link || '#'}">${e.title || ''}</a>
          </h2>
          <p class="writing-card-desc">${e.desc || ''}</p>
          <a href="${e.link || '#'}" class="writing-card-link">
            <span>Request Access</span>
            <i data-lucide="arrow-up-right" style="width:14px;height:14px;"></i>
          </a>
        </div>
      </article>`).join('');
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
      Promise.all([
        db.collection('content').doc('director').get(),
        db.collection('films').orderBy('order').get()
      ]).then(([contentDoc, snapshot]) => {
        if (contentDoc.exists && contentDoc.data().intro) setText('director-intro', contentDoc.data().intro);
        if (!snapshot.empty) {
          const films = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          renderFilms(films);
        }
      }).catch(() => {});
    } else if (page === 'cinematographer') {
      Promise.all([
        db.collection('content').doc('cinematographer').get(),
        db.collection('cinematography').orderBy('order').get()
      ]).then(([contentDoc, snapshot]) => {
        if (contentDoc.exists && contentDoc.data().intro) setText('cine-intro', contentDoc.data().intro);
        if (!snapshot.empty) {
          const entries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          renderCinematography(entries);
        }
      }).catch(() => {});
    } else if (page === 'writing') {
      Promise.all([
        db.collection('content').doc('writing').get(),
        db.collection('writing').orderBy('order').get()
      ]).then(([contentDoc, snapshot]) => {
        if (contentDoc.exists && contentDoc.data().intro) setText('writing-intro', contentDoc.data().intro);
        if (!snapshot.empty) {
          const entries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          renderWriting(entries);
        }
      }).catch(() => {});
    }
  }

  // Load Firebase compat SDK then run
  loadScript(FIREBASE_CDN + 'firebase-app-compat.js', function () {
    loadScript(FIREBASE_CDN + 'firebase-firestore-compat.js', init);
  });
})();
