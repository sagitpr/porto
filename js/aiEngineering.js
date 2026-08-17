import * as THREE from 'three';

/**
 * Chapter 05 — AI Engineering / Intelligence Lab
 *
 * Implements the Intelligence Layer matching the portfolio design system:
 * - Phase 0 (ch05p: 0.00 -> 0.22): Hero State & Intelligence Core Awakening
 * - Phase 1 (ch05p: 0.22 -> 0.50): 5-Stage Horizontal Pipeline (Data -> Retrieval -> Model -> Reasoning -> Action)
 * - Phase 2 (ch05p: 0.50 -> 0.82): 2x2 AI Engineering Domains Grid (RAG, Agents, Vision, NLP)
 * - Phase 3 (ch05p: 0.82 -> 1.00): Engineering Philosophy Statement
 */
export function createAIEngineering(scene) {
  const aiEngineeringGroup = new THREE.Group();
  aiEngineeringGroup.name = 'AIEngineeringChamber';
  aiEngineeringGroup.visible = false;

  // Chamber Center Position (Z = -13.0, Y = 0.7)
  const CHAMBER_CENTER = new THREE.Vector3(0, 0.7, -13.0);
  aiEngineeringGroup.position.copy(CHAMBER_CENTER);

  // ═══ DOM ELEMENT HOOKS ═══
  const ch05Container = document.getElementById('ch05-container');
  const titleBlock = document.getElementById('ch05-title-block');
  const pipelineContainer = document.getElementById('ch05-pipeline-container');
  const pipelineStages = [
    document.getElementById('pipe-stage-0'),
    document.getElementById('pipe-stage-1'),
    document.getElementById('pipe-stage-2'),
    document.getElementById('pipe-stage-3'),
    document.getElementById('pipe-stage-4')
  ];
  const domainsGridCard = document.getElementById('ch05-domains-grid-card');
  const domainBoxes = [
    document.getElementById('ch05-domain-0'),
    document.getElementById('ch05-domain-1'),
    document.getElementById('ch05-domain-2'),
    document.getElementById('ch05-domain-3')
  ];
  const philosophy = document.getElementById('ch05-philosophy');
  const scrollPrompt = document.getElementById('ch05-scroll-prompt');

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
    transmission: 0.9,
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

  // ═══ 1. ENVIRONMENT: INTELLIGENCE CHAMBER PLATFORM ═══
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.8, 0.2, 64), whiteDaisMat);
  dais.position.y = -2.6;
  aiEngineeringGroup.add(dais);

  const innerDais = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.0, 0.15, 64), softGrayMat);
  innerDais.position.y = -2.48;
  aiEngineeringGroup.add(innerDais);

  // Concentric Floor Rings
  [5.2, 3.4, 1.8].forEach((r) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 8, 64), skyBlueLedMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.39;
    aiEngineeringGroup.add(ring);
  });

  // Curved Background Canopy Ring
  const ceilingRing = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.08, 16, 64), softGrayMat);
  ceilingRing.rotation.x = Math.PI / 2;
  ceilingRing.position.y = 4.8;
  aiEngineeringGroup.add(ceilingRing);

  // ═══ 2. CENTRAL INTELLIGENCE CORE (FOCAL POINT) ═══
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0.5, 0);

  // Outer Glass Ring
  const coreRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.04, 16, 64), glassMat);
  coreRing1.rotation.x = 0.35;
  coreGroup.add(coreRing1);

  const coreRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.03, 16, 64), skyBlueLedMat);
  coreRing2.rotation.y = 0.85;
  coreGroup.add(coreRing2);

  // Inner Translucent Glass Sphere
  const coreGlassSphere = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), glassMat);
  coreGroup.add(coreGlassSphere);

  // Internal Floating Neural Network Sphere
  const coreNeuralSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 2), wireMat);
  coreGroup.add(coreNeuralSphere);

  // Internal Core Spark
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const coreSpark = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), sparkMat);
  coreGroup.add(coreSpark);

  // Internal Dense Point Cloud
  const npCount = 80;
  const npGeo = new THREE.BufferGeometry();
  const npPos = new Float32Array(npCount * 3);
  for (let i = 0; i < npCount; i++) {
    const r = 0.2 + Math.random() * 0.45;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    npPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    npPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    npPos[i * 3 + 2] = r * Math.cos(phi);
  }
  npGeo.setAttribute('position', new THREE.BufferAttribute(npPos, 3));
  const npMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.06,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const neuralPoints = new THREE.Points(npGeo, npMat);
  coreGroup.add(neuralPoints);

  aiEngineeringGroup.add(coreGroup);

  // ═══ 3. 4 SATELLITE DOMAIN BEACONS ═══
  const domainPositions = [
    { pos: new THREE.Vector3(-3.2, 0.4, 0.4), key: 'rag' },
    { pos: new THREE.Vector3(3.2, 0.4, 0.4), key: 'agents' },
    { pos: new THREE.Vector3(-2.2, 1.2, -1.8), key: 'vision' },
    { pos: new THREE.Vector3(2.2, 1.2, -1.8), key: 'nlp' }
  ];

  const domainGroups = [];
  const domainPedestalRings = [];

  domainPositions.forEach((dp, i) => {
    const dGroup = new THREE.Group();
    dGroup.position.copy(dp.pos);

    // Pedestal
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.08, 32), softGrayMat);
    ped.position.y = -1.2;
    dGroup.add(ped);

    const pedRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.015, 8, 32), skyBlueDimMat);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.y = -1.15;
    dGroup.add(pedRing);
    domainPedestalRings.push(pedRing);

    // Vertical Light Guide
    const guideGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.0, 8);
    const guide = new THREE.Mesh(guideGeo, skyBlueDimMat);
    guide.position.y = -0.6;
    dGroup.add(guide);

    // Distinct Domain Geometry Artifact
    if (dp.key === 'rag') {
      // 3 Stacked Knowledge/Vector Platters
      for (let s = 0; s < 3; s++) {
        const plat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.48), glassMat);
        plat.position.y = (s - 1) * 0.18;
        dGroup.add(plat);

        const border = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.015, 0.5), skyBlueLedMat);
        border.position.y = (s - 1) * 0.18;
        dGroup.add(border);
      }
    } else if (dp.key === 'agents') {
      // Gyroscopic Planning Core
      const gOuter = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 16, 32), glassMat);
      dGroup.add(gOuter);
      const gInner = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.018, 16, 32), skyBlueLedMat);
      gInner.rotation.x = Math.PI / 2;
      dGroup.add(gInner);
      const agentSpark = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), sparkMat);
      dGroup.add(agentSpark);
    } else if (dp.key === 'vision') {
      // Optical Perception Aperture
      const optRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 16, 32), softGrayMat);
      dGroup.add(optRing);
      const optLens = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), glassMat);
      dGroup.add(optLens);
      const iris = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.16, 16), skyBlueLedMat);
      iris.position.z = 0.12;
      dGroup.add(iris);
    } else if (dp.key === 'nlp') {
      // Semantic Language Polyhedron
      const poly = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), glassMat);
      dGroup.add(poly);
      const polyWire = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), wireMat);
      dGroup.add(polyWire);
    }

    aiEngineeringGroup.add(dGroup);
    domainGroups.push(dGroup);
  });

  // ═══ 4. GLOWING ENERGY CONDUITS FROM CORE TO DOMAINS ═══
  const conduitMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });

  domainPositions.forEach((dp) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(dp.pos.x * 0.5, -0.2, dp.pos.z * 0.5),
      new THREE.Vector3(dp.pos.x, dp.pos.y - 0.2, dp.pos.z)
    );
    const points = curve.getPoints(32);
    const cGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(cGeo, conduitMat);
    aiEngineeringGroup.add(line);
  });

  // Traveling Conduit Data Pulses
  const dPulseCount = 24;
  const dPulseGeo = new THREE.BufferGeometry();
  const dPulsePos = new Float32Array(dPulseCount * 3);
  const dPulseData = [];

  for (let i = 0; i < dPulseCount; i++) {
    const targetDP = domainPositions[i % domainPositions.length];
    dPulseData.push({
      progress: Math.random(),
      speed: 0.35 + Math.random() * 0.45,
      target: targetDP.pos
    });
  }
  dPulseGeo.setAttribute('position', new THREE.BufferAttribute(dPulsePos, 3));
  const dPulseMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const domainPulses = new THREE.Points(dPulseGeo, dPulseMat);
  aiEngineeringGroup.add(domainPulses);

  scene.add(aiEngineeringGroup);

  /**
   * Update animation loop for Chapter 05
   */
  function update(delta, elapsedTime, scrollProgress, isCh5Active, ch5Local, camera) {
    if (!isCh5Active) {
      aiEngineeringGroup.visible = false;
      if (ch05Container) {
        ch05Container.classList.remove('active');
        ch05Container.style.visibility = 'hidden';
        ch05Container.style.opacity = '0';
      }
      return;
    }

    aiEngineeringGroup.visible = true;
    if (ch05Container) {
      ch05Container.classList.add('active');
      ch05Container.style.visibility = 'visible';
      ch05Container.style.opacity = '1';
    }

    const ch05p = ch5Local !== undefined ? ch5Local : Math.max(Math.min((scrollProgress - 0.6) / 0.16, 1.0), 0.0);

    // ═══ PHASE 0: HERO STATE (ch05p 0.00 -> 0.25) ═══
    if (titleBlock) {
      const heroOpacity = Math.min(Math.max(ch05p / 0.15, 0), 1.0);
      titleBlock.classList.add('visible');
      titleBlock.style.opacity = heroOpacity.toFixed(2);
    }

    // ═══ PHASE 1: 5-STAGE HORIZONTAL PIPELINE (ch05p 0.22 -> 0.52) ═══
    const inPipelinePhase = ch05p >= 0.20 && ch05p < 0.52;
    if (pipelineContainer) {
      pipelineContainer.classList.toggle('visible', inPipelinePhase);
      pipelineContainer.style.opacity = inPipelinePhase ? '1' : '0';
    }

    if (inPipelinePhase) {
      const pipeT = (ch05p - 0.20) / 0.32;
      const activeStageIdx = Math.min(Math.floor(pipeT * 5), 4);
      pipelineStages.forEach((st, i) => {
        if (st) st.classList.toggle('active', i === activeStageIdx);
      });
    }

    // ═══ PHASE 2: 2x2 AI ENGINEERING DOMAINS GRID (ch05p 0.50 -> 0.84) ═══
    const inDomainsPhase = ch05p >= 0.50 && ch05p < 0.84;
    if (domainsGridCard) {
      domainsGridCard.classList.toggle('visible', inDomainsPhase);
      domainsGridCard.style.opacity = inDomainsPhase ? '1' : '0';
    }

    if (inDomainsPhase) {
      const domT = (ch05p - 0.50) / 0.34;
      const activeDomIdx = Math.min(Math.floor(domT * 4), 3);
      domainBoxes.forEach((box, i) => {
        if (box) box.classList.toggle('active', i === activeDomIdx);
      });

      // Domain beacon highlight in 3D scene
      domainGroups.forEach((group, i) => {
        const isActive = i === activeDomIdx;
        const targetScale = isActive ? 1.15 : 0.88;
        const curScale = group.scale.x;
        const nScale = curScale + (targetScale - curScale) * 0.1;
        group.scale.set(nScale, nScale, nScale);

        if (domainPedestalRings[i]) {
          domainPedestalRings[i].material = isActive ? skyBlueLedMat : skyBlueDimMat;
        }
      });
    } else {
      domainGroups.forEach((g) => g.scale.set(1.0, 1.0, 1.0));
    }

    // ═══ PHASE 3: ENGINEERING PHILOSOPHY (ch05p 0.82 -> 1.00) ═══
    if (philosophy) {
      if (ch05p >= 0.82) {
        const philoFade = Math.min((ch05p - 0.82) / 0.1, 1.0);
        philosophy.classList.add('visible');
        philosophy.style.opacity = philoFade.toFixed(2);
      } else {
        philosophy.classList.remove('visible');
        philosophy.style.opacity = '0';
      }
    }

    // Scroll prompt
    if (scrollPrompt) {
      scrollPrompt.classList.toggle('visible', ch05p >= 0.15 && ch05p < 0.85);
    }

    // ═══ 3D MICRO-ANIMATIONS ═══
    coreRing1.rotation.z += 0.007;
    coreRing2.rotation.x += 0.005;
    coreNeuralSphere.rotation.y = elapsedTime * 0.2;
    neuralPoints.rotation.y = elapsedTime * 0.12;

    // Domain Beacons float & subtle rotations
    domainGroups.forEach((group, i) => {
      group.position.y = domainPositions[i].pos.y + Math.sin(elapsedTime * 1.2 + i * 0.9) * 0.02;
    });

    domainGroups[0].rotation.y = Math.sin(elapsedTime * 0.4) * 0.06; // RAG
    domainGroups[1].rotation.y = elapsedTime * 0.2; // Agents
    domainGroups[2].rotation.y = Math.sin(elapsedTime * 0.5) * 0.05; // Vision
    domainGroups[3].rotation.y = -elapsedTime * 0.18; // NLP

    // Traveling Pulses Update
    const posAttr = domainPulses.geometry.attributes.position;
    for (let i = 0; i < dPulseCount; i++) {
      const p = dPulseData[i];
      p.progress += p.speed * delta;
      if (p.progress >= 1.0) {
        p.progress = 0;
        p.target = domainPositions[Math.floor(Math.random() * domainPositions.length)].pos;
      }
      posAttr.setXYZ(i, p.target.x * p.progress, p.target.y * p.progress, p.target.z * p.progress);
    }
    posAttr.needsUpdate = true;
  }

  return {
    aiEngineeringGroup,
    update
  };
}
