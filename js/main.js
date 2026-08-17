import * as THREE from 'three';
import { createLaboratoryEnvironment } from './laboratory.js';
import { createAICore } from './aiCore.js';
import { createSystemArchitecture } from './architecture.js';
import { createAIEngineering } from './aiEngineering.js';
import { createDataKnowledge } from './dataKnowledge.js';
import { ChapterManager } from './chapterManager.js';
import { setupControls } from './controls.js';

/**
 * Main Application Bootstrapper for The AI Laboratory.
 * Orchestrates WebGLRenderer, Scene, Lighting, Laboratory Architecture, AI Core,
 * Chapter 04 Architecture, Chapter 05 AI Engineering, Chapter 06 Data Knowledge,
 * Chapter State Lifecycle Manager, and Camera Controls.
 */
class AILaboratoryApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.scrollTimeline = document.getElementById('scroll-timeline');

    this.clock = new THREE.Clock();
    this.initScene();
    this.initLighting();
    this.initModules();
    this.initEventListeners();
    this.animate();
  }

  initScene() {
    // --- 1. RENDERER SETUP ---
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 2. SCENE & ATMOSPHERIC WHITE FOG ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff); // Clinical White background
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.012); // Soft white atmospheric depth

    // --- 3. CAMERA SETUP ---
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.2, 14.0);
    this.scene.add(this.camera);
  }

  initLighting() {
    // Soft White Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    // Key Directional Light (Soft top-front architectural lighting)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    this.keyLight.position.set(5, 15, 10);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.0001;
    this.scene.add(this.keyLight);

    // Sky Blue Secondary Fill Light (Soft environment reflection)
    this.fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    this.fillLight.position.set(-8, 6, -5);
    this.scene.add(this.fillLight);
  }

  initModules() {
    // Central Chapter Lifecycle Manager
    this.chapterManager = new ChapterManager();

    // Build 3D Futuristic AI Research Laboratory Environment
    this.laboratory = createLaboratoryEnvironment(this.scene);

    // Build True 3D AI Core & Chapter 03 Internal Neural Chamber
    this.aiCore = createAICore(this.scene);

    // Build Chapter 04 System Architecture Chamber
    this.architecture = createSystemArchitecture(this.scene);

    // Build Chapter 05 AI Engineering / Intelligence Chamber
    this.aiEngineering = createAIEngineering(this.scene);

    // Build Chapter 06 Data & Knowledge Infrastructure Chamber
    this.dataKnowledge = createDataKnowledge(this.scene);

    // Setup Camera, Scroll Progress & Spatial Parallax Controls
    this.controls = setupControls(this.camera, this.scrollTimeline);
  }

  initEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Controls (Camera position lerp, FOV pulse & mouse spatial parallax)
    const { smoothScrollProgress, mouseX, mouseY } = this.controls.update(delta);

    // 2. Centralized Chapter State & Strict UI Isolation
    const { activeChapter, ch3Progress, ch4Progress, ch5Progress, ch6Progress } =
      this.chapterManager.update(smoothScrollProgress);

    // 3. Laboratory Architecture Corridor Clearance
    if (this.laboratory && this.laboratory.update) {
      this.laboratory.update(delta, smoothScrollProgress, mouseX, mouseY);
    }

    // 4. Update Chapter 03 AI Core & Identity Chamber
    if (this.aiCore && this.aiCore.update) {
      this.aiCore.update(delta, elapsedTime, smoothScrollProgress, ch3Progress, activeChapter === 3);
    }

    // 5. Update Chapter 04 System Architecture Chamber
    if (this.architecture && this.architecture.update) {
      this.architecture.update(
        delta,
        elapsedTime,
        smoothScrollProgress,
        activeChapter === 4,
        ch4Progress,
        this.camera
      );
    }

    // 6. Update Chapter 05 AI Engineering Chamber
    if (this.aiEngineering && this.aiEngineering.update) {
      this.aiEngineering.update(
        delta,
        elapsedTime,
        smoothScrollProgress,
        activeChapter === 5,
        ch5Progress,
        this.camera
      );
    }

    // 7. Update Chapter 06 Data & Knowledge Infrastructure Chamber
    if (this.dataKnowledge && this.dataKnowledge.update) {
      this.dataKnowledge.update(
        delta,
        elapsedTime,
        smoothScrollProgress,
        activeChapter === 6,
        ch6Progress,
        this.camera
      );
    }

    // 8. Render 3D Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Boot application on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new AILaboratoryApp();
});
