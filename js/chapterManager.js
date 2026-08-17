/**
 * Chapter Lifecycle and Central Timeline State Manager for The AI Laboratory.
 * Enforces strict single-chapter UI active state and normalized local progress calculation.
 */

export const CHAPTER_INTERVALS = [
  { id: 1, name: 'Laboratory Entry',                    start: 0.00, end: 0.14 },
  { id: 2, name: 'Approach to AI Core',                 start: 0.14, end: 0.30 },
  { id: 3, name: 'Identity Reconstruction',             start: 0.30, end: 0.44 },
  { id: 4, name: 'System Architecture',                 start: 0.44, end: 0.60 },
  { id: 5, name: 'AI Engineering',                      start: 0.60, end: 0.76 },
  { id: 6, name: 'Data & Knowledge Infrastructure',     start: 0.76, end: 0.86 },
  { id: 7, name: 'Intelligence Delivery',               start: 0.86, end: 0.92 },
  { id: 8, name: 'System Performance',                  start: 0.92, end: 0.95 },
  { id: 9, name: 'Security & Governance',               start: 0.95, end: 0.97 },
  { id: 10, name: 'Scale & Reliability',                start: 0.97, end: 0.985 },
  { id: 11, name: 'Engineering Philosophy',             start: 0.985, end: 0.992 },
  { id: 12, name: 'Selected Work',                      start: 0.992, end: 0.996 },
  { id: 13, name: 'Experience & Credentials',           start: 0.996, end: 0.999 },
  { id: 14, name: 'Laboratory Terminal / Contact',       start: 0.999, end: 1.000 },
];

export function getActiveChapter(progress) {
  for (let i = 0; i < CHAPTER_INTERVALS.length; i++) {
    const ch = CHAPTER_INTERVALS[i];
    if (progress >= ch.start && (progress < ch.end || i === CHAPTER_INTERVALS.length - 1)) {
      return ch.id;
    }
  }
  return 1;
}

export function getChapterProgress(progress, chapterId) {
  const ch = CHAPTER_INTERVALS.find(c => c.id === chapterId);
  if (!ch) return 0;
  if (progress <= ch.start) return 0;
  if (progress >= ch.end) return 1;
  return (progress - ch.start) / (ch.end - ch.start);
}

export class ChapterManager {
  constructor() {
    this.chapterNumEl = document.getElementById('chapter-num');
    this.coreIdentityReveal = document.getElementById('core-identity-reveal');
    this.ch04Container = document.getElementById('ch04-container');
    this.ch05Container = document.getElementById('ch05-container');
    this.ch06Container = document.getElementById('ch06-container');
    this.scrollHint = document.getElementById('scroll-hint');
    this.openingMicrocopy = document.getElementById('opening-microcopy');
    this.progressBarFill = document.getElementById('progress-bar-fill');

    this.activeChapter = 1;
  }

  update(smoothScrollProgress) {
    const activeCh = getActiveChapter(smoothScrollProgress);
    this.activeChapter = activeCh;

    // 1. Update Chapter Number Indicator
    if (this.chapterNumEl) {
      this.chapterNumEl.textContent = String(activeCh).padStart(2, '0');
    }

    // 2. Update Progress Bar
    if (this.progressBarFill) {
      this.progressBarFill.style.width = `${(smoothScrollProgress * 100).toFixed(1)}%`;
    }

    // 3. Opening Elements Fade Out
    if (this.scrollHint) {
      const hintOpacity = Math.max(1 - (smoothScrollProgress / 0.10), 0);
      this.scrollHint.style.opacity = hintOpacity.toFixed(2);
      this.scrollHint.style.visibility = hintOpacity > 0.01 ? 'visible' : 'hidden';
      this.scrollHint.style.transform = `translate(-50%, ${(smoothScrollProgress * 25)}px)`;
    }

    if (this.openingMicrocopy) {
      const microOpacity = Math.max(1 - (smoothScrollProgress / 0.08), 0);
      this.openingMicrocopy.style.opacity = microOpacity.toFixed(2);
      this.openingMicrocopy.style.visibility = microOpacity > 0.01 ? 'visible' : 'hidden';
    }

    // 4. Strict UI Container Isolation
    // Chapter 03 Identity
    const isCh03 = activeCh === 3;
    if (this.coreIdentityReveal) {
      this.coreIdentityReveal.classList.toggle('active', isCh03);
      this.coreIdentityReveal.style.visibility = isCh03 ? 'visible' : 'hidden';
      this.coreIdentityReveal.style.opacity = isCh03 ? '1' : '0';
    }

    // Chapter 04 Architecture
    const isCh04 = activeCh === 4;
    if (this.ch04Container) {
      this.ch04Container.classList.toggle('active', isCh04);
      this.ch04Container.style.visibility = isCh04 ? 'visible' : 'hidden';
      this.ch04Container.style.opacity = isCh04 ? '1' : '0';
      this.ch04Container.style.pointerEvents = isCh04 ? 'auto' : 'none';
    }

    // Chapter 05 AI Engineering
    const isCh05 = activeCh === 5;
    if (this.ch05Container) {
      this.ch05Container.classList.toggle('active', isCh05);
      this.ch05Container.style.visibility = isCh05 ? 'visible' : 'hidden';
      this.ch05Container.style.opacity = isCh05 ? '1' : '0';
      this.ch05Container.style.pointerEvents = isCh05 ? 'auto' : 'none';
    }

    // Chapter 06 Data & Knowledge
    const isCh06 = activeCh === 6;
    if (this.ch06Container) {
      this.ch06Container.classList.toggle('active', isCh06);
      this.ch06Container.style.visibility = isCh06 ? 'visible' : 'hidden';
      this.ch06Container.style.opacity = isCh06 ? '1' : '0';
      this.ch06Container.style.pointerEvents = isCh06 ? 'auto' : 'none';
    }

    return {
      activeChapter: activeCh,
      ch3Progress: getChapterProgress(smoothScrollProgress, 3),
      ch4Progress: getChapterProgress(smoothScrollProgress, 4),
      ch5Progress: getChapterProgress(smoothScrollProgress, 5),
      ch6Progress: getChapterProgress(smoothScrollProgress, 6),
    };
  }
}
