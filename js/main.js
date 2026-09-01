/**
 * AI LABORATORY & SOFTWARE ENGINEERING PORTFOLIO ENGINE
 * SAGIT FATURRAKHMAN — 2026
 */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ============================================================
     1. THREE.JS 3D LABORATORY BACKGROUND (SPHERE + PARTICLES + HOLOGRAM)
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
      opacity: 0.18,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    labGroup.add(sphere);

    // 2. Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    labGroup.add(innerCore);

    // 3. Holographic Orbiting Telemetry Rings
    const ring1Geo = new THREE.RingGeometry(11, 11.08, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    labGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(13.5, 13.58, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    labGroup.add(ring2);

    // 4. Floating AI Laboratory Particle Field (Bintik / Hologram Bergerak)
    const particleCount = 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 80;
      particlePositions[i + 1] = (Math.random() - 0.5) * 80;
      particlePositions[i + 2] = (Math.random() - 0.5) * 60;

      particleSpeeds[i] = (Math.random() - 0.5) * 0.02;
      particleSpeeds[i + 1] = (Math.random() - 0.5) * 0.02;
      particleSpeeds[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Material with Soft Glowing Dot Texture
    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    function animate() {
      requestAnimationFrame(animate);

      const scrollY = window.scrollY || window.pageYOffset;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? scrollY / totalHeight : 0;

      if (!prefersReducedMotion) {
        sphere.rotation.x += 0.0012;
        sphere.rotation.y += 0.0018;
        innerCore.rotation.x -= 0.0018;
        innerCore.rotation.y -= 0.0022;
        ring1.rotation.z += 0.0015;
        ring2.rotation.z -= 0.0012;

        // Particle drifting animation
        const positions = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += particleSpeeds[i];
          positions[i + 1] += particleSpeeds[i + 1];
          positions[i + 2] += particleSpeeds[i + 2];

          // Wrap around boundaries
          if (positions[i] > 40) positions[i] = -40;
          if (positions[i] < -40) positions[i] = 40;
          if (positions[i + 1] > 40) positions[i + 1] = -40;
          if (positions[i + 1] < -40) positions[i + 1] = 40;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      const targetZ = 32 - progress * 10;
      const targetRotationY = progress * Math.PI * 1.5 + mouseX * 0.2;
      const targetRotationX = mouseY * 0.15;

      labGroup.rotation.y += (targetRotationY - labGroup.rotation.y) * 0.05;
      labGroup.rotation.x += (targetRotationX - labGroup.rotation.x) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

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
        progressBar.style.height = `${Math.min(100, Math.max(8, scrollPercent))}%`;
      }

      let activeId = 'hero';

      chapters.forEach((chapter) => {
        const top = chapter.offsetTop;
        const height = chapter.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          activeId = chapter.id;
        }
      });

      // Update Rail Items
      railItems.forEach((item) => {
        const target = item.getAttribute('data-rail');
        item.classList.toggle('active', target === activeId);
      });

      // Update Topbar Links
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
     4. DOCUMENTATION FILTER TABS (CHAPTER 09)
     ============================================================ */
  function initDocTabs() {
    const tabs = $$('.doc-tab');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        const docCards = $$('.doc-entry-card');

        docCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     5. SCROLL TO TOP
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
     6. PRIVATE CONTENT VAULT (ADMIN MODAL & STATE CONTROLLER)
     ============================================================ */
  const VAULT_STORE_KEY = 'sagit.portfolio.vault.v4';
  const vaultDefaults = { projects: [], docs: [] };

  function readVault() {
    try {
      return { ...vaultDefaults, ...JSON.parse(localStorage.getItem(VAULT_STORE_KEY) || '{}') };
    } catch {
      return { ...vaultDefaults };
    }
  }

  function writeVault(data) {
    localStorage.setItem(VAULT_STORE_KEY, JSON.stringify(data));
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
    }[char]));
  }

  function fileToDataUrl(file) {
    return new Promise((resolve) => {
      if (!file || !file.size) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  function renderVaultProjectsAndDocs() {
    const data = readVault();
    $$('[data-vault-dynamic="true"]').forEach((node) => node.remove());

    // Render Projects
    const projectList = $('#project-list');
    const projectEmptyState = $('#project-empty-state');

    if (projectList) {
      if (data.projects.length === 0) {
        if (projectEmptyState) projectEmptyState.style.display = 'block';
      } else {
        if (projectEmptyState) projectEmptyState.style.display = 'none';

        data.projects.forEach((item, index) => {
          const card = document.createElement('article');
          card.className = 'project-master-card double-bezel';
          card.dataset.vaultDynamic = 'true';
          card.innerHTML = `
            <div class="bezel-inner">
              <div class="project-top-row">
                <div class="project-category-pills">
                  <span class="badge-index">0${index + 1}</span>
                  <span class="proj-badge">${escapeHtml(item.category || 'PROJECT')}</span>
                </div>
                <span class="proj-status-live">PUBLISHED</span>
              </div>
              <div class="project-body-grid">
                <div class="project-details">
                  <h3 class="proj-name">${escapeHtml(item.title)}</h3>
                  ${item.subtitle ? `<h4 class="proj-subtitle">${escapeHtml(item.subtitle)}</h4>` : ''}
                  <p class="proj-description">${escapeHtml(item.description)}</p>
                  
                  <div class="proj-meta-section">
                    ${item.stack ? `<div class="meta-block"><strong>TECH STACK</strong><p>${escapeHtml(item.stack)}</p></div>` : ''}
                    ${item.ai ? `<div class="meta-block"><strong>AI CAPABILITIES</strong><p>${escapeHtml(item.ai)}</p></div>` : ''}
                    ${item.role ? `<div class="meta-block"><strong>MY ROLE</strong><p>${escapeHtml(item.role)}</p></div>` : ''}
                  </div>

                  ${item.url ? `
                    <div class="project-action-row">
                      <a class="btn-clean primary" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
                        <span>LIVE PROJECT</span>
                        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  ` : ''}
                </div>

                ${item.image ? `
                  <div class="project-screen-mockup">
                    <div class="mockup-window-bar">
                      <span class="mock-dot red"></span>
                      <span class="mock-dot yellow"></span>
                      <span class="mock-dot green"></span>
                      <span class="mock-url">${escapeHtml(item.title.toLowerCase().replace(/\s+/g, '-'))}.dev</span>
                    </div>
                    <img src="${item.image}" alt="${escapeHtml(item.title)}" style="width:100%;height:auto;display:block;">
                  </div>
                ` : `
                  <div class="project-screen-mockup">
                    <div class="mockup-window-bar">
                      <span class="mock-dot red"></span>
                      <span class="mock-dot yellow"></span>
                      <span class="mock-dot green"></span>
                      <span class="mock-url">${escapeHtml(item.title.toLowerCase().replace(/\s+/g, '-'))}.dev</span>
                    </div>
                    <div class="mockup-screen-inner warungio-preview">
                      <div class="mockup-hero-banner">
                        <span class="banner-badge">${escapeHtml(item.category || 'PROJECT')}</span>
                        <h4>${escapeHtml(item.title)}</h4>
                      </div>
                    </div>
                  </div>
                `}
              </div>
            </div>
          `;
          projectList.appendChild(card);
        });
      }
    }

    // Render Documentation & Gallery
    const docList = $('#doc-list');
    const docEmptyState = $('#doc-empty-state');

    if (docList) {
      if (data.docs.length === 0) {
        if (docEmptyState) docEmptyState.style.display = 'block';
      } else {
        if (docEmptyState) docEmptyState.style.display = 'none';

        data.docs.forEach((item) => {
          const card = document.createElement('article');
          card.className = 'doc-entry-card double-bezel';
          card.dataset.vaultDynamic = 'true';
          card.dataset.category = item.category || 'certificates';
          
          let previewContent = '';
          if (item.image) {
            previewContent = `<img src="${item.image}" alt="${escapeHtml(item.title)}" class="doc-thumb">`;
          } else if (item.category === 'experience') {
            previewContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="exp-icon-svg"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
          } else {
            previewContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="exp-icon-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
          }

          card.innerHTML = `
            <div class="bezel-inner">
              <div class="doc-badge-preview ${item.category === 'experience' ? 'exp-preview' : ''} ${item.category === 'gallery' ? 'gallery-preview' : ''}">
                ${previewContent}
                <span class="doc-type-tag">${escapeHtml((item.category || 'DOCUMENT').toUpperCase())}</span>
              </div>
              <div class="doc-info">
                <h3 class="doc-title">${escapeHtml(item.title)}</h3>
                ${item.issuer ? `<span class="doc-issuer">${escapeHtml(item.issuer)}</span>` : ''}
                <p class="doc-summary">${escapeHtml(item.description)}</p>
                <div class="doc-footer-meta">
                  <span class="doc-date">${escapeHtml(item.date || '2026')}</span>
                  ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" class="doc-link-arrow">VIEW DOCUMENT →</a>` : '<span class="doc-link-arrow">VERIFIED →</span>'}
                </div>
              </div>
            </div>
          `;
          docList.appendChild(card);
        });
      }
    }

    // Update list in secret admin modal
    const list = $('#secret-list');
    if (list) {
      list.innerHTML = '';
      if (data.projects.length === 0 && data.docs.length === 0) {
        list.innerHTML = '<div style="color:var(--text-dim);font-size:0.8rem;padding:8px 0;">No entries created yet. Fill out the forms above to add items.</div>';
      } else {
        [
          ...data.projects.map((p, i) => ({ type: 'projects', item: p, idx: i })),
          ...data.docs.map((d, i) => ({ type: 'docs', item: d, idx: i })),
        ].forEach(({ type, item, idx }) => {
          const row = document.createElement('div');
          row.className = 'secret-list-item';
          row.innerHTML = `
            <span><strong>[${type === 'projects' ? 'PROJECT' : (item.category || 'DOC').toUpperCase()}]</strong> ${escapeHtml(item.title)}</span>
            <button type="button">Delete</button>
          `;
          row.querySelector('button').addEventListener('click', () => {
            const next = readVault();
            next[type].splice(idx, 1);
            writeVault(next);
            renderVaultProjectsAndDocs();
          });
          list.appendChild(row);
        });
      }
    }
  }

  function initSecretAdmin() {
    const admin = $('#secret-admin');
    if (!admin) return;

    const open = (targetTab = 'project') => {
      admin.classList.add('open');
      admin.setAttribute('aria-hidden', 'false');

      // Set active tab
      $$('.secret-tab').forEach((t) => t.classList.toggle('active', t.dataset.secretTab === targetTab));
      $$('.secret-form').forEach((f) => f.classList.toggle('active', f.id.includes(targetTab)));
    };

    const close = () => {
      admin.classList.remove('open');
      admin.setAttribute('aria-hidden', 'true');
      if (window.location.hash === '#sagit-admin') {
        history.replaceState(null, '', window.location.pathname);
      }
    };

    if (window.location.hash === '#sagit-admin') open();

    $$('[data-secret-close]').forEach((el) => el.addEventListener('click', close));

    // Open triggers from empty state and footer
    $$('.open-vault-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.vaultTarget || 'project';
        open(target);
      });
    });

    $$('.secret-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.secret-tab').forEach((t) => t.classList.toggle('active', t === tab));
        $$('.secret-form').forEach((f) => f.classList.toggle('active', f.id.includes(tab.dataset.secretTab)));
      });
    });

    let typedKeySequence = '';
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      typedKeySequence = (typedKeySequence + e.key.toUpperCase()).slice(-10);
      if (typedKeySequence === 'SAGITADMIN') open();
      if (e.key === 'Escape') close();
    });

    // Form 1: Add Project
    $('#secret-project-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const data = readVault();
      data.projects.unshift({
        title: fd.get('title'),
        subtitle: fd.get('subtitle'),
        category: fd.get('category'),
        stack: fd.get('stack'),
        ai: fd.get('ai'),
        role: fd.get('role'),
        description: fd.get('description'),
        url: fd.get('url'),
        image: await fileToDataUrl(fd.get('image')),
      });
      writeVault(data);
      form.reset();
      renderVaultProjectsAndDocs();
      alert('Project saved successfully to Vault!');
    });

    // Form 2: Add Document / Gallery / Experience
    $('#secret-doc-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const data = readVault();
      data.docs.unshift({
        title: fd.get('title'),
        category: fd.get('category'),
        issuer: fd.get('issuer'),
        date: fd.get('date'),
        description: fd.get('description'),
        url: fd.get('url'),
        image: await fileToDataUrl(fd.get('image')),
      });
      writeVault(data);
      form.reset();
      renderVaultProjectsAndDocs();
      alert('Archive entry saved successfully to Vault!');
    });

    // Backup Export
    $('#btn-export-vault')?.addEventListener('click', () => {
      const data = readVault();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sagit-portfolio-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Backup Import
    $('#input-import-vault')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed.projects) || Array.isArray(parsed.docs)) {
            writeVault({ projects: parsed.projects || [], docs: parsed.docs || [] });
            renderVaultProjectsAndDocs();
            alert('Backup successfully imported!');
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    });

    // Clear All Data
    $('#btn-clear-vault')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data in the vault?')) {
        writeVault(vaultDefaults);
        renderVaultProjectsAndDocs();
      }
    });
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initThreeLabCanvas();
    initScrollSpy();
    initGithubHeatmap();
    initDocTabs();
    initBackToTop();
    initSecretAdmin();
    renderVaultProjectsAndDocs();
  });
})();
