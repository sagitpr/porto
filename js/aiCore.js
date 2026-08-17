import * as THREE from 'three';

/**
 * Creates the True 3D AI Core & Chapter 03 Holographic Identity Reconstruction Chamber.
 *
 * Implements:
 * - Chapter 03 Local Timeline (localT: 0.00 -> 1.00)
 * - 0.00 -> 0.15: Identity chamber awakens
 * - 0.15 -> 0.30: Neural particles converge into core
 * - 0.30 -> 0.45: Draggable Holographic ID Card reconstructs
 * - 0.45 -> 0.58: Name SAGIT FATURRAKHMAN emerges
 * - 0.58 -> 0.70: SOFTWARE ENGINEER · AI ENGINEER appears
 * - 0.70 -> 0.84: Educational Journey appears (SMK Negeri Rajapolah DPIB -> Universitas BTH)
 * - 0.84 -> 0.94: Transition story: Physical Space -> Digital Space -> Intelligent Systems
 * - 0.94 -> 1.00: Closing motto: "FROM DESIGNING STRUCTURES TO DESIGNING INTELLIGENT SYSTEMS."
 * - Interactive Click + Drag with 3D tilt and spring-damped return.
 * - AI Core recession when exiting into Chapter 04 (scrollProgress >= 0.44).
 */
