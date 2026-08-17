import * as THREE from 'three';

/**
 * Creates the 3D Futuristic AI Research Laboratory Environment.
 * Exposes layered spatial sub-groups (Foreground, Midground, Background) for distinct mouse spatial depth parallax.
 */
export function createLaboratoryEnvironment(scene) {
  const labGroup = new THREE.Group();
  labGroup.name = 'LaboratoryEnvironment';

  const foregroundGroup = new THREE.Group();
  foregroundGroup.name = 'ForegroundLayer';

  const midgroundGroup = new THREE.Group();
  midgroundGroup.name = 'MidgroundLayer';

  const backgroundGroup = new THREE.Group();
  backgroundGroup.name = 'BackgroundLayer';

  // --- 1. PROCEDURAL POLISHED WHITE FLOOR WITH SEAMS ---
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1024, 1024);

  // Floor grid seams
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
  ctx.lineWidth = 1.5;
  const gridSize = 128;
  for (let x = 0; x <= 1024; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(1024, x);
    ctx.stroke();
  }

  // Accent circular floor rings
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 512, 400, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 512, 240, 0, Math.PI * 2);
  ctx.stroke();

  const floorTexture = new THREE.CanvasTexture(canvas);
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(8, 16);

  // FOREGROUND LAYER: HIGH-GLOSS REFLECTIVE FLOOR PLANE
  const floorGeo = new THREE.PlaneGeometry(60, 120);
  const floorMat = new THREE.MeshPhysicalMaterial({
    map: floorTexture,
    color: 0xffffff,
    roughness: 0.06,
    metalness: 0.02,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
    reflectivity: 0.92,
    side: THREE.DoubleSide
  });

  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3.5, -20);
  floor.receiveShadow = true;
  foregroundGroup.add(floor);

  // Recessed Floor Channels (Left & Right LED Strips)
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.8,
    roughness: 0.1
  });

  const leftEdgeGeo = new THREE.BoxGeometry(0.35, 0.1, 120);
  const leftEdge = new THREE.Mesh(leftEdgeGeo, edgeMat);
  leftEdge.position.set(-18, -3.45, -20);
  foregroundGroup.add(leftEdge);

  const rightEdge = new THREE.Mesh(leftEdgeGeo, edgeMat);
  rightEdge.position.set(18, -3.45, -20);
  foregroundGroup.add(rightEdge);

  // --- 2. MIDGROUND LAYER: ARCHITECTURAL PILLARS, RECESSED WALL PANELS & LIGHT BARS ---
  const wallMatMatte = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.05
  });

  const wallMatGlass = new THREE.MeshPhysicalMaterial({
    color: 0xeaf8ff,
    transparent: true,
    opacity: 0.45,
    transmission: 0.85,
    roughness: 0.08,
    ior: 1.4
  });

  const pillarPositionsZ = [10, 2, -6, -14, -22, -30];
  const pillarGeo = new THREE.CylinderGeometry(0.85, 1.25, 16, 16);
  const vLightGeo = new THREE.BoxGeometry(0.1, 14, 0.1);

  pillarPositionsZ.forEach((posZ, idx) => {
    // Left Pillar
    const leftPillar = new THREE.Mesh(pillarGeo, wallMatMatte);
    leftPillar.position.set(-12, 4.5, posZ);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    midgroundGroup.add(leftPillar);

    const leftVLight = new THREE.Mesh(vLightGeo, edgeMat);
    leftVLight.position.set(-10.75, 4.5, posZ + 0.9);
    midgroundGroup.add(leftVLight);

    // Right Pillar
    const rightPillar = new THREE.Mesh(pillarGeo, wallMatMatte);
    rightPillar.position.set(12, 4.5, posZ);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    midgroundGroup.add(rightPillar);

    const rightVLight = new THREE.Mesh(vLightGeo, edgeMat);
    rightVLight.position.set(10.75, 4.5, posZ + 0.9);
    midgroundGroup.add(rightVLight);

    // Architectural Arch Beam
    const archGeo = new THREE.BoxGeometry(26, 0.6, 0.8);
    const arch = new THREE.Mesh(archGeo, wallMatMatte);
    arch.position.set(0, 11.5, posZ);
    midgroundGroup.add(arch);

    const archLedGeo = new THREE.BoxGeometry(25.8, 0.12, 0.12);
    const archLed = new THREE.Mesh(archLedGeo, edgeMat);
    archLed.position.set(0, 11.15, posZ + 0.35);
    midgroundGroup.add(archLed);

    // Recessed Wall Panels
    if (idx % 2 === 0) {
      const panelGeo = new THREE.BoxGeometry(0.2, 8, 4);
      const leftRecessed = new THREE.Mesh(panelGeo, wallMatMatte);
      leftRecessed.position.set(-14.5, 3.5, posZ);
      midgroundGroup.add(leftRecessed);

      const rightRecessed = new THREE.Mesh(panelGeo, wallMatMatte);
      rightRecessed.position.set(14.5, 3.5, posZ);
      midgroundGroup.add(rightRecessed);
    }
  });

  // Side Glass Telemetry Consoles
  const consoleGeo = new THREE.BoxGeometry(2.5, 3, 6);
  const glassPanelGeo = new THREE.PlaneGeometry(2.2, 2.5);

  [-8, -18].forEach((posZ) => {
    const leftConsole = new THREE.Mesh(consoleGeo, wallMatMatte);
    leftConsole.position.set(-10, -2, posZ);
    midgroundGroup.add(leftConsole);

    const leftScreen = new THREE.Mesh(glassPanelGeo, wallMatGlass);
    leftScreen.position.set(-8.7, -0.5, posZ);
    leftScreen.rotation.y = Math.PI / 3;
    midgroundGroup.add(leftScreen);

    const rightConsole = new THREE.Mesh(consoleGeo, wallMatMatte);
    rightConsole.position.set(10, -2, posZ);
    midgroundGroup.add(rightConsole);

    const rightScreen = new THREE.Mesh(glassPanelGeo, wallMatGlass);
    rightScreen.position.set(8.7, -0.5, posZ);
    rightScreen.rotation.y = -Math.PI / 3;
    midgroundGroup.add(rightScreen);
  });

  // --- 3. BACKGROUND LAYER: MULTI-TIER PEDESTAL, CEILING DOME & DISTANT ARCHITECTURE ---

  const platformTier1 = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7.5, 0.4, 64),
    wallMatMatte
  );
  platformTier1.position.set(0, -3.3, -5);
  platformTier1.receiveShadow = true;
  backgroundGroup.add(platformTier1);

  const platformTier2 = new THREE.Mesh(
    new THREE.CylinderGeometry(5.2, 5.5, 0.3, 64),
    wallMatMatte
  );
  platformTier2.position.set(0, -2.95, -5);
  platformTier2.receiveShadow = true;
  backgroundGroup.add(platformTier2);

  const ringLedGeo = new THREE.TorusGeometry(5.35, 0.08, 16, 100);
  const ringLed = new THREE.Mesh(ringLedGeo, edgeMat);
  ringLed.rotation.x = Math.PI / 2;
  ringLed.position.set(0, -2.8, -5);
  backgroundGroup.add(ringLed);

  const platformTier3 = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.8, 0.25, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 0.95
    })
  );
  platformTier3.position.set(0, -2.68, -5);
  backgroundGroup.add(platformTier3);

  // Circular Ceiling Structure
  const ceilingRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.3, 16, 100),
    wallMatMatte
  );
  ceilingRing1.rotation.x = Math.PI / 2;
  ceilingRing1.position.set(0, 11, -5);
  backgroundGroup.add(ceilingRing1);

  const ceilingRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.15, 16, 100),
    edgeMat
  );
  ceilingRing2.rotation.x = Math.PI / 2;
  ceilingRing2.position.set(0, 10.8, -5);
  backgroundGroup.add(ceilingRing2);

  const ceilingRing3 = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.12, 16, 100),
    edgeMat
  );
  ceilingRing3.rotation.x = Math.PI / 2;
  ceilingRing3.position.set(0, 10.6, -5);
  backgroundGroup.add(ceilingRing3);

  // Downward Light Beam
  const beamGeo = new THREE.CylinderGeometry(3.2, 5.2, 13.5, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.04,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const lightBeam = new THREE.Mesh(beamGeo, beamMat);
  lightBeam.position.set(0, 4, -5);
  backgroundGroup.add(lightBeam);

  // Distant End Wall & Aperture
  const endWallGeo = new THREE.PlaneGeometry(60, 30);
  const endWallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.55
  });
  const endWall = new THREE.Mesh(endWallGeo, endWallMat);
  endWall.position.set(0, 10, -45);
  backgroundGroup.add(endWall);

  const apertureGeo = new THREE.RingGeometry(0, 10, 64);
  const apertureMat = new THREE.MeshBasicMaterial({
    color: 0xeaf8ff,
    side: THREE.DoubleSide
  });
  const aperture = new THREE.Mesh(apertureGeo, apertureMat);
  aperture.position.set(0, 4, -44.8);
  backgroundGroup.add(aperture);

  labGroup.add(foregroundGroup);
  labGroup.add(midgroundGroup);
  labGroup.add(backgroundGroup);

  scene.add(labGroup);

  // Layer Parallax and Chapter Visibility update helper
  function update(delta, scrollProgress, mouseX, mouseY) {
    // Parallax
    foregroundGroup.position.x = mouseX * 0.45;
    foregroundGroup.position.y = mouseY * 0.25;

    midgroundGroup.position.x = mouseX * 0.22;
    midgroundGroup.position.y = mouseY * 0.12;

    backgroundGroup.position.x = mouseX * 0.05;
    backgroundGroup.position.y = mouseY * 0.02;

    // --- CHAPTER 04+ OBSTRUCTION CLEARANCE ---
    // When entering Chapter 04, 05, 06 (scrollProgress >= 0.44), smoothly push midground pillars
    // and foreground elements completely away so the central corridor is 100% open and unobstructed.
    if (scrollProgress >= 0.44) {
      const clearProgress = Math.min((scrollProgress - 0.44) / 0.06, 1.0);
      midgroundGroup.position.y = THREE.MathUtils.lerp(0, -28.0, clearProgress);
      midgroundGroup.scale.x = THREE.MathUtils.lerp(1.0, 2.5, clearProgress);
      backgroundGroup.position.y = THREE.MathUtils.lerp(0, -22.0, clearProgress);
    } else {
      midgroundGroup.position.y = 0;
      midgroundGroup.scale.x = 1.0;
      backgroundGroup.position.y = 0;
    }
  }

  function updateLayerParallax(mouseX, mouseY) {
    update(0.016, 0, mouseX, mouseY);
  }

  return {
    labGroup,
    foregroundGroup,
    midgroundGroup,
    backgroundGroup,
    update,
    updateLayerParallax
  };
}
