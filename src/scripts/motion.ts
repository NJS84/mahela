/**
 * Mahela motion layer (GSAP + ScrollTrigger + Lenis).
 * Everything animates transform/opacity only, and nothing runs under
 * prefers-reduced-motion. Heavier effects (pinning, parallax, tilt) are
 * desktop-only via gsap.matchMedia.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

/** Load the WebGL pieces only when their section is about to scroll into view. */
function lazyMount(selector: string, load: () => Promise<(el: HTMLElement) => void>) {
  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        load().then((mount) => mount(e.target as HTMLElement));
      });
    },
    { rootMargin: '400px' },
  );
  els.forEach((el) => io.observe(el));
}

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
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  // WebGL: export globe.
  lazyMount('[data-globe]', () => import('./globe').then((m) => m.mountGlobe));

  // Hero film: ease in and drift as the page scrolls away.
  const heroMedia = document.querySelector<HTMLElement>('[data-hero-media]');
  if (heroMedia) {
    gsap.fromTo(heroMedia, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
    gsap.to(heroMedia, { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: heroMedia.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  }
  const badges = gsap.utils.toArray<HTMLElement>('[data-badge]');
  if (badges.length) gsap.from(badges, { x: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', delay: 0.6 });

  // Count rings draw around the figures.
  gsap.utils.toArray<SVGCircleElement>('[data-ring]').forEach((c) => {
    gsap.fromTo(c, { strokeDashoffset: 302 }, { strokeDashoffset: 0, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
  });

  // Farm-to-port journey: the line draws and a carton travels along it.
  document.querySelectorAll<HTMLElement>('[data-journey]').forEach((j) => {
    const path = j.querySelector<SVGPathElement>('[data-journey-path]');
    const mover = j.querySelector<HTMLElement>('[data-journey-mover]');
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const tl = gsap.timeline({ scrollTrigger: { trigger: j, start: 'top 65%', end: 'bottom 70%', scrub: 0.6 } });
    tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);
    if (mover) tl.to(mover, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0);
    j.querySelectorAll<HTMLElement>('[data-stop]').forEach((stop) => {
      ScrollTrigger.create({ trigger: stop, start: 'top 70%', end: 'bottom 30%', toggleClass: { targets: stop, className: 'is-on' } });
    });
  });

  // Floating leaves drift at different depths.
  gsap.utils.toArray<HTMLElement>('[data-float]').forEach((leaf, i) => {
    gsap.to(leaf, { y: () => -window.innerHeight * (0.25 + (i % 3) * 0.15), rotate: (i % 2 ? 1 : -1) * 40, ease: 'none', scrollTrigger: { trigger: leaf.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Hero fruit renders bob gently, like they are floating in water.
  gsap.utils.toArray<HTMLElement>('[data-float-big]').forEach((el, i) => {
    gsap.to(el, { y: -18, rotate: i % 2 ? -4 : 4, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  // Light on the glass: a highlight follows the pointer.
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll<HTMLElement>('[data-glare]').forEach((p) => {
      p.addEventListener('pointermove', (e) => {
        const r = p.getBoundingClientRect();
        p.style.setProperty('--glare-x', `${e.clientX - r.left}px`);
        p.style.setProperty('--glare-y', `${e.clientY - r.top}px`);
        p.style.setProperty('--glare-o', '1');
      });
      p.addEventListener('pointerleave', () => p.style.setProperty('--glare-o', '0'));
    });
    // Magnetic buttons
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((b) => {
      const x = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' });
      const y = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener('pointerleave', () => {
        x(0);
        y(0);
      });
    });
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
  mm.add('(min-width: 1024px)', () => {
    // Produce rail: pinned sideways scroll, page tone follows the centred fruit.
    const rail = document.querySelector<HTMLElement>('[data-rail]');
    const track = document.querySelector<HTMLElement>('[data-rail-track]');
    if (rail && track) {
      const tint = rail.querySelector<HTMLElement>('[data-rail-tint]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-rail-card]');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: rail, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true },
      });
      cards.forEach((card) => {
        const fruit = card.querySelector('[data-card-fruit]');
        if (fruit) gsap.fromTo(fruit, { xPercent: -30, scale: 0.8, rotate: -12 }, { xPercent: 0, scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'center 55%', scrub: true } });
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: 'left 60%',
          end: 'right 40%',
          onToggle: (self) => self.isActive && tint && gsap.to(tint, { backgroundColor: card.dataset.tone, duration: 0.8 }),
        });
      });
    }
  });

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

  // Pinned sections (produce rail, heritage) are created after the triggers
  // further down the page, which would leave those triggers measured without
  // the pin spacing (the journey line had already finished before it was
  // reached). Re-order by position and measure again.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
