/**
 * Mahela motion layer (GSAP + ScrollTrigger + Lenis).
 * Everything animates transform/opacity only, and nothing runs under
 * prefers-reduced-motion. Heavier effects (pinning, parallax, tilt) are
 * desktop-only via gsap.matchMedia.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-ZA').replace(/,/g, ' ');

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Generic reveal.
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Split-line headings.
  document.fonts.ready.then(() => {
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    ScrollTrigger.refresh();
  });

  // Hero entrance.
  const slice = document.querySelector('[data-hero-slice]');
  if (slice) {
    gsap.from(slice, { scale: 0.82, rotate: -18, opacity: 0, duration: 2, ease: 'expo.out', delay: 0.2 });
    gsap.to(slice, { rotate: 25, ease: 'none', scrollTrigger: { trigger: slice, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Counters.
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const isYear = el.dataset.format === 'year';
    const from = isYear ? end - 60 : 0;
    const obj = { v: from };
    el.textContent = isYear ? String(from) : formatNumber(from);
    gsap.to(obj, {
      v: end,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = isYear ? String(Math.round(obj.v)) : formatNumber(obj.v)),
    });
  });

  // Process line.
  const line = document.querySelector('[data-process-line]');
  if (line) {
    gsap.to(line, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '[data-process]', start: 'top 75%', end: 'bottom 60%', scrub: true } });
  }

  // Export routes draw in.
  gsap.utils.toArray<SVGPathElement>('[data-routes] .route').forEach((p, i) => {
    const len = p.getTotalLength();
    gsap.fromTo(
      p,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: i * 0.12, scrollTrigger: { trigger: '[data-routes]', start: 'top 75%', once: true } },
    );
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    // Layered parallax.
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = Number(el.dataset.parallax);
      gsap.to(el, {
        yPercent: speed * 40,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: true },
      });
    });

    // Produce panels: section background shifts to each fruit's tone.
    const section = document.querySelector<HTMLElement>('[data-produce]');
    if (section) {
      const base = getComputedStyle(section).backgroundColor;
      gsap.utils.toArray<HTMLElement>('.produce-panel').forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && gsap.to(section, { backgroundColor: panel.dataset.tone, duration: 0.9, ease: 'power2.out' }),
        });
        const mask = panel.querySelector('[data-mask]');
        if (mask) gsap.fromTo(mask, { clipPath: 'inset(18% 12% 18% 12% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: panel, start: 'top 85%', end: 'top 30%', scrub: true } });
      });
      ScrollTrigger.create({ trigger: section, start: 'top 60%', onLeaveBack: () => gsap.to(section, { backgroundColor: base, duration: 0.6 }) });
    }

    // Heritage: pinned horizontal timeline.
    const track = document.querySelector<HTMLElement>('[data-heritage-track]');
    const heritage = document.querySelector<HTMLElement>('[data-heritage]');
    if (track && heritage) {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: heritage, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
    }

    // Subtle 3D tilt on cards (pointer devices only).
    if (window.matchMedia('(hover: hover)').matches) {
      gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((card) => {
        gsap.set(card, { transformPerspective: 900 });
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 8);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        });
        card.addEventListener('pointerleave', () => {
          rx(0);
          ry(0);
        });
      });
    }
  });
}
