import * as THREE from 'three';
import { getActiveChapter, getChapterProgress } from './chapterManager.js';

/**
 * Camera, Native Scroll Timeline & Safe Constrained Parallax Controller across Chapters 01 - 14.
 * Predictable, smooth, reversible 3D camera navigation.
 */
export function setupControls(camera, scrollTimelineEl) {
  let rawScrollProgress = 0;
  let smoothScrollProgress = 0;

  // Normalized mouse coords (-1 to +1)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const cameraBasePos = new THREE.Vector3(0, 1.2, 14.0);

  // Key Z positions along continuous 3D spatial corridor
  const START_Z  = 14.0;
  const CH2_Z    = -2.3;
  const CH3_Z    = -5.0;

  // --- 1. NATIVE BROWSER SCROLL LISTENER ---
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(
      (scrollTimelineEl ? scrollTimelineEl.offsetHeight : document.body.scrollHeight) - window.innerHeight,
      1
    );
    rawScrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- 2. MOUSE SPATIAL PARALLAX LISTENER ---
  function onMouseMove(event) {
    mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  // --- 3. FRAME UPDATE FUNCTION ---
  function update(delta) {
    // Smooth, predictable, highly responsive scroll interpolation
    smoothScrollProgress += (rawScrollProgress - smoothScrollProgress) * 0.22;

    // Smooth mouse parallax interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // ═══ CONTINUOUS CAMERA Z TRAJECTORY ACROSS ALL CHAPTERS ═══
    let currentZ = START_Z;
    let cameraY = cameraBasePos.y;

    if (smoothScrollProgress < 0.14) {
      // Ch01: Entrance
      const p = smoothScrollProgress / 0.14;
      currentZ = THREE.MathUtils.lerp(START_Z, 7.0, p);
      cameraY = cameraBasePos.y;
    } else if (smoothScrollProgress < 0.30) {
      // Ch02: Approach AI Core
      const p = (smoothScrollProgress - 0.14) / 0.16;
      currentZ = THREE.MathUtils.lerp(7.0, CH2_Z, p);
      cameraY = cameraBasePos.y;
    } else if (smoothScrollProgress < 0.44) {
      // Ch03: Enter AI Core shell, identity reconstruction
      const p = (smoothScrollProgress - 0.30) / 0.14;
      currentZ = THREE.MathUtils.lerp(CH2_Z, CH3_Z, p);
      cameraY = cameraBasePos.y;
    } else if (smoothScrollProgress < 0.48) {
      // Ch04 Phase A: PULL BACK from inside AI Core (Z = -5.0 -> -3.0)
      const p = (smoothScrollProgress - 0.44) / 0.04;
      currentZ = THREE.MathUtils.lerp(CH3_Z, -3.0, p);
      cameraY = THREE.MathUtils.lerp(cameraBasePos.y, 0.85, p);
    } else if (smoothScrollProgress < 0.60) {
      // Ch04 Phase B: Settle at Architecture Chamber observation distance
      const p = (smoothScrollProgress - 0.48) / 0.12;
      currentZ = THREE.MathUtils.lerp(-3.0, -3.6, p);
      cameraY = 0.85;
    } else if (smoothScrollProgress < 0.64) {
      // Ch05 Phase A: PUSH FORWARD into AI Intelligence Chamber (Z = -3.6 -> -6.8)
      const p = (smoothScrollProgress - 0.60) / 0.04;
      currentZ = THREE.MathUtils.lerp(-3.6, -6.8, p);
      cameraY = 0.85;
    } else if (smoothScrollProgress < 0.76) {
      // Ch05 Phase B: Intelligence Chamber observation distance (Z = -6.8 -> -7.2)
      const p = (smoothScrollProgress - 0.64) / 0.12;
      currentZ = THREE.MathUtils.lerp(-6.8, -7.2, p);
      cameraY = 0.85;
    } else if (smoothScrollProgress < 0.80) {
      // Ch06 Phase A: PUSH FORWARD into Data Knowledge Chamber (Z = -7.2 -> -10.5)
      const p = (smoothScrollProgress - 0.76) / 0.04;
      currentZ = THREE.MathUtils.lerp(-7.2, -10.5, p);
      cameraY = 0.85;
    } else if (smoothScrollProgress < 0.86) {
      // Ch06 Phase B: Data Knowledge Chamber observation distance (Z = -10.5 -> -11.0)
      const p = (smoothScrollProgress - 0.80) / 0.06;
      currentZ = THREE.MathUtils.lerp(-10.5, -11.0, p);
      cameraY = 0.85;
    } else {
      // Ch07+: Future chapters progression
      const p = (smoothScrollProgress - 0.86) / 0.14;
      currentZ = THREE.MathUtils.lerp(-11.0, -14.5, p);
      cameraY = 0.85;
    }

    // ═══ SAFE CONSTRAINED MOUSE PARALLAX (NEVER DISORIENTING) ═══
    const inChambers = smoothScrollProgress >= 0.44;
    const parallaxX = mouse.x * (inChambers ? 0.12 : 0.28);
    const parallaxY = mouse.y * (inChambers ? 0.05 : 0.18); // strictly <= 0.06 in chambers

    camera.position.x = parallaxX;
    camera.position.y = cameraY + parallaxY;
    camera.position.z = currentZ;

    // ═══ CAMERA LOOK-AT ═══
    let lookAtTarget;
    if (smoothScrollProgress >= 0.76) {
      // Chapter 06: Look at Data Knowledge Chamber center (Z = -17.0)
      lookAtTarget = new THREE.Vector3(parallaxX * 0.05, 0.7 + parallaxY * 0.05, -17.0);
    } else if (smoothScrollProgress >= 0.60) {
      // Chapter 05: Look at AI Intelligence Chamber center (Z = -13.0)
      lookAtTarget = new THREE.Vector3(parallaxX * 0.05, 0.7 + parallaxY * 0.05, -13.0);
    } else if (smoothScrollProgress >= 0.44) {
      // Chapter 04: Look directly at central System Architecture (Z = -9.2)
      lookAtTarget = new THREE.Vector3(parallaxX * 0.05, 0.7 + parallaxY * 0.05, -9.2);
    } else {
      lookAtTarget = new THREE.Vector3(parallaxX * 0.10, cameraBasePos.y + parallaxY * 0.10, CH3_Z);
    }
    camera.lookAt(lookAtTarget);

    // ═══ FOV PULSE ═══
    if (smoothScrollProgress >= 0.30 && smoothScrollProgress <= 0.40) {
      // Shell Crossing pulse (Ch03 entry)
      const entryPeak = Math.sin(((smoothScrollProgress - 0.30) / 0.10) * Math.PI);
      camera.fov = 45 + entryPeak * 6.0;
    } else if (smoothScrollProgress >= 0.44 && smoothScrollProgress < 0.50) {
      const wideFov = Math.min((smoothScrollProgress - 0.44) / 0.06, 1.0);
      camera.fov = 45 + wideFov * 4.0;
    } else if (smoothScrollProgress >= 0.50 && smoothScrollProgress < 0.60) {
      camera.fov = 49;
    } else if (smoothScrollProgress >= 0.60 && smoothScrollProgress < 0.76) {
      camera.fov = 47;
    } else if (smoothScrollProgress >= 0.76) {
      camera.fov = 46;
    } else {
      camera.fov = 45;
    }
    camera.updateProjectionMatrix();

    return {
      rawScrollProgress,
      smoothScrollProgress,
      mouseX: mouse.x,
      mouseY: mouse.y
    };
  }

  return {
    update,
    getScrollProgress: () => smoothScrollProgress
  };
}
