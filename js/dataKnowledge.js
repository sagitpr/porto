import * as THREE from 'three';

/**
 * Chapter 06 — Data & Knowledge Infrastructure
 *
 * Implements the Data Knowledge Lab:
 * - Phase 1 (local 0.00 -> 0.20): Data Enters & Title Reveal
 * - Phase 2 (local 0.20 -> 0.45): Horizontal 3D Data Journey Stations Assemble
 * - Phase 3 (local 0.40 -> 0.85): 6-Stage Exploration (Sources -> Ingest -> Transform -> Store -> Knowledge -> Context)
 * - Phase 4 (local 0.85 -> 1.00): Foundation for Intelligence Card & Principles Reveal
 */
export function createDataKnowledge(scene) {
  const dataKnowledgeGroup = new THREE.Group();
  dataKnowledgeGroup.name = 'DataKnowledgeChamber';
  dataKnowledgeGroup.visible = false;

  // Chamber Center Position (Z = -17.0, Y = 0.7)
  const CHAMBER_CENTER = new THREE.Vector3(0, 0.7, -17.0);
  dataKnowledgeGroup.position.copy(CHAMBER_CENTER);

  // ═══ DOM ELEMENT HOOKS ═══
  const ch06Container      = document.getElementById('ch06-container');
  const titleBlock         = document.getElementById('ch06-title-block');
  const docPanel           = document.getElementById('ch06-doc-panel');
  const docLabel           = document.getElementById('ch06-doc-label');
  const docSublayer        = document.getElementById('ch06-doc-sublayer');
  const docDomain          = document.getElementById('ch06-doc-domain');
  const docStack           = document.getElementById('ch06-doc-stack');
  const docCapability      = document.getElementById('ch06-doc-capability');
  const progressDots       = document.querySelectorAll('#ch06-doc-panel .ch06-pdot');
  const navRail            = document.getElementById('ch06-nav-rail');
  const navItems           = document.querySelectorAll('#ch06-nav-rail .ch06-nav-item');
  const labelsLayer        = document.getElementById('ch06-nodes-labels-layer');
  const foundationCard     = document.getElementById('ch06-foundation-card');
  const scrollPrompt       = document.getElementById('ch06-scroll-prompt');

  const nodeLabelEls = {
    sources:   document.getElementById('label-6d-sources'),
    ingest:    document.getElementById('label-6d-ingest'),
    transform: document.getElementById('label-6d-transform'),
    store:     document.getElementById('label-6d-store'),
    knowledge: document.getElementById('label-6d-knowledge'),
    retrieve:  document.getElementById('label-6d-retrieve'),
    context:   document.getElementById('label-6d-context')
  };

  // ═══ MATERIALS ═══
  const whiteDaisMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.08
  });

  const softGrayMat = new THREE.MeshStandardMaterial({
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

  const skyBlueDimMat = new THREE.MeshStandardMaterial({
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

  // ═══ 1. ENVIRONMENT: DATA KNOWLEDGE CHAMBER PLATFORM ═══
  const daisGeo = new THREE.CylinderGeometry(5.8, 6.4, 0.32, 64);
  const daisMesh = new THREE.Mesh(daisGeo, whiteDaisMat);
  daisMesh.position.y = -2.2;
  daisMesh.receiveShadow = true;
  dataKnowledgeGroup.add(daisMesh);

  const ringGeo = new THREE.TorusGeometry(5.8, 0.045, 16, 64);
  const ringMesh = new THREE.Mesh(ringGeo, skyBlueLedMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = -2.04;
  dataKnowledgeGroup.add(ringMesh);

  // Inner data conduits circle on floor
  const innerRingGeo = new THREE.TorusGeometry(3.6, 0.02, 16, 64);
  const innerRing = new THREE.Mesh(innerRingGeo, skyBlueDimMat);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = -2.03;
  dataKnowledgeGroup.add(innerRing);

  // Chamber Ambient Point Light
  const chamberSpot = new THREE.PointLight(0x38bdf8, 4.5, 24, 1.2);
  chamberSpot.position.set(0, 3.4, 0);
  dataKnowledgeGroup.add(chamberSpot);

  // ═══ 2. DATA INFRASTRUCTURE STAGES CONFIGURATION (7 Stations) ═══
  const STAGES_CONFIG = [
    {
      key: 'sources',
      num: '01',
      stageNum: 'STAGE 01',
      label: 'DATA SOURCES',
      sublayer: 'SOURCE INTEGRATION',
      domain: 'Data Architecture',
      stack: 'PostgreSQL · MySQL · APIs · Events · S3',
      capability: 'Capturing structured databases, unstructured documents, API streams, and user events.',
      pos: new THREE.Vector3(-3.2, 0.55, 0)
    },
    {
      key: 'ingest',
      num: '02',
      stageNum: 'PIPELINE STAGE 01',
      label: 'DATA INGESTION',
      sublayer: 'COLLECT & RECEIVE',
      domain: 'Data Engineering',
      stack: 'APIs · ETL · Event Streams · Batch & Real-time Ingestion',
      capability: 'Collecting information from multiple sources reliably and preparing it for downstream processing.',
      pos: new THREE.Vector3(-2.0, 0.45, 0)
    },
    {
      key: 'transform',
      num: '03',
      stageNum: 'PIPELINE STAGE 02',
      label: 'TRANSFORMATION',
      sublayer: 'CLEAN & ENRICH',
      domain: 'Data Processing',
      stack: 'Pandas · Spark · Tokenizers · Chunking Engines · Schema Normalizers',
      capability: 'Cleaning, chunking, and structuring raw information into standardized knowledge blocks.',
      pos: new THREE.Vector3(-0.7, 0.55, 0)
    },
    {
      key: 'store',
      num: '04',
      stageNum: 'PIPELINE STAGE 03',
      label: 'STORAGE & PERSISTENCE',
      sublayer: 'STORE & ORGANIZE',
      domain: 'Data Persistence',
      stack: 'Vector DB · PostgreSQL · Redis · Qdrant · Pinecone',
      capability: 'Persisting high-dimensional vector embeddings and relational metadata for rapid querying.',
      pos: new THREE.Vector3(0.6, 0.45, 0)
    },
    {
      key: 'knowledge',
      num: '05',
      stageNum: 'PIPELINE STAGE 04',
      label: 'KNOWLEDGE LAYER',
      sublayer: 'STRUCTURE & EMBED',
      domain: 'Knowledge Systems',
      stack: 'Knowledge Graphs · Ontologies · Semantic Index · Graph RAG',
      capability: 'Structuring entity relationships and semantic topologies to enrich AI contextual reasoning.',
      pos: new THREE.Vector3(1.9, 0.55, 0)
    },
    {
      key: 'retrieve',
      num: '06',
      stageNum: 'PIPELINE STAGE 05',
      label: 'RETRIEVAL',
      sublayer: 'SEARCH & FIND',
      domain: 'Information Retrieval',
      stack: 'Hybrid Search · BM25 · Cosine Distance · Re-ranking Models',
      capability: 'Executing sub-second semantic retrieval to locate the exact context needed for reasoning.',
      pos: new THREE.Vector3(3.0, 0.45, 0)
    },
    {
      key: 'context',
      num: '07',
      stageNum: 'PIPELINE STAGE 06',
      label: 'AI CONTEXT',
      sublayer: 'DELIVER TO INTELLIGENCE',
      domain: 'Context Injection',
      stack: 'Prompt Grounding · Context Injection · Token Optimization',
      capability: 'Injecting verified, grounded domain knowledge directly into AI models for factual inference.',
      pos: new THREE.Vector3(4.1, 0.55, 0)
    }
  ];

  // ═══ 3. BUILD 3D DATA LAB HOLOGRAPHIC STATIONS ═══
  const stageGroups = [];
  const stagePedestalRings = [];

  function createStationPedestal(parentGroup) {
    const pedGeo = new THREE.CylinderGeometry(0.38, 0.45, 0.16, 32);
    const ped = new THREE.Mesh(pedGeo, softGrayMat);
    ped.position.y = -0.72;
    parentGroup.add(ped);

    const pedRingGeo = new THREE.TorusGeometry(0.42, 0.015, 8, 32);
    const pedRing = new THREE.Mesh(pedRingGeo, skyBlueDimMat);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.y = -0.64;
    parentGroup.add(pedRing);
    stagePedestalRings.push(pedRing);
  }

  // 3.0 STATION: DATA SOURCES (Tower with database, document & API discs)
  const sourcesGroup = new THREE.Group();
  sourcesGroup.position.copy(STAGES_CONFIG[0].pos);
  for (let d = 0; d < 4; d++) {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.07, 24), softGrayMat);
    disc.position.y = (d - 1.5) * 0.18;
    sourcesGroup.add(disc);
    const discLed = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.008, 6, 24), skyBlueLedMat);
    discLed.rotation.x = Math.PI / 2;
    discLed.position.y = (d - 1.5) * 0.18;
    sourcesGroup.add(discLed);
  }
  const sourcesGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.9, 24), glassMat);
  sourcesGroup.add(sourcesGlass);
  createStationPedestal(sourcesGroup);
  dataKnowledgeGroup.add(sourcesGroup);
  stageGroups.push(sourcesGroup);

  // 3.1 STATION: INGESTION (Cylinder Chamber with internal data vortex)
  const ingestGroup = new THREE.Group();
  ingestGroup.position.copy(STAGES_CONFIG[1].pos);
  const ingestGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.85, 24), glassMat);
  ingestGroup.add(ingestGlass);
  const ingestCore = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16), skyBlueLedMat);
  ingestGroup.add(ingestCore);
  const ingestRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 32), skyBlueDimMat);
  ingestRing.rotation.x = Math.PI / 2;
  ingestGroup.add(ingestRing);
  createStationPedestal(ingestGroup);
  dataKnowledgeGroup.add(ingestGroup);
  stageGroups.push(ingestGroup);

  // 3.2 STATION: TRANSFORMATION (Translucent crystal cube matrix)
  const transformGroup = new THREE.Group();
  transformGroup.position.copy(STAGES_CONFIG[2].pos);
  const transformCube = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), glassMat);
  transformGroup.add(transformCube);
  const transformWire = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), wireMat);
  transformGroup.add(transformWire);
  const transformInner = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), skyBlueLedMat);
  transformGroup.add(transformInner);
  createStationPedestal(transformGroup);
  dataKnowledgeGroup.add(transformGroup);
  stageGroups.push(transformGroup);

  // 3.3 STATION: STORAGE (Database Cylinder Vault)
  const storeGroup = new THREE.Group();
  storeGroup.position.copy(STAGES_CONFIG[3].pos);
  const storeGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.85, 24), glassMat);
  storeGroup.add(storeGlass);
  for (let s = 0; s < 3; s++) {
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24), skyBlueDimMat);
    platter.position.y = (s - 1) * 0.24;
    storeGroup.add(platter);
  }
  createStationPedestal(storeGroup);
  dataKnowledgeGroup.add(storeGroup);
  stageGroups.push(storeGroup);

  // 3.4 STATION: KNOWLEDGE LAYER (Spherical interconnected vector node network)
  const knowledgeGroup = new THREE.Group();
  knowledgeGroup.position.copy(STAGES_CONFIG[4].pos);
  const knowledgeGlass = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), glassMat);
  knowledgeGroup.add(knowledgeGlass);
  const knowledgeNet = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), wireMat);
  knowledgeGroup.add(knowledgeNet);
  const knowledgeCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12), skyBlueLedMat);
  knowledgeGroup.add(knowledgeCore);
  createStationPedestal(knowledgeGroup);
  dataKnowledgeGroup.add(knowledgeGroup);
  stageGroups.push(knowledgeGroup);

  // 3.5 STATION: RETRIEVAL (Search Lens & Aperture Ring)
  const retrieveGroup = new THREE.Group();
  retrieveGroup.position.copy(STAGES_CONFIG[5].pos);
  const retrieveRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 16, 32), skyBlueLedMat);
  retrieveGroup.add(retrieveRing);
  const retrieveLens = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), glassMat);
  retrieveGroup.add(retrieveLens);
  createStationPedestal(retrieveGroup);
  dataKnowledgeGroup.add(retrieveGroup);
  stageGroups.push(retrieveGroup);

  // 3.6 STATION: AI CONTEXT (Holographic Intelligence Brain Sphere)
  const contextGroup = new THREE.Group();
  contextGroup.position.copy(STAGES_CONFIG[6].pos);
  const contextOrb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), glassMat);
  contextGroup.add(contextOrb);
  const brainCore = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24), skyBlueLedMat);
  contextGroup.add(brainCore);
  const brainRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.012, 8, 32), skyBlueDimMat);
  brainRing.rotation.x = Math.PI / 2;
  contextGroup.add(brainRing);
  createStationPedestal(contextGroup);
  dataKnowledgeGroup.add(contextGroup);
  stageGroups.push(contextGroup);

  // ═══ 4. FLOWING HORIZONTAL DATA CONDUIT BEAMS ═══
  const conduitPoints = [];
  STAGES_CONFIG.forEach(cfg => {
    conduitPoints.push(cfg.pos.clone());
  });

  const conduitCurve = new THREE.CatmullRomCurve3(conduitPoints);
  const conduitGeo = new THREE.TubeGeometry(conduitCurve, 64, 0.018, 8, false);
  const conduitLineMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65
  });
  const conduitTube = new THREE.Mesh(conduitGeo, conduitLineMat);
  dataKnowledgeGroup.add(conduitTube);

  // Streaming Data Flow Particles along Conduit
  const flowCount = 30;
  const flowGeo = new THREE.BufferGeometry();
  const flowPositions = new Float32Array(flowCount * 3);
  const flowProgress = new Float32Array(flowCount);
  const flowSpeeds = new Float32Array(flowCount);

  for (let i = 0; i < flowCount; i++) {
    flowProgress[i] = Math.random();
    flowSpeeds[i] = 0.25 + Math.random() * 0.35;
  }
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
  const flowMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.08,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const flowPoints = new THREE.Points(flowGeo, flowMat);
  dataKnowledgeGroup.add(flowPoints);

  scene.add(dataKnowledgeGroup);

  // ═══ 5. 3D TO SCREEN PROJECTION HELPER ═══
  const tempV = new THREE.Vector3();
  function projectToScreen(worldPos, camera) {
    tempV.copy(worldPos).project(camera);
    return {
      x: (tempV.x * 0.5 + 0.5) * window.innerWidth,
      y: (-tempV.y * 0.5 + 0.5) * window.innerHeight,
      visible: tempV.z < 1.0
    };
  }

  // ═══ 6. DOCUMENTATION & NAVIGATION SYNC ═══
  let lastActiveIdx = -1;

  function updateDocPanelAndNav(idx) {
    const data = STAGES_CONFIG[idx];
    if (!data) return;

    if (docLabel)      docLabel.textContent = data.label;
    if (docSublayer)   docSublayer.textContent = data.stageNum;
    if (docDomain)     docDomain.textContent = data.domain;
    if (docStack)      docStack.textContent = data.stack;
    if (docCapability) docCapability.textContent = data.capability;

    // Left Panel progress dots
    progressDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));

    // Right Nav Rail items
    navItems.forEach((item, i) => item.classList.toggle('active', i === Math.min(idx, 5)));

    // 3D projected label highlight
    Object.keys(nodeLabelEls).forEach(k => {
      const el = nodeLabelEls[k];
      if (el) {
        el.classList.toggle('active', k === data.key);
      }
    });
  }

  updateDocPanelAndNav(0);

  // ═══ 7. FRAME ANIMATION & SCROLL UPDATE LOOP ═══
  function update(delta, elapsedTime, scrollProgress, isCh6Active, localProgress, camera) {
    if (!isCh6Active) {
      dataKnowledgeGroup.visible = false;
      if (ch06Container) {
        ch06Container.classList.remove('active');
        ch06Container.style.visibility = 'hidden';
      }
      if (titleBlock) {
        titleBlock.classList.remove('visible');
        titleBlock.style.opacity = '0';
      }
      if (docPanel) docPanel.classList.remove('visible');
      if (navRail) navRail.classList.remove('visible');
      if (labelsLayer) labelsLayer.classList.remove('visible');
      if (foundationCard) {
        foundationCard.classList.remove('visible');
        foundationCard.style.opacity = '0';
      }
      if (scrollPrompt) scrollPrompt.classList.remove('visible');
      return;
    }

    dataKnowledgeGroup.visible = true;
    if (ch06Container) {
      ch06Container.classList.add('active');
      ch06Container.style.visibility = 'visible';
    }

    // Normalized progress within Chapter 06 (0.76 -> 0.86)
    const ch6p = localProgress !== undefined ? localProgress : Math.min(Math.max((scrollProgress - 0.76) / 0.10, 0), 1);

    // ═══ PHASE 1: TITLE & CHAMBER REVEAL (ch6p 0.00 -> 0.20) ═══
    const revealProgress = Math.min(ch6p / 0.15, 1.0);
    const enterScale = 0.8 + revealProgress * 0.2;
    dataKnowledgeGroup.scale.set(enterScale, enterScale, enterScale);
    chamberSpot.intensity = 4.5 * revealProgress;

    if (titleBlock) {
      if (ch6p >= 0.02 && ch6p < 0.94) {
        const titleFade = Math.min(ch6p / 0.08, 1.0);
        titleBlock.classList.add('visible');
        titleBlock.style.opacity = titleFade.toFixed(2);
      } else {
        titleBlock.classList.remove('visible');
        titleBlock.style.opacity = '0';
      }
    }

    // ═══ PHASE 2 & 3: 6-STAGE DATA LAB EXPLORATION (ch6p 0.20 -> 0.85) ═══
    const inExplorationPhase = ch6p >= 0.18 && ch6p < 0.86;
    if (docPanel) {
      docPanel.classList.toggle('visible', inExplorationPhase);
    }
    if (navRail) {
      navRail.classList.toggle('visible', inExplorationPhase);
    }
    if (labelsLayer) {
      labelsLayer.classList.toggle('visible', inExplorationPhase);
    }
    if (scrollPrompt) {
      scrollPrompt.classList.toggle('visible', ch6p >= 0.15 && ch6p < 0.85);
    }

    if (inExplorationPhase) {
      const expT = (ch6p - 0.18) / 0.66;
      const activeStageIdx = Math.min(Math.floor(expT * 7), 6);
      if (activeStageIdx !== lastActiveIdx) {
        lastActiveIdx = activeStageIdx;
        updateDocPanelAndNav(activeStageIdx);
      }

      // Station beacon highlighting
      stageGroups.forEach((group, i) => {
        const isActive = i === activeStageIdx;
        const targetScale = isActive ? 1.14 : 0.88;
        const curScale = group.scale.x;
        const nScale = curScale + (targetScale - curScale) * 0.1;
        group.scale.set(nScale, nScale, nScale);

        if (stagePedestalRings[i]) {
          stagePedestalRings[i].material = isActive ? skyBlueLedMat : skyBlueDimMat;
        }
      });
    } else {
      stageGroups.forEach(g => g.scale.set(1.0, 1.0, 1.0));
    }

    // ═══ PHASE 4: FOUNDATION FOR INTELLIGENCE CARD (ch6p 0.85 -> 1.00) ═══
    if (foundationCard) {
      if (ch6p >= 0.85) {
        const cardFade = Math.min((ch6p - 0.85) / 0.08, 1.0);
        foundationCard.classList.add('visible');
        foundationCard.style.opacity = cardFade.toFixed(2);
      } else {
        foundationCard.classList.remove('visible');
        foundationCard.style.opacity = '0';
      }
    }

    // ═══ 3D TO SCREEN PROJECTION FOR STATION LABELS ═══
    if (camera && inExplorationPhase) {
      STAGES_CONFIG.forEach((cfg, i) => {
        const labelEl = nodeLabelEls[cfg.key];
        if (!labelEl) return;

        const wPos = stageGroups[i].getWorldPosition(new THREE.Vector3());
        wPos.y -= 0.44;
        const sPos = projectToScreen(wPos, camera);
        if (sPos.visible) {
          const safeX = Math.max(Math.min(sPos.x, window.innerWidth * 0.82), window.innerWidth * 0.18);
          const safeY = Math.max(Math.min(sPos.y, window.innerHeight * 0.84), window.innerHeight * 0.18);
          labelEl.style.left = `${safeX}px`;
          labelEl.style.top = `${safeY}px`;
          labelEl.style.opacity = '0.9';
        } else {
          labelEl.style.opacity = '0';
        }
      });
    }

    // ═══ MICRO-ANIMATIONS ═══
    transformCube.rotation.y = elapsedTime * 0.3;
    transformCube.rotation.x = Math.sin(elapsedTime * 0.4) * 0.15;
    transformInner.rotation.y = -elapsedTime * 0.5;

    knowledgeNet.rotation.y = elapsedTime * 0.25;
    retrieveRing.rotation.z = Math.sin(elapsedTime * 0.6) * 0.2;
    contextOrb.rotation.y = elapsedTime * 0.2;
    brainCore.rotation.y = elapsedTime * 0.35;

    // Conduit flow particles update
    const pArray = flowGeo.attributes.position.array;
    for (let i = 0; i < flowCount; i++) {
      flowProgress[i] += delta * flowSpeeds[i] * 0.5;
      if (flowProgress[i] > 1.0) flowProgress[i] = 0;

      const pt = conduitCurve.getPoint(flowProgress[i]);
      pArray[i * 3]     = pt.x;
      pArray[i * 3 + 1] = pt.y;
      pArray[i * 3 + 2] = pt.z;
    }
    flowGeo.attributes.position.needsUpdate = true;
  }

  return {
    dataKnowledgeGroup,
    update
  };
}