export function createAICore(scene) {
  const coreGroup = new THREE.Group();
  coreGroup.name = 'AICore';

  // Core Center Position (Floating at Z = -5, Y = 1.2)
  const CORE_CENTER = new THREE.Vector3(0, 1.2, -5);
  coreGroup.position.copy(CORE_CENTER);

  // DOM Elements Hooks
  const coreIdentityReveal = document.getElementById('core-identity-reveal');
  const ch03TitleBlock = document.getElementById('ch03-title-block');
  const ch03ContentGrid = document.getElementById('ch03-content-grid');
  const idCard = document.getElementById('ch03-id-card');
  const photoScanline = document.getElementById('id-photo-scanline');
  const reconName = document.getElementById('recon-name');
  const reconSubtitle = document.getElementById('recon-subtitle');
  const timelineCard = document.getElementById('ch03-timeline-card');
  const step1 = document.getElementById('ch03-step-1');
  const step2 = document.getElementById('ch03-step-2');
  const step3 = document.getElementById('ch03-step-3');
  const storyBanner = document.getElementById('ch03-story-banner');
  const ch03ScrollPrompt = document.getElementById('ch03-scroll-prompt');

  // --- INTERACTIVE DRAGGABLE ID CARD STATE ---
  let isDragging = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let currentDragX = 0;
  let currentDragY = 0;
  let targetDragX = 0;
  let targetDragY = 0;

  if (idCard) {
    const onPointerDown = (e) => {
      isDragging = true;
      idCard.classList.add('dragging');
      startPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - startPointerX;
      const deltaY = clientY - startPointerY;

      // Clamp drag within safe bounds (X: ±120px, Y: ±70px)
      targetDragX = Math.max(Math.min(deltaX, 120), -120);
      targetDragY = Math.max(Math.min(deltaY, 70), -70);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      idCard.classList.remove('dragging');
      // Damped spring return to center
      targetDragX = 0;
      targetDragY = 0;
    };

    idCard.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  // --- 1. OUTER REFRACTIVE GLASS SPHERE SHELL ---
  const shellRadius = 2.4;
  const shellGeo = new THREE.SphereGeometry(shellRadius, 64, 64);
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.28,
    transmission: 0.92,
    roughness: 0.04,
    metalness: 0.08,
    ior: 1.35,
    reflectivity: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide
  });

  const outerShell = new THREE.Mesh(shellGeo, shellMat);
  coreGroup.add(outerShell);

  // Inner Energy Field Glow Sphere
  const innerGlowGeo = new THREE.SphereGeometry(shellRadius * 0.90, 32, 32);
  const innerGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
  coreGroup.add(innerGlow);

  // --- 2. SPATIAL 3D NEURAL NETWORK ---
  const nodeCount = 56;
  const nodePositions = [];
  const nodesGroup = new THREE.Group();

  const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.2,
    roughness: 0.15
  });

  const nodeInstanced = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < nodeCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.pow(Math.random(), 0.65) * 1.75 + 0.2;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const pos = new THREE.Vector3(x, y, z);
    nodePositions.push(pos);

    const scale = 0.6 + Math.random() * 0.9;
    dummy.position.copy(pos);
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    nodeInstanced.setMatrixAt(i, dummy.matrix);
  }
  nodeInstanced.instanceMatrix.needsUpdate = true;
  nodesGroup.add(nodeInstanced);
  coreGroup.add(nodesGroup);

  // 3D Connection Lines
  const linePositions = [];
  const connections = [];

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < 1.2) {
        linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
        linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        connections.push({
          from: nodePositions[i],
          to: nodePositions[j],
          dist: dist
        });
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  const networkLines = new THREE.LineSegments(lineGeo, lineMat);
  coreGroup.add(networkLines);

  // Animated Data Light Pulses
  const pulseCount = 40;
  const pulseGeo = new THREE.BufferGeometry();
  const pulsePositions = new Float32Array(pulseCount * 3);
  const pulseData = [];

  for (let i = 0; i < pulseCount; i++) {
    const conn = connections[Math.floor(Math.random() * connections.length)];
    pulseData.push({
      conn: conn,
      progress: Math.random(),
      speed: 0.35 + Math.random() * 0.65
    });
  }

  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
  const pulseMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.14,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  const pulseParticles = new THREE.Points(pulseGeo, pulseMat);
  coreGroup.add(pulseParticles);

  // --- 3. ASYNCHRONOUS ORBITAL RINGS ---
  const ring1Geo = new THREE.TorusGeometry(shellRadius * 1.25, 0.02, 16, 120);
  const ring2Geo = new THREE.TorusGeometry(shellRadius * 1.45, 0.015, 16, 120);
  const ring3Geo = new THREE.TorusGeometry(shellRadius * 1.7, 0.012, 16, 120);

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.8
  });

  const ring1 = new THREE.Mesh(ring1Geo, ringMat);
  const ring2 = new THREE.Mesh(ring2Geo, ringMat);
  const ring3 = new THREE.Mesh(ring3Geo, ringMat);

  coreGroup.add(ring1);
  coreGroup.add(ring2);
  coreGroup.add(ring3);

  // --- 4. FLOATING QUANTUM AMBIENT PARTICLES ---
  const partCount = 180;
  const partGeo = new THREE.BufferGeometry();
  const partPositions = new Float32Array(partCount * 3);
  const partVelocities = [];

  for (let i = 0; i < partCount; i++) {
    const r = 0.5 + Math.random() * 4.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    partPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    partPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    partPositions[i * 3 + 2] = r * Math.cos(phi);

    partVelocities.push({
      thetaSpeed: (Math.random() - 0.5) * 0.4,
      phiSpeed: (Math.random() - 0.5) * 0.3,
      r: r,
      theta: theta,
      phi: phi
    });
  }

  partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.07,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const floatingParticles = new THREE.Points(partGeo, partMat);
  coreGroup.add(floatingParticles);

  // --- 5. POINT LIGHT CORE EMITTER ---
  const coreLight = new THREE.PointLight(0x38bdf8, 8.5, 25);
  coreLight.position.set(0, 0, 0);
  coreGroup.add(coreLight);

  scene.add(coreGroup);

  /**
   * Update animation loop for AI Core & Chapter 03 Identity Chamber
   */
  function update(delta, elapsedTime, scrollProgress, ch3Progress, isCh3Active) {
    // 1. Continuous Orbital Rotations
    ring1.rotation.x = elapsedTime * 0.35;
    ring1.rotation.y = elapsedTime * 0.22;

    ring2.rotation.y = -elapsedTime * 0.28;
    ring2.rotation.z = elapsedTime * 0.42;

    ring3.rotation.x = Math.sin(elapsedTime * 0.25) * 0.5;
    ring3.rotation.z = -elapsedTime * 0.2;

    nodesGroup.rotation.y = elapsedTime * 0.12;
    networkLines.rotation.y = elapsedTime * 0.12;

    // 2. Light Pulses Animation
    const pPos = pulseGeo.attributes.position.array;
    for (let i = 0; i < pulseCount; i++) {
      const p = pulseData[i];
      p.progress += delta * p.speed;
      if (p.progress > 1.0) p.progress = 0.0;

      const currentPos = new THREE.Vector3().lerpVectors(p.conn.from, p.conn.to, p.progress);
      currentPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), nodesGroup.rotation.y);

      pPos[i * 3] = currentPos.x;
      pPos[i * 3 + 1] = currentPos.y;
      pPos[i * 3 + 2] = currentPos.z;
    }
    pulseGeo.attributes.position.needsUpdate = true;

    // 3. Ambient Particles Flow
    const aPos = partGeo.attributes.position.array;
    for (let i = 0; i < partCount; i++) {
      const v = partVelocities[i];
      v.theta += v.thetaSpeed * delta;
      v.phi += v.phiSpeed * delta;

      aPos[i * 3] = v.r * Math.sin(v.phi) * Math.cos(v.theta);
      aPos[i * 3 + 1] = v.r * Math.sin(v.phi) * Math.sin(v.theta);
      aPos[i * 3 + 2] = v.r * Math.cos(v.phi);
    }
    partGeo.attributes.position.needsUpdate = true;

    // 4. Interactive Draggable ID Card Damped Spring Physics
    if (idCard) {
      currentDragX += (targetDragX - currentDragX) * 0.15;
      currentDragY += (targetDragY - currentDragY) * 0.15;

      const tiltX = -currentDragY * 0.12;
      const tiltY = currentDragX * 0.12;

      idCard.style.transform = `translate3d(${currentDragX.toFixed(2)}px, ${currentDragY.toFixed(2)}px, 0) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    }

    // 5. Chapter 03 Local Timeline & Progressive Identity Reveal
    if (isCh3Active) {
      if (coreIdentityReveal) {
        coreIdentityReveal.classList.add('active');
        coreIdentityReveal.style.opacity = '1';
        coreIdentityReveal.style.visibility = 'visible';
      }

      const t = ch3Progress !== undefined ? ch3Progress : (scrollProgress - 0.30) / 0.14;

      // 0.00 -> 0.20: Header fade in
      if (ch03TitleBlock) {
        const hOpacity = Math.min(Math.max(t / 0.18, 0), 1.0);
        ch03TitleBlock.style.opacity = hOpacity.toFixed(2);
      }

      // 0.15 -> 0.40: ID Card fade in
      if (idCard) {
        const idOpacity = Math.min(Math.max((t - 0.15) / 0.20, 0), 1.0);
        idCard.style.opacity = idOpacity.toFixed(2);
      }

      // 0.35 -> 0.65: Educational Timeline Card fade in
      if (timelineCard) {
        const tOpacity = Math.min(Math.max((t - 0.35) / 0.20, 0), 1.0);
        timelineCard.style.opacity = tOpacity.toFixed(2);
      }

      // 0.45 -> 0.70: Step 1 active
      if (step1) {
        step1.style.opacity = t >= 0.45 ? '1' : '0.4';
      }
      // 0.60 -> 0.85: Step 2 active
      if (step2) {
        step2.style.opacity = t >= 0.60 ? '1' : '0.4';
      }
      // 0.75 -> 1.00: Step 3 & Story banner active
      if (step3) {
        step3.style.opacity = t >= 0.75 ? '1' : '0.4';
      }
      if (storyBanner) {
        storyBanner.style.opacity = t >= 0.82 ? '1' : '0.3';
      }

      // 0.85 -> 1.00: Scroll prompt visible
      if (ch03ScrollPrompt) {
        ch03ScrollPrompt.style.opacity = t >= 0.85 ? '1' : '0';
      }
    } else {
      if (coreIdentityReveal) {
        coreIdentityReveal.classList.remove('active');
        coreIdentityReveal.style.opacity = '0';
        coreIdentityReveal.style.visibility = 'hidden';
      }
    }

    // 6. AI Core Recession when entering Chapter 04+ (scrollProgress >= 0.44)
    if (scrollProgress >= 0.44) {
      const recessionProgress = Math.min((scrollProgress - 0.44) / 0.08, 1.0);

      // Scale down smoothly
      const coreScale = 1.0 - recessionProgress * 0.75;
      coreGroup.scale.set(coreScale, coreScale, coreScale);

      // Shift backward and slightly down to clear central corridor
      coreGroup.position.z = CORE_CENTER.z - recessionProgress * 3.5;
      coreGroup.position.y =
        CORE_CENTER.y -
        recessionProgress * 0.6 +
        Math.sin(elapsedTime * 1.4) * 0.16 * (1 - recessionProgress);

      // Fade materials
      coreLight.intensity = Math.max(8.5 * (1 - recessionProgress * 0.85), 0.8);
      shellMat.opacity = Math.max(0.28 * (1 - recessionProgress), 0.0);
      innerGlowMat.opacity = Math.max(0.15 * (1 - recessionProgress * 0.8), 0.02);
      lineMat.opacity = Math.max(0.5 * (1 - recessionProgress * 0.7), 0.08);
      ringMat.opacity = Math.max(0.8 * (1 - recessionProgress * 0.8), 0.05);
      pulseMat.opacity = Math.max(0.95 * (1 - recessionProgress * 0.8), 0.05);
      partMat.opacity = Math.max(0.65 * (1 - recessionProgress * 0.8), 0.05);
    } else {
      // Reset core state when in Ch01-Ch03
      coreGroup.scale.set(1, 1, 1);
      coreGroup.position.z = CORE_CENTER.z;
      coreGroup.position.y = CORE_CENTER.y + Math.sin(elapsedTime * 1.4) * 0.12;

      coreLight.intensity = 8.5;
      shellMat.opacity = 0.28;
      innerGlowMat.opacity = 0.15;
      lineMat.opacity = 0.5;
      ringMat.opacity = 0.8;
      pulseMat.opacity = 0.95;
      partMat.opacity = 0.65;
    }
  }

  return {
    coreGroup,
    coreLight,
    update
  };
}
