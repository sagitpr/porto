import * as THREE from 'three';

/**
 * Chapter 04 — System Architecture Chamber
 *
 * Implements the clean, high-end white laboratory aesthetic matching Chapters 01–03:
 * - Polished white circular dais with soft sky-blue concentric LED rings
 * - Central AI ENGINE (translucent glass sphere + neural core + delicate orbital rings)
 * - 6 surrounding orbital system nodes in compact radial composition (UI, Software, Data, API, Database, Cloud)
 * - Thin semi-transparent constellation conduits with subtle traveling data pulses
 * - Left translucent white glass documentation panel
 * - Right vertical system domains navigation rail
 * - Crisp 3D-to-screen projected node label badges
 * - 4-Phase progressive scroll timeline (0.70 -> 1.00)
 */
export function createSystemArchitecture(scene) {
  const architectureGroup = new THREE.Group();
  architectureGroup.name = 'SystemArchitectureChamber';
  architectureGroup.visible = false;

  // Chamber Center Position (Z = -9.2, Y = 0.7)
  const ARCH_CENTER = new THREE.Vector3(0, 0.7, -9.2);
  architectureGroup.position.copy(ARCH_CENTER);

  // ═══ DOM ELEMENT HOOKS ═══
  const ch04Container    = document.getElementById('ch04-container');
  const titleBlock       = document.getElementById('ch04-title-block');
  const docPanel         = document.getElementById('ch04-doc-panel');
  const docLabel         = document.getElementById('ch04-doc-label');
  const docSublayer      = document.getElementById('ch04-doc-sublayer');
  const docDomain        = document.getElementById('ch04-doc-domain');
  const docStack         = document.getElementById('ch04-doc-stack');
  const docCapability    = document.getElementById('ch04-doc-capability');
  const progressDots     = document.querySelectorAll('.ch04-pdot');
  const navRail          = document.getElementById('ch04-nav-rail');
  const navItems         = document.querySelectorAll('.ch04-nav-item');
  const labelsLayer      = document.getElementById('ch04-nodes-labels-layer');
  const insight          = document.getElementById('ch04-insight');
  const scrollPrompt     = document.getElementById('ch04-scroll-prompt');

  // Node label DOM elements mapped by key
  const nodeLabelEls = {
    ai:       document.getElementById('label-3d-ai'),
    ui:       document.getElementById('label-3d-ui'),
    software: document.getElementById('label-3d-software'),
    data:     document.getElementById('label-3d-data'),
    api:      document.getElementById('label-3d-api'),
    db:       document.getElementById('label-3d-db'),
    cloud:    document.getElementById('label-3d-cloud')
  };

  // ═══ CLINICAL WHITE & TRANSLUCENT GLASS MATERIALS ═══
  const whiteDaisMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.08
  });

  const softGrayArchMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.25,
    metalness: 0.05
  });

  const skyBlueLedMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.8,
    roughness: 0.1
  });

  const skyBlueDimLedMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xeaf8ff,
    transparent: true,
    opacity: 0.32,
    transmission: 0.90,
    roughness: 0.04,
    ior: 1.35,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });

  // ═══ 1. ENVIRONMENT: WHITE LABORATORY BRIEFING CHAMBER ═══

  // Multi-tier Circular Dais (Y = -2.7)
  const floorTier1 = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 8.8, 0.25, 64), whiteDaisMat);
  floorTier1.position.y = -2.7;
  architectureGroup.add(floorTier1);

  const floorTier2 = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.4, 0.2, 64), softGrayArchMat);
  floorTier2.position.y = -2.55;
  architectureGroup.add(floorTier2);

  const floorTier3 = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.15, 64), whiteDaisMat);
  floorTier3.position.y = -2.42;
  architectureGroup.add(floorTier3);

  // Concentric Sky-Blue Floor LED Rings
  const ringRadii = [6.25, 4.25, 2.6, 1.3];
  ringRadii.forEach(r => {
    const ringGeo = new THREE.TorusGeometry(r, 0.02, 8, 80);
    const ringMesh = new THREE.Mesh(ringGeo, skyBlueLedMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -2.34;
    architectureGroup.add(ringMesh);
  });

  // Background Architectural Perimeter Pillars in Clinical White with Sky-Blue Lines (Strictly Rear Arc)
  const pillarCount = 6;
  const pillarGeo = new THREE.BoxGeometry(0.28, 7.5, 0.28);
  const vLightGeo = new THREE.BoxGeometry(0.03, 7.0, 0.03);

  for (let i = 0; i < pillarCount; i++) {
    const angle = (i / (pillarCount - 1)) * Math.PI;
    const px = Math.cos(angle) * 7.8;
    const pz = -Math.sin(angle) * 3.2 - 3.8; // Always behind nodes (Z <= -3.8)

    const pillar = new THREE.Mesh(pillarGeo, softGrayArchMat);
    pillar.position.set(px, 1.2, pz);
    architectureGroup.add(pillar);

    const vLight = new THREE.Mesh(vLightGeo, skyBlueLedMat);
    vLight.position.set(px, 1.2, pz + 0.16);
    architectureGroup.add(vLight);
  }

  // Ceiling Structure
  const ceilingRing = new THREE.Mesh(new THREE.TorusGeometry(6.0, 0.15, 16, 64), softGrayArchMat);
  ceilingRing.rotation.x = Math.PI / 2;
  ceilingRing.position.y = 5.2;
  architectureGroup.add(ceilingRing);

  const ceilingLed = new THREE.Mesh(new THREE.TorusGeometry(5.8, 0.025, 8, 64), skyBlueLedMat);
  ceilingLed.rotation.x = Math.PI / 2;
  ceilingLed.position.y = 5.05;
  architectureGroup.add(ceilingLed);

  // Soft Chamber Sky-Blue Accent Light
  const chamberSpot = new THREE.PointLight(0x38bdf8, 4.0, 22, 1.3);
  chamberSpot.position.set(0, 3.2, 0);
  architectureGroup.add(chamberSpot);

  // ═══ 2. SYSTEM DOMAINS DATA (7 Core Domains) ═══
  const SYSTEM_DOMAINS = [
    {
      key: 'ai',
      num: '01',
      label: 'AI ENGINE',
      sublayer: 'INTELLIGENCE LAYER',
      domain: 'Artificial Intelligence & Machine Learning',
      stack: 'Python · PyTorch · TensorFlow · Hugging Face · LangChain',
      capability: 'Building intelligent systems for reasoning, automation, retrieval, and AI-assisted workflows.'
    },
    {
      key: 'software',
      num: '02',
      label: 'SOFTWARE SYSTEMS',
      sublayer: 'APPLICATION LAYER',
      domain: 'Software Engineering',
      stack: 'Python · TypeScript · Node.js · Django · Laravel',
      capability: 'Designing scalable web applications, backend systems, APIs, and service-oriented architectures.'
    },
    {
      key: 'data',
      num: '03',
      label: 'DATA ARCHITECTURE',
      sublayer: 'DATA LAYER',
      domain: 'Data Engineering & Retrieval',
      stack: 'PostgreSQL · MySQL · Redis · Vector Database · ETL',
      capability: 'Structuring reliable data pipelines, storage, retrieval systems, and AI-ready data architecture.'
    },
    {
      key: 'cloud',
      num: '04',
      label: 'CLOUD INFRASTRUCTURE',
      sublayer: 'INFRASTRUCTURE LAYER',
      domain: 'Cloud & Deployment',
      stack: 'Docker · Google Cloud · Cloud Run · VPS · CI/CD',
      capability: 'Deploying reliable applications and services across modern cloud infrastructure.'
    },
    {
      key: 'api',
      num: '05',
      label: 'API SERVICES',
      sublayer: 'INTEGRATION LAYER',
      domain: 'Integration & Backend Services',
      stack: 'REST · JSON · Webhooks · Authentication · OpenAPI',
      capability: 'Connecting applications, services, AI systems, and external platforms through reliable APIs.'
    },
    {
      key: 'db',
      num: '06',
      label: 'DATABASE',
      sublayer: 'PERSISTENCE LAYER',
      domain: 'Data Storage & Persistence',
      stack: 'PostgreSQL · MySQL · MariaDB · Redis',
      capability: 'Designing structured data storage and efficient application persistence layers.'
    },
    {
      key: 'ui',
      num: '07',
      label: 'USER INTERFACE',
      sublayer: 'EXPERIENCE LAYER',
      domain: 'Frontend & Interaction',
      stack: 'React · Next.js · HTML · CSS · Three.js · Figma',
      capability: 'Building responsive, interactive interfaces that connect complex systems with human users.'
    }
  ];

  // ═══ 3. SYSTEM MAP 3D NODE POSITIONS (Compact Radial Safe Framing) ═══
  // Perfectly proportioned layout:
  //            UI (0, 1.4, 0)
  //   SW (-2.2, 0.65, 0.05)    DATA (2.2, 0.65, 0.05)
  //            AI (0, 0, 0) [CENTER]
  //   API (-2.2, -0.65, 0.05)  DB (2.2, -0.65, 0.05)
  //          CLOUD (0, -1.3, 0)
  const nodeSpatialConfig = [
    { key: 'ai',       pos: new THREE.Vector3( 0.0,   0.0,   0.0) },
    { key: 'software', pos: new THREE.Vector3(-2.2,   0.65,  0.05) },
    { key: 'data',     pos: new THREE.Vector3( 2.2,   0.65,  0.05) },
    { key: 'cloud',    pos: new THREE.Vector3( 0.0,  -1.3,   0.0) },
    { key: 'api',      pos: new THREE.Vector3(-2.2,  -0.65,  0.05) },
    { key: 'db',       pos: new THREE.Vector3( 2.2,  -0.65,  0.05) },
    { key: 'ui',       pos: new THREE.Vector3( 0.0,   1.4,   0.0) }
  ];

  // ═══ 4. BUILD 3D PROCEDURAL NODE GEOMETRIES ═══
  const nodeGroups = [];
  const nodePedestalRings = [];

  // 4.0 CENTRAL HERO NODE: AI ENGINE
  const aiGroup = new THREE.Group();
  aiGroup.position.copy(nodeSpatialConfig[0].pos);

  // Outer Translucent Glass Sphere
  const aiShell = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), glassMat);
  aiGroup.add(aiShell);

  // Inner Soft Glowing Neural Core
  const aiCoreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), skyBlueLedMat);
  aiGroup.add(aiCoreSphere);

  // Delicate Rotating Orbital Rings
  const aiRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.012, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
  );
  aiRing1.rotation.x = Math.PI / 3;
  aiGroup.add(aiRing1);

  const aiRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.08, 0.01, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 })
  );
  aiRing2.rotation.y = Math.PI / 4;
  aiGroup.add(aiRing2);

  // Glass Platform Disc beneath AI Engine
  const aiPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.65, 0.05, 32), glassMat);
  aiPedestal.position.y = -0.52;
  aiGroup.add(aiPedestal);

  const aiPedRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.016, 8, 32), skyBlueLedMat);
  aiPedRing.rotation.x = Math.PI / 2;
  aiPedRing.position.y = -0.52;
  aiGroup.add(aiPedRing);
  nodePedestalRings.push(aiPedRing);

  architectureGroup.add(aiGroup);
  nodeGroups.push(aiGroup);

  // Helper for surrounding orbital node pedestals
  function createOrbitalNodePedestal(group) {
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.04, 32), glassMat);
    ped.position.y = -0.3;
    group.add(ped);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.012, 8, 32), skyBlueLedMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.3;
    group.add(ring);
    nodePedestalRings.push(ring);
  }

  // 4.1 NODE: SOFTWARE SYSTEMS (Cubes cluster + glowing core)
  const swGroup = new THREE.Group();
  swGroup.position.copy(nodeSpatialConfig[1].pos);
  swGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), glassMat));
  swGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), skyBlueLedMat));
  [{ x: 0.35, y: 0.2, z: 0 }, { x: -0.35, y: 0.2, z: 0 }, { x: 0, y: -0.25, z: 0.2 }].forEach(off => {
    const sat = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), softGrayArchMat);
    sat.position.set(off.x, off.y, off.z);
    swGroup.add(sat);
  });
  createOrbitalNodePedestal(swGroup);
  architectureGroup.add(swGroup);
  nodeGroups.push(swGroup);

  // 4.2 NODE: DATA ARCHITECTURE (Layered data planes)
  const dataGroup = new THREE.Group();
  dataGroup.position.copy(nodeSpatialConfig[2].pos);
  for (let i = 0; i < 3; i++) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.5), glassMat);
    plate.position.y = (i - 1) * 0.15;
    dataGroup.add(plate);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.3), skyBlueLedMat);
    glow.position.y = (i - 1) * 0.15;
    dataGroup.add(glow);
  }
  createOrbitalNodePedestal(dataGroup);
  architectureGroup.add(dataGroup);
  nodeGroups.push(dataGroup);

  // 4.3 NODE: CLOUD INFRASTRUCTURE (Cylinder pods + halo)
  const cloudGroup = new THREE.Group();
  cloudGroup.position.copy(nodeSpatialConfig[3].pos);
  const podGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
  [{ x: -0.2, y: 0, z: 0.1 }, { x: 0.2, y: 0, z: 0.1 }, { x: 0, y: 0.1, z: -0.15 }].forEach(p => {
    const pod = new THREE.Mesh(podGeo, glassMat);
    pod.position.set(p.x, p.y, p.z);
    cloudGroup.add(pod);
    const podRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.008, 8, 24), skyBlueDimLedMat);
    podRing.rotation.x = Math.PI / 2;
    podRing.position.set(p.x, p.y, p.z);
    cloudGroup.add(podRing);
  });
  createOrbitalNodePedestal(cloudGroup);
  architectureGroup.add(cloudGroup);
  nodeGroups.push(cloudGroup);

  // 4.4 NODE: API SERVICES (Gateway frame with illuminated ports)
  const apiGroup = new THREE.Group();
  apiGroup.position.copy(nodeSpatialConfig[4].pos);
  apiGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.38, 0.06), glassMat));
  apiGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.07), wireMat));
  [{ x: -0.28, y: 0.18 }, { x: 0.28, y: 0.18 }, { x: -0.28, y: -0.18 }, { x: 0.28, y: -0.18 }].forEach(pt => {
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), skyBlueLedMat);
    port.position.set(pt.x, pt.y, 0);
    apiGroup.add(port);
  });
  createOrbitalNodePedestal(apiGroup);
  architectureGroup.add(apiGroup);
  nodeGroups.push(apiGroup);

  // 4.5 NODE: DATABASE (Stacked cylindrical disc platters)
  const dbGroup = new THREE.Group();
  dbGroup.position.copy(nodeSpatialConfig[5].pos);
  const discGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.045, 32);
  for (let i = 0; i < 4; i++) {
    const disc = new THREE.Mesh(discGeo, glassMat);
    disc.position.y = (i - 1.5) * 0.1;
    dbGroup.add(disc);
    const dRing = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.008, 8, 32), skyBlueDimLedMat);
    dRing.rotation.x = Math.PI / 2;
    dRing.position.y = (i - 1.5) * 0.1;
    dbGroup.add(dRing);
  }
  const dbSpindle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 16), skyBlueLedMat);
  dbGroup.add(dbSpindle);
  createOrbitalNodePedestal(dbGroup);
  architectureGroup.add(dbGroup);
  nodeGroups.push(dbGroup);

  // 4.6 NODE: USER INTERFACE (Holographic floating screen frame)
  const uiGroup = new THREE.Group();
  uiGroup.position.copy(nodeSpatialConfig[6].pos);
  uiGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.4), glassMat));
  uiGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.4), wireMat).translateZ(0.01));
  const uiBar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.02), skyBlueLedMat);
  uiBar.position.set(-0.1, 0.09, 0.02);
  uiGroup.add(uiBar);
  const uiCard = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.07, 0.02), skyBlueDimLedMat);
  uiCard.position.set(0.14, -0.07, 0.02);
  uiGroup.add(uiCard);
  createOrbitalNodePedestal(uiGroup);
  architectureGroup.add(uiGroup);
  nodeGroups.push(uiGroup);

  // ═══ 5. CONSTELLATION DATA CONDUIT NETWORK ═══
  const conduitPairs = [
    // Radial connections from central AI Engine
    [0, 1], // AI <-> Software
    [0, 2], // AI <-> Data
    [0, 3], // AI <-> Cloud
    [0, 4], // AI <-> API
    [0, 5], // AI <-> Database
    [0, 6], // AI <-> UI

    // Perimeter architectural connections
    [6, 1], // UI <-> Software
    [1, 4], // Software <-> API
    [4, 3], // API <-> Cloud
    [3, 5], // Cloud <-> Database
    [5, 2], // Database <-> Data
    [2, 6]  // Data <-> UI
  ];

  const conduitLinePositions = [];
  conduitPairs.forEach(([a, b]) => {
    conduitLinePositions.push(
      nodeSpatialConfig[a].pos.x, nodeSpatialConfig[a].pos.y, nodeSpatialConfig[a].pos.z,
      nodeSpatialConfig[b].pos.x, nodeSpatialConfig[b].pos.y, nodeSpatialConfig[b].pos.z
    );
  });

  const conduitGeo = new THREE.BufferGeometry();
  conduitGeo.setAttribute('position', new THREE.Float32BufferAttribute(conduitLinePositions, 3));
  const conduitMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending
  });
  const conduitLines = new THREE.LineSegments(conduitGeo, conduitMat);
  architectureGroup.add(conduitLines);

  // Traveling Glowing Data Particles (Subtle, non-distracting)
  const pulseCount = 32;
  const pulseGeo = new THREE.BufferGeometry();
  const pulsePositions = new Float32Array(pulseCount * 3);
  const pulseData = [];

  for (let i = 0; i < pulseCount; i++) {
    const pair = conduitPairs[Math.floor(Math.random() * conduitPairs.length)];
    pulseData.push({
      from: nodeSpatialConfig[pair[0]].pos,
      to: nodeSpatialConfig[pair[1]].pos,
      progress: Math.random(),
      speed: 0.25 + Math.random() * 0.4
    });
  }

  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
  const pulseMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.1,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const pulseParticles = new THREE.Points(pulseGeo, pulseMat);
  architectureGroup.add(pulseParticles);

  scene.add(architectureGroup);

  // ═══ 6. 3D TO SCREEN PROJECTION HELPER ═══
  const tempV = new THREE.Vector3();
  function projectToScreen(worldPos, camera) {
    tempV.copy(worldPos).project(camera);
    return {
      x: (tempV.x * 0.5 + 0.5) * window.innerWidth,
      y: (-tempV.y * 0.5 + 0.5) * window.innerHeight,
      visible: tempV.z < 1.0
    };
  }

  // ═══ 7. PROGRESSIVE DOCUMENTATION CYCLING LOGIC ═══
  let lastActiveIdx = -1;

  /**
   * Maps global scroll progress in Chapter 04 (0.53 -> 0.62) to each of the 7 system nodes:
   */
  function getActiveNodeIndex(scrollProgress) {
    if (scrollProgress < 0.53) return 0;
    if (scrollProgress >= 0.62) return 0;
    const t = (scrollProgress - 0.53) / 0.09;
    return Math.min(Math.floor(t * 7), 6);
  }

  function updateDocPanelAndNav(idx) {
    const data = SYSTEM_DOMAINS[idx];
    if (!data) return;

    if (docLabel)      docLabel.textContent = data.label;
    if (docSublayer)   docSublayer.textContent = data.sublayer;
    if (docDomain)     docDomain.textContent = data.domain;
    if (docStack)      docStack.textContent = data.stack;
    if (docCapability) docCapability.textContent = data.capability;

    // Update left panel pagination dots
    progressDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));

    // Update right navigation rail active state
    navItems.forEach((item, i) => item.classList.toggle('active', i === idx));

    // Highlight active 3D node label badge
    Object.keys(nodeLabelEls).forEach(k => {
      const el = nodeLabelEls[k];
      if (el) {
        el.classList.toggle('active', k === data.key);
      }
    });
  }

  // Initialize with AI ENGINE
  updateDocPanelAndNav(0);

  // ═══ 8. FRAME ANIMATION & SCROLL UPDATE LOOP ═══
  function update(delta, elapsedTime, scrollProgress, isCh4Active, localProgress, camera) {
    if (!isCh4Active) {
      architectureGroup.visible = false;
      if (ch04Container) {
        ch04Container.classList.remove('active');
        ch04Container.style.visibility = 'hidden';
      }
      if (titleBlock) {
        titleBlock.classList.remove('visible');
        titleBlock.style.opacity = '0';
      }
      if (docPanel) docPanel.classList.remove('visible');
      if (navRail) navRail.classList.remove('visible');
      if (labelsLayer) labelsLayer.classList.remove('visible');
      if (insight) {
        insight.classList.remove('visible');
        insight.style.opacity = '0';
      }
      if (scrollPrompt) scrollPrompt.classList.remove('visible');
      return;
    }

    architectureGroup.visible = true;
    if (ch04Container) {
      ch04Container.classList.add('active');
      ch04Container.style.visibility = 'visible';
    }

    const ch4p = localProgress !== undefined ? localProgress : (scrollProgress - 0.44) / 0.16;

    // ═══ PHASE 1: ENTRY & TITLE REVEAL (local 0.00 -> 0.20) ═══
    const entryProgress = Math.min(ch4p / 0.18, 1.0);
    const archScale = 0.8 + entryProgress * 0.2;
    architectureGroup.scale.set(archScale, archScale, archScale);
    conduitMat.opacity = 0.38 * entryProgress;
    chamberSpot.intensity = 4.0 * entryProgress;

    if (titleBlock) {
      if (ch4p >= 0.02 && ch4p < 0.88) {
        const titleFade = Math.min(ch4p / 0.10, 1.0);
        titleBlock.classList.add('visible');
        titleBlock.style.opacity = titleFade.toFixed(2);
      } else {
        titleBlock.classList.remove('visible');
        titleBlock.style.opacity = '0';
      }
    }

    // ═══ PHASE 2: SYSTEM MAP ASSEMBLE (local 0.15 -> 0.35) ═══
    const mapAssembleProgress = ch4p >= 0.12 ? Math.min((ch4p - 0.12) / 0.15, 1.0) : 0;
    if (labelsLayer) {
      labelsLayer.classList.toggle('visible', mapAssembleProgress > 0.5 && ch4p < 0.88);
    }
    if (scrollPrompt) {
      scrollPrompt.classList.toggle('visible', ch4p >= 0.15 && ch4p < 0.85);
    }

    // ═══ PHASE 3: EXPLORATION (local 0.25 -> 0.85) ═══
    const inExplorationPhase = ch4p >= 0.22 && ch4p < 0.86;
    if (docPanel) {
      docPanel.classList.toggle('visible', inExplorationPhase);
    }
    if (navRail) {
      navRail.classList.toggle('visible', inExplorationPhase);
    }

    const currentActiveIdx = Math.min(Math.floor(Math.max((ch4p - 0.22) / 0.62, 0) * 7), 6);
    if (currentActiveIdx !== lastActiveIdx) {
      lastActiveIdx = currentActiveIdx;
      updateDocPanelAndNav(currentActiveIdx);
    }

    // Active Node Highlighting vs Inactive Dimming
    if (mapAssembleProgress > 0.3) {
      nodeGroups.forEach((group, i) => {
        const isActive = inExplorationPhase && i === currentActiveIdx;
        const targetScale = isActive ? 1.15 : (inExplorationPhase ? 0.88 : 1.0);
        const currentScale = group.scale.x;
        const newScale = currentScale + (targetScale - currentScale) * 0.1;
        group.scale.set(newScale, newScale, newScale);

        // Highlight pedestal ring
        if (nodePedestalRings[i]) {
          nodePedestalRings[i].material = isActive ? skyBlueLedMat : skyBlueDimLedMat;
        }
      });
    }

    // ═══ PHASE 4: ENGINEERING INSIGHT (local 0.85 -> 1.00) ═══
    if (insight) {
      if (ch4p >= 0.85) {
        const insightFade = Math.min((ch4p - 0.85) / 0.08, 1.0);
        insight.classList.add('visible');
        insight.style.opacity = insightFade.toFixed(2);
      } else {
        insight.classList.remove('visible');
        insight.style.opacity = '0';
      }
    }

    // ═══ 3D TO SCREEN PROJECTION FOR 7 NODE LABELS ═══
    if (camera && mapAssembleProgress > 0.5 && ch4p < 0.88) {
      nodeSpatialConfig.forEach((cfg, i) => {
        const labelEl = nodeLabelEls[cfg.key];
        if (!labelEl) return;

        const worldPos = nodeGroups[i].getWorldPosition(new THREE.Vector3());
        const badgeOffset = cfg.key === 'ai' ? -0.72 : -0.42;
        worldPos.y += badgeOffset;

        const screenPos = projectToScreen(worldPos, camera);
        if (screenPos.visible) {
          const safeX = Math.max(Math.min(screenPos.x, window.innerWidth * 0.82), window.innerWidth * 0.18);
          const safeY = Math.max(Math.min(screenPos.y, window.innerHeight * 0.84), window.innerHeight * 0.18);
          labelEl.style.left = `${safeX}px`;
          labelEl.style.top = `${safeY}px`;
          labelEl.style.opacity = (mapAssembleProgress * (inExplorationPhase ? 1.0 : 0.85)).toFixed(2);
        } else {
          labelEl.style.opacity = '0';
        }
      });
    }

    // ═══ SUBTLE 3D MICRO-ANIMATIONS ═══
    aiRing1.rotation.z += 0.006;
    aiRing2.rotation.x += 0.005;
    aiCoreSphere.rotation.y = elapsedTime * 0.18;

    // Subtle gentle float (±0.025 Y max)
    nodeGroups.forEach((group, i) => {
      group.position.y = nodeSpatialConfig[i].pos.y + Math.sin(elapsedTime * 1.1 + i * 0.9) * 0.025;
    });

    // Subtle individual node rotations
    nodeGroups[1].rotation.y = Math.sin(elapsedTime * 0.5) * 0.08; // SW
    nodeGroups[2].rotation.y = elapsedTime * 0.15;                 // Data
    nodeGroups[3].rotation.y = -elapsedTime * 0.12;                // Cloud
    nodeGroups[4].rotation.z = Math.cos(elapsedTime * 0.6) * 0.04; // API
    nodeGroups[5].rotation.y = elapsedTime * 0.2;                  // DB
    nodeGroups[6].rotation.y = Math.sin(elapsedTime * 0.4) * 0.05; // UI

    // Traveling Data Pulses Update
    const posAttr = pulseParticles.geometry.attributes.position;
    for (let i = 0; i < pulseCount; i++) {
      const p = pulseData[i];
      p.progress += p.speed * delta;
      if (p.progress >= 1.0) {
        p.progress = 0;
        const pair = conduitPairs[Math.floor(Math.random() * conduitPairs.length)];
        p.from = nodeSpatialConfig[pair[0]].pos;
        p.to = nodeSpatialConfig[pair[1]].pos;
      }
      posAttr.setXYZ(
        i,
        p.from.x + (p.to.x - p.from.x) * p.progress,
        p.from.y + (p.to.y - p.from.y) * p.progress,
        p.from.z + (p.to.z - p.from.z) * p.progress
      );
    }
    posAttr.needsUpdate = true;
  }

  return {
    architectureGroup,
    update
  };
}
