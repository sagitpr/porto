/**
 * AI LABORATORY & SOFTWARE ENGINEERING PORTFOLIO ENGINE
 * SAGIT FATURRAKHMAN — 2026
 * 
 * Preserves the exact design & structure of sagitfaturakhman.id
 * Enhanced with:
 * 1. Supabase Cloud + Local Storage auto-sync
 * 2. 65 Calm particle dots + 3D transparent undulating wave grid
 * 3. Strict separation of Certificates (#cert-list) and Visual Gallery (#gallery-list)
 * 4. 100% Full aspect-ratio Lightbox modal for certificates & screenshots
 */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ============================================================
     1. THREE.JS 3D LABORATORY (CALM 65 PARTICLES + UNDULATING WAVE GRID)
     ============================================================ */
  function initThreeLabCanvas() {
    const canvas = $('#lab-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 32;

    const labGroup = new THREE.Group();
    scene.add(labGroup);

    // 1. Geodesic Holographic Wireframe Outer Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(8.5, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    labGroup.add(sphere);

    // 2. Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    labGroup.add(innerCore);

    // 3. Holographic Orbiting Telemetry Rings (Layered Speeds)
    const ring1Geo = new THREE.RingGeometry(11, 11.08, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    labGroup.add(ring1);

    // Complementary Second Telemetry Ring for Spatial Depth
    const ring2Geo = new THREE.RingGeometry(13.2, 13.28, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    labGroup.add(ring2);

    // 4. Undulating Transparent 3D Wave Grid (Animasi Ombak Transparan)
    const waveGeo = new THREE.PlaneGeometry(80, 80, 26, 26);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = -Math.PI / 2.3;
    waveMesh.position.y = -11;
    labGroup.add(waveMesh);

    // 5. Reduced Particle Field (65 Calm Dots - Tidak Padat Bintik)
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 65;
      particlePositions[i + 1] = (Math.random() - 0.5) * 65;
      particlePositions[i + 2] = (Math.random() - 0.5) * 45;

      particleSpeeds[i] = (Math.random() - 0.5) * 0.008;
      particleSpeeds[i + 1] = (Math.random() - 0.5) * 0.008;
      particleSpeeds[i + 2] = (Math.random() - 0.5) * 0.008;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.5,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax (Damped)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      const pixelRatioLimit = window.innerWidth < 768 ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioLimit));
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    let clock = 0;
    let lastScrollY = window.scrollY || window.pageYOffset;
    let scrollVelocity = 0;

    function animate() {
      requestAnimationFrame(animate);

      const scrollY = window.scrollY || window.pageYOffset;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? scrollY / totalHeight : 0;

      // Track scroll velocity for realistic momentum
      const deltaY = scrollY - lastScrollY;
      lastScrollY = scrollY;
      scrollVelocity += (deltaY - scrollVelocity) * 0.18;

      if (!prefersReducedMotion) {
        clock += 0.015;

        // Level 1: Global Motion (Continuous multi-speed rotation)
        sphere.rotation.x += 0.0006;
        sphere.rotation.y += 0.001;
        innerCore.rotation.x -= 0.0009;
        innerCore.rotation.y -= 0.0012;

        // AI Core Breathing Scale Pulse
        const coreScale = 1.0 + Math.sin(clock * 1.5) * 0.03;
        innerCore.scale.set(coreScale, coreScale, coreScale);

        // Orbiting rings with differential speeds
        ring1.rotation.z += 0.0012;
        ring2.rotation.z -= 0.0009;
        ring2.rotation.x = -Math.PI / 4 + Math.sin(clock * 0.4) * 0.06;

        // Gentle undulating wave animation on the grid
        const posAttr = waveGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const v = posAttr.getY(i);
          const z = Math.sin(u * 0.18 + clock * 0.8) * Math.cos(v * 0.18 + clock * 0.6) * 1.4;
          posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;

        // Slow calm particle drifting
        const positions = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += particleSpeeds[i];
          positions[i + 1] += particleSpeeds[i + 1];
          positions[i + 2] += particleSpeeds[i + 2];

          if (positions[i] > 32) positions[i] = -32;
          if (positions[i] < -32) positions[i] = 32;
          if (positions[i + 1] > 32) positions[i + 1] = -32;
          if (positions[i + 1] < -32) positions[i + 1] = 32;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Level 2: Velocity-aware depth momentum & subtle camera breathing
      const velocityMomentum = Math.max(-2.2, Math.min(2.2, scrollVelocity * 0.016));
      const breathX = !prefersReducedMotion ? Math.sin(clock * 0.35) * 0.25 : 0;
      const breathY = !prefersReducedMotion ? Math.cos(clock * 0.28) * 0.18 : 0;

      const targetZ = 32 - progress * 9.5 - velocityMomentum;
      const targetY = (progress * -3.5) + breathY;
      const targetX = breathX;
      const targetRotationY = progress * Math.PI * 1.15 + mouseX * 0.12;
      const targetRotationX = mouseY * 0.07;

      labGroup.rotation.y += (targetRotationY - labGroup.rotation.y) * 0.05;
      labGroup.rotation.x += (targetRotationX - labGroup.rotation.x) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.055;
      camera.position.y += (targetY - camera.position.y) * 0.055;
      camera.position.x += (targetX - camera.position.x) * 0.055;

      renderer.render(scene, camera);
    }
    animate();
  }

  /* ============================================================
     2. CHAPTER SCROLL SPY & RAIL TRACKING
     ============================================================ */
  function initScrollSpy() {
    const chapters = $$('.chapter-section');
    const railItems = $$('.rail-item');
    const navLinks = $$('.nav-link');
    const progressBar = $('#rail-progress');

    function updateActiveChapter() {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const totalScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;

      if (progressBar) {
        progressBar.style.height = `${Math.min(100, Math.max(10, scrollPercent))}%`;
      }

      let activeId = 'hero';

      chapters.forEach((chapter) => {
        const top = chapter.offsetTop;
        const height = chapter.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          activeId = chapter.id;
        }
      });

      railItems.forEach((item) => {
        const target = item.getAttribute('data-rail');
        item.classList.toggle('active', target === activeId);
      });

      navLinks.forEach((link) => {
        const target = link.getAttribute('data-chapter');
        link.classList.toggle('active', target === activeId);
      });
    }

    window.addEventListener('scroll', updateActiveChapter, { passive: true });
    updateActiveChapter();
  }

  /* ============================================================
     3. GITHUB CONTRIBUTION HEATMAP MATRIX
     ============================================================ */
  function initGithubHeatmap() {
    const grid = $('#github-heatmap-grid');
    if (!grid) return;

    grid.innerHTML = '';
    for (let c = 0; c < 52; c++) {
      const col = document.createElement('div');
      col.className = 'gh-heatmap-col';

      for (let r = 0; r < 7; r++) {
        const cell = document.createElement('div');
        const rand = Math.random();
        let lvl = 0;
        if (rand > 0.85) lvl = 4;
        else if (rand > 0.65) lvl = 3;
        else if (rand > 0.42) lvl = 2;
        else if (rand > 0.22) lvl = 1;

        cell.className = `gh-cell lvl-${lvl}`;
        col.appendChild(cell);
      }
      grid.appendChild(col);
    }
  }

  /* ============================================================
     4. DATA RENDERING (PROJECTS, SEPARATE CERTIFICATES & GALLERY)
     ============================================================ */
  const VAULT_STORE_KEY = 'sagit.portfolio.vault.v5';
  const vaultDefaults = { projects: [], docs: [] };

  function readVault() {
    try {
      return { ...vaultDefaults, ...JSON.parse(localStorage.getItem(VAULT_STORE_KEY) || '{}') };
    } catch {
      return { ...vaultDefaults };
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
    }[char]));
  }

  async function renderPortfolioData() {
    let cloudData = null;
    if (window.SupabaseCMS) {
      cloudData = await window.SupabaseCMS.fetchAllFromCloud();
    } else {
      cloudData = readVault();
    }

    const projects = (cloudData && cloudData.projects) ? cloudData.projects : [];
    const certificates = (cloudData && cloudData.certificates) ? cloudData.certificates : [];
    const gallery = (cloudData && cloudData.gallery) ? cloudData.gallery : [];
    const activities = (cloudData && cloudData.activities) ? cloudData.activities : [];

    // 1. Render Projects
    const projectList = $('#project-list');
    const projectEmptyState = $('#project-empty-state');

    if (projectList) {
      if (projects.length === 0) {
        if (projectEmptyState) {
          projectEmptyState.style.display = 'block';
          projectList.innerHTML = '';
          projectList.appendChild(projectEmptyState);
        }
      } else {
        if (projectEmptyState) projectEmptyState.style.display = 'none';
        projectList.innerHTML = '';

        projects.forEach((item, index) => {
          const card = document.createElement('article');
          card.className = 'project-master-card double-bezel';
          card.dataset.vaultDynamic = 'true';
          const title = item.title || item.main_title || 'PROJECT';
          const cover = item.cover_image || item.image_url || item.image || '';
          const live = item.live_url || item.project_url || item.url || '';

          card.innerHTML = `
            <div class="bezel-inner">
              <div class="project-top-row">
                <div class="project-category-pills">
                  <span class="badge-index">0${index + 1}</span>
                  <span class="proj-badge">${escapeHtml(item.category || 'PROJECT')}</span>
                </div>
                <span class="proj-status-live">${escapeHtml(item.status || 'PUBLISHED')}</span>
              </div>
              <div class="project-body-grid">
                <div class="project-details">
                  <h3 class="proj-name">${escapeHtml(title)}</h3>
                  ${item.subtitle ? `<h4 class="proj-subtitle">${escapeHtml(item.subtitle)}</h4>` : ''}
                  <p class="proj-description">${escapeHtml(item.description || '')}</p>
                  
                  ${item.problem ? `
                    <div class="proj-problem-solution" style="display:grid;gap:8px;margin:12px 0;">
                      <div class="meta-block"><strong>PROBLEM STATEMENT</strong><p>${escapeHtml(item.problem)}</p></div>
                      <div class="meta-block"><strong>ENGINEERING SOLUTION</strong><p>${escapeHtml(item.solution)}</p></div>
                    </div>
                  ` : ''}

                  <div class="proj-meta-section">
                    ${(item.technologies || item.stack) ? `<div class="meta-block"><strong>TECH STACK</strong><p>${escapeHtml(item.technologies || item.stack)}</p></div>` : ''}
                    ${(item.ai_features || item.ai) ? `<div class="meta-block"><strong>AI CAPABILITIES</strong><p>${escapeHtml(item.ai_features || item.ai)}</p></div>` : ''}
                    ${item.role ? `<div class="meta-block"><strong>MY ROLE</strong><p>${escapeHtml(item.role)}</p></div>` : ''}
                  </div>

                  <div class="project-action-row" style="display:flex;gap:10px;margin-top:16px;">
                    ${live ? `
                      <a class="btn-clean primary" href="${escapeHtml(live)}" target="_blank" rel="noreferrer">
                        <span>LIVE PROJECT</span>
                        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    ` : ''}
                    <a class="btn-clean secondary" href="#documentation">
                      <span>DOCUMENTATION →</span>
                    </a>
                  </div>
                </div>

                <div class="project-screen-mockup">
                  <div class="mockup-window-bar">
                    <span class="mock-dot red"></span>
                    <span class="mock-dot yellow"></span>
                    <span class="mock-dot green"></span>
                    <span class="mock-url">${escapeHtml((item.slug || title).toLowerCase().replace(/\s+/g, '-'))}.dev</span>
                  </div>
                  <div class="mockup-screen-inner" style="padding:12px;background:#01060b;display:flex;align-items:center;justify-content:center;">
                    ${cover ? `
                      <img src="${cover}" alt="${escapeHtml(title)}" style="max-height:280px;width:auto;max-width:100%;object-fit:contain;display:block;">
                    ` : `
                      <div class="mockup-hero-banner" style="padding:32px 16px;text-align:center;">
                        <span class="banner-badge">${escapeHtml(item.category || 'PROJECT')}</span>
                        <h4 style="color:#fff;font-size:1.3rem;margin:8px 0;">${escapeHtml(title)}</h4>
                        <small style="color:var(--cyan-light);">${escapeHtml(item.subtitle || '')}</small>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          `;
          projectList.appendChild(card);
        });
      }
    }

    // 2. Render Certificates (#cert-list)
    const certList = $('#cert-list');
    const docEmptyState = $('#doc-empty-state');

    if (certList) {
      if (certificates.length === 0) {
        if (docEmptyState) {
          docEmptyState.style.display = 'block';
          certList.innerHTML = '';
          certList.appendChild(docEmptyState);
        }
      } else {
        if (docEmptyState) docEmptyState.style.display = 'none';
        certList.innerHTML = '';

        certificates.forEach((item) => {
          const card = document.createElement('article');
          card.className = 'doc-entry-card double-bezel';
          card.dataset.category = (item.category || 'certificates').toLowerCase();
          
          const imgUrl = item.image_url || item.image || '';

          card.innerHTML = `
            <div class="bezel-inner">
              <div class="doc-badge-preview">
                ${imgUrl ? `<img src="${imgUrl}" alt="${escapeHtml(item.title)}" class="doc-thumb">` : '<span style="font-weight:bold;color:var(--cyan-core);font-family:var(--font-mono);font-size:0.75rem;">VERIFIED CREDENTIAL</span>'}
                <span class="doc-type-tag">${escapeHtml((item.category || 'CERTIFICATE').toUpperCase())}</span>
              </div>
              <div class="doc-info">
                <h3 class="doc-title">${escapeHtml(item.title)}</h3>
                ${(item.issuer || item.organization) ? `<span class="doc-issuer">${escapeHtml(item.issuer || item.organization)}</span>` : ''}
                <p class="doc-summary">${escapeHtml(item.description || '')}</p>
                <div class="doc-footer-meta">
                  <span class="doc-date">${escapeHtml(item.issued_date || item.date || '2024')}</span>
                  <button type="button" class="btn-open-lightbox doc-link-arrow" style="background:none;border:none;cursor:pointer;color:var(--cyan-light);">
                    VIEW FULL DOCUMENT →
                  </button>
                </div>
              </div>
            </div>
          `;

          card.querySelector('.btn-open-lightbox')?.addEventListener('click', () => {
            openLightbox({
              title: item.title,
              issuer: item.issuer || item.organization || '',
              category: item.category || 'CERTIFICATE',
              image: imgUrl,
              description: item.description || '',
              url: item.credential_url || item.url || ''
            });
          });

          certList.appendChild(card);
        });
      }
    }

    // 3. Render Activities & Documentation Hub (#gallery-list)
    const galleryList = $('#gallery-list');
    const activitiesItems = [...(gallery || []), ...(activities || [])];
    if (galleryList) {
      if (activitiesItems.length === 0) {
        galleryList.innerHTML = `
          <div class="empty-vault-state double-bezel" style="grid-column: 1 / -1; width: 100%; text-align: center;">
            <div class="bezel-inner" style="padding: 40px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
              <div class="empty-state-icon" style="width: 48px; height: 48px; border-radius: 10px; background: rgba(6, 22, 38, 0.8); border: 1px solid var(--border-line); display: grid; place-items: center; color: var(--cyan-core); margin-bottom: 6px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <h3 style="color: #fff; font-size: 1.1rem; letter-spacing: 0.06em;">NO ACTIVITY DOCUMENTATION YET</h3>
              <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 48ch;">Activities, workshops, and event photo documentation uploaded via the Admin CMS will appear here.</p>
            </div>
          </div>
        `;
      } else {
        galleryList.innerHTML = '';
        activitiesItems.forEach((item) => {
          const card = document.createElement('div');
          card.className = 'gallery-card double-bezel';
          const imgUrl = item.image_url || item.image || '';
          card.innerHTML = `
            <div class="bezel-inner">
              <div class="gallery-img-box">
                ${imgUrl ? `<img src="${imgUrl}" alt="${escapeHtml(item.title)}">` : '<div style="color:var(--cyan-light);font-family:var(--font-mono);font-size:0.75rem;">ACTIVITY RECORD</div>'}
              </div>
              <div style="margin-top:8px;">
                <span class="hud-badge" style="display:inline-block;margin-bottom:4px;font-size:0.6rem;color:var(--cyan-core);background:rgba(56,189,248,0.1);padding:2px 6px;border-radius:3px;">${escapeHtml(item.category || 'WORKSHOP')}</span>
                <h4 class="gallery-card-title">${escapeHtml(item.title)}</h4>
                ${item.organization ? `<small style="color:var(--cyan-light);display:block;margin-bottom:6px;font-size:0.75rem;">${escapeHtml(item.organization)}</small>` : ''}
                <p class="gallery-card-desc">${escapeHtml(item.description || '')}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                  <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-dim);">${escapeHtml(item.date || '')}</span>
                  ${imgUrl ? `<button type="button" class="btn-gal-zoom doc-link-arrow" style="background:none;border:none;cursor:pointer;color:var(--cyan-light);font-size:0.75rem;">VIEW PHOTO →</button>` : ''}
                </div>
              </div>
            </div>
          `;

          card.querySelector('.btn-gal-zoom')?.addEventListener('click', () => {
            openLightbox({
              title: item.title,
              issuer: item.organization || 'DOCUMENTATION',
              category: item.category || 'ACTIVITY & WORKSHOP',
              image: imgUrl,
              description: item.description || '',
              url: ''
            });
          });

          galleryList.appendChild(card);
        });
      }
    }
  }

  /* ============================================================
     5. LIGHTBOX MODAL (100% ASPECT RATIO PRESERVATION)
     ============================================================ */
  function openLightbox(data) {
    const modal = $('#cert-lightbox-modal');
    if (!modal) return;

    $('#lb-cat').textContent = data.category || 'VERIFIED CREDENTIAL';
    $('#lb-title').textContent = data.title || '';
    $('#lb-issuer').textContent = data.issuer || '';
    $('#lb-desc').textContent = data.description || '';

    const img = $('#lb-img');
    if (data.image) {
      img.src = data.image;
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }

    const verifyLink = $('#lb-verify-link');
    if (data.url) {
      verifyLink.href = data.url;
      verifyLink.style.display = 'inline-flex';
    } else {
      verifyLink.style.display = 'none';
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    const modal = $('#cert-lightbox-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  function initLightboxEvents() {
    $('#btn-close-lightbox')?.addEventListener('click', closeLightbox);
    $('#cert-lightbox-close-backdrop')?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ============================================================
     6. CERTIFICATE FILTER TABS
     ============================================================ */
  function initDocTabs() {
    const tabs = $$('.doc-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        const docCards = $$('#cert-list .doc-entry-card');

        docCards.forEach((card) => {
          const category = (card.getAttribute('data-category') || '').toLowerCase();
          if (filter === 'all') {
            card.style.display = 'block';
          } else if (filter === 'certificates' && (category.includes('cert') || category.includes('found'))) {
            card.style.display = 'block';
          } else if (filter === 'training' && (category.includes('train') || category.includes('work') || category.includes('activ'))) {
            card.style.display = 'block';
          } else if (filter === 'academic' && (category.includes('acad') || category.includes('s1'))) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     7. SCROLL TO TOP
     ============================================================ */
  function initBackToTop() {
    const btn = $('#back-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     8. CONTENT VAULT MODAL (SYNCED DIRECTLY TO SUPABASE CMS)
     ============================================================ */
  function initVaultModal() {
    const adminModal = $('#secret-admin');
    if (!adminModal) return;

    function openVault(targetTab = 'project') {
      adminModal.classList.add('active');
      adminModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      $$('.secret-tab').forEach((t) => {
        t.classList.toggle('active', t.getAttribute('data-secret-tab') === targetTab);
      });
      $$('.secret-form').forEach((f) => {
        const id = f.id;
        if (targetTab === 'project' && id.includes('project')) f.classList.add('active');
        else if (targetTab === 'doc' && id.includes('doc')) f.classList.add('active');
        else if (targetTab === 'backup' && id.includes('backup')) f.classList.add('active');
        else f.classList.remove('active');
      });
    }

    function closeVault() {
      adminModal.classList.remove('active');
      adminModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    $$('[data-secret-close]').forEach((btn) => btn.addEventListener('click', closeVault));
    $$('.open-vault-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openVault(btn.getAttribute('data-vault-target') || 'project');
      });
    });

    // Form 1: Save Project directly to Supabase
    $('#secret-project-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        let imageUrl = '';
        const fileInput = form.querySelector('input[name="image"]');
        if (fileInput && fileInput.files[0] && window.SupabaseCMS) {
          imageUrl = await window.SupabaseCMS.uploadStorageFile(fileInput.files[0], 'projects');
        }

        if (window.SupabaseCMS) {
          await window.SupabaseCMS.saveProject({
            title: fd.get('title'),
            main_title: fd.get('title'),
            subtitle: fd.get('subtitle') || '',
            category: fd.get('category') || 'PROJECT',
            stack: fd.get('stack') || '',
            technologies: fd.get('stack') || '',
            ai: fd.get('ai') || '',
            ai_features: fd.get('ai') || '',
            role: fd.get('role') || '',
            description: fd.get('description') || '',
            url: fd.get('url') || '',
            live_url: fd.get('url') || '',
            cover_image: imageUrl,
            image_url: imageUrl,
            status: 'PUBLISHED'
          });
        }

        alert('Project successfully saved and published!');
        form.reset();
        closeVault();
        await renderPortfolioData();
      } catch (err) {
        alert('Save error: ' + err.message);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    // Form 2: Save Doc / Certificate / Gallery directly to Supabase
    $('#secret-doc-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        let imageUrl = '';
        const fileInput = form.querySelector('input[name="image"]');
        const category = fd.get('category') || 'certificates';

        if (fileInput && fileInput.files[0] && window.SupabaseCMS) {
          imageUrl = await window.SupabaseCMS.uploadStorageFile(fileInput.files[0], category);
        }

        if (window.SupabaseCMS) {
          if (category === 'gallery') {
            await window.SupabaseCMS.saveGalleryItem({
              id: 'gal_' + Date.now(),
              title: fd.get('title'),
              category: 'GALLERY',
              description: fd.get('description') || '',
              date: fd.get('date') || '2025',
              image_url: imageUrl
            });
          } else {
            await window.SupabaseCMS.saveCertificate({
              id: 'cert_' + Date.now(),
              title: fd.get('title'),
              issuer: fd.get('issuer') || '',
              category: category.toUpperCase(),
              issued_date: fd.get('date') || '2024',
              description: fd.get('description') || '',
              credential_url: fd.get('url') || '',
              image_url: imageUrl
            });
          }
        }

        alert('Archive entry successfully saved and published!');
        form.reset();
        closeVault();
        await renderPortfolioData();
      } catch (err) {
        alert('Save error: ' + err.message);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    // Keyboard trigger "SAGITADMIN"
    let buffer = '';
    window.addEventListener('keydown', (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;
      if (e.key === 'Escape') closeVault();

      if (e.key && e.key.length === 1) {
        buffer = (buffer + e.key.toUpperCase()).slice(-10);
        if (buffer === 'SAGITADMIN') {
          openVault('project');
          buffer = '';
        }
      }
    });
  }

  /* ============================================================
     MICRO-INTERACTIONS & MOTION REFINEMENTS
     ============================================================ */

  /**
   * Subtle 3D Card Tilt + Radial Specular Glow on desktop only (max ±2.2 deg)
   * Uses event delegation to seamlessly support dynamic Supabase cards.
   */
  function initCardTiltInteractions() {
    const isTouchOrSmall = () =>
      window.matchMedia('(hover: none)').matches || window.innerWidth <= 768;

    let activeCard = null;

    const resetTilt = (card) => {
      if (!card) return;
      card.style.transform = '';
      card.style.removeProperty('--glow-x');
      card.style.removeProperty('--glow-y');
    };

    document.addEventListener('pointermove', (e) => {
      if (isTouchOrSmall()) {
        if (activeCard) {
          resetTilt(activeCard);
          activeCard = null;
        }
        return;
      }

      const card = e.target.closest('.double-bezel');
      if (!card) {
        if (activeCard) {
          resetTilt(activeCard);
          activeCard = null;
        }
        return;
      }

      if (activeCard && activeCard !== card) {
        resetTilt(activeCard);
      }
      activeCard = card;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = ((x / rect.width) * 100).toFixed(1);
      const py = ((y / rect.height) * 100).toFixed(1);

      // Subtle, refined tilt: max ±2.2 degrees
      const rotX = (((y / rect.height) - 0.5) * -4.4).toFixed(2);
      const rotY = (((x / rect.width) - 0.5) * 4.4).toFixed(2);

      card.style.setProperty('--glow-x', `${px}%`);
      card.style.setProperty('--glow-y', `${py}%`);
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      if (activeCard) {
        resetTilt(activeCard);
        activeCard = null;
      }
    });
  }

  /**
   * Chapter 04 — Architecture Flow Sequential Pulse
   */
  function initSequentialArchitecture() {
    const section = document.getElementById('engineering');
    if (!section) return;

    const nodes = section.querySelectorAll('.arch-node');
    const arrows = section.querySelectorAll('.arch-arrow');
    if (!nodes.length) return;

    let activeIndex = -1;
    let timer = null;

    const cycle = () => {
      nodes.forEach((n) => n.classList.remove('node-active'));
      arrows.forEach((a) => a.classList.remove('arrow-pulse'));

      activeIndex = (activeIndex + 1) % (nodes.length + 1);

      if (activeIndex < nodes.length) {
        nodes[activeIndex]?.classList.add('node-active');
        if (activeIndex > 0 && arrows[activeIndex - 1]) {
          arrows[activeIndex - 1].classList.add('arrow-pulse');
        }
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!timer) {
            cycle();
            timer = setInterval(cycle, 1800);
          }
        } else {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          nodes.forEach((n) => n.classList.remove('node-active'));
          arrows.forEach((a) => a.classList.remove('arrow-pulse'));
          activeIndex = -1;
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /**
   * Chapter 05 — AI Pipeline Traveling Pulse
   */
  function initAIPipelinePulse() {
    const section = document.getElementById('ai');
    if (!section) return;

    const cards = section.querySelectorAll('.pipeline-card');
    const arrows = section.querySelectorAll('.pipe-arrow');
    if (!cards.length) return;

    let activeIndex = -1;
    let timer = null;

    const cycle = () => {
      cards.forEach((c) => c.classList.remove('pipe-active'));
      arrows.forEach((a) => a.classList.remove('arrow-pulse'));

      activeIndex = (activeIndex + 1) % (cards.length + 1);

      if (activeIndex < cards.length) {
        cards[activeIndex]?.classList.add('pipe-active');
        if (activeIndex > 0 && arrows[activeIndex - 1]) {
          arrows[activeIndex - 1].classList.add('arrow-pulse');
        }
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!timer) {
            cycle();
            timer = setInterval(cycle, 2000);
          }
        } else {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          cards.forEach((c) => c.classList.remove('pipe-active'));
          arrows.forEach((a) => a.classList.remove('arrow-pulse'));
          activeIndex = -1;
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /**
   * Chapter 06 — Data Pipeline Packet Step Pulse
   */
  function initDataPipelinePulse() {
    const section = document.getElementById('data');
    if (!section) return;

    const steps = section.querySelectorAll('.data-step-box');
    if (!steps.length) return;

    let activeIndex = -1;
    let timer = null;

    const cycle = () => {
      steps.forEach((s) => s.classList.remove('data-active'));
      activeIndex = (activeIndex + 1) % (steps.length + 1);

      if (activeIndex < steps.length) {
        steps[activeIndex]?.classList.add('data-active');
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!timer) {
            cycle();
            timer = setInterval(cycle, 1800);
          }
        } else {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          steps.forEach((s) => s.classList.remove('data-active'));
          activeIndex = -1;
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  document.addEventListener('DOMContentLoaded', async () => {
    initThreeLabCanvas();
    initScrollSpy();
    initGithubHeatmap();
    initLightboxEvents();
    initDocTabs();
    initBackToTop();
    initVaultModal();
    initCardTiltInteractions();
    initSequentialArchitecture();
    initAIPipelinePulse();
    initDataPipelinePulse();

    // 1. Initial portfolio data render
    await renderPortfolioData();

    // 2. Supabase Realtime Subscription for live multi-tab & remote sync
    if (window.SupabaseCMS && typeof window.SupabaseCMS.subscribeToRealtime === 'function') {
      window.SupabaseCMS.subscribeToRealtime({
        onActivitiesChange: async (payload) => {
          console.log('[Portfolio Realtime] Activities changed remotely:', payload);
          await renderPortfolioData();
        },
        onProjectsChange: async (payload) => {
          console.log('[Portfolio Realtime] Projects changed remotely:', payload);
          await renderPortfolioData();
        },
        onCertificatesChange: async (payload) => {
          console.log('[Portfolio Realtime] Certificates changed remotely:', payload);
          await renderPortfolioData();
        },
        onGalleryChange: async (payload) => {
          console.log('[Portfolio Realtime] Gallery changed remotely:', payload);
          await renderPortfolioData();
        }
      });
    } else if (window.SupabaseCMS && typeof window.SupabaseCMS.subscribeToProjects === 'function') {
      window.SupabaseCMS.subscribeToProjects(async (payload) => {
        console.log('[Portfolio Realtime] Projects changed remotely:', payload);
        await renderPortfolioData();
      });
    }
  });
})();
