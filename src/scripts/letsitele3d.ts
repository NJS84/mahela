/**
 * 3D ridgeline relief of the Letsitele valley, from the Tzaneen side of the escarpment
 * east across the Lowveld, with the Mahela packhouse at The Junction pinned. Same look
 * as the Packhouses page relief (limpopo3d.ts). Heights: AWS Terrain Tiles (SRTM and others).
 * Drag to turn; it sways gently on its own.
 *
 * Mount: <div data-letsitele-map> with [data-lm-site="0"] and [data-lm-town="name"] children.
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import data from '../data/letsitele-terrain.json';

const D = data as unknown as {
  rows: number[][];
  w: number;
  h: number;
  min: number;
  max: number;
  sites: Record<string, [number, number]>;
  towns: Record<string, [number, number]>;
};

const ROWS = D.rows.length;
const COLS = D.rows[0]!.length;
const HX = D.w / 2;
const HZ = D.h / 2;
const LIFT = 0.36;

const LOW = new THREE.Color('#5d86c9');
const HIGH = new THREE.Color('#ffffff');

/** Normalised height at a grid cell. */
// Square-root stretch so the gentle Lowveld folds read as well as the escarpment.
const cell = (r: number, k: number) => Math.sqrt((D.rows[r]![k]! - D.min) / (D.max - D.min));

/** Bilinear height at map x,z. */
function heightAt(x: number, z: number) {
  const fk = THREE.MathUtils.clamp(((x + HX) / D.w) * (COLS - 1), 0, COLS - 1.001);
  const fr = THREE.MathUtils.clamp(((z + HZ) / D.h) * (ROWS - 1), 0, ROWS - 1.001);
  const k = Math.floor(fk);
  const r = Math.floor(fr);
  const a = fk - k;
  const b = fr - r;
  const h = cell(r, k) * (1 - a) * (1 - b) + cell(r, k + 1) * a * (1 - b) + cell(r + 1, k) * (1 - a) * b + cell(r + 1, k + 1) * a * b;
  return h * LIFT;
}

/** Fade towards the edges of the slab. */
const edge = (x: number, z: number) => {
  const ex = 1 - THREE.MathUtils.smoothstep(Math.abs(x) / HX, 0.72, 1);
  const ez = 1 - THREE.MathUtils.smoothstep(Math.abs(z) / HZ, 0.72, 1);
  return ex * ez;
};

export function mountLetsiteleMap(el: HTMLElement) {
  if (el.dataset.mounted) return;
  const test = document.createElement('canvas');
  if (!test.getContext('webgl2') && !test.getContext('webgl')) return;
  el.dataset.mounted = '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.className = 'ls-canvas absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing';
  canvas.setAttribute('aria-hidden', 'true');
  el.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  const target = new THREE.Vector3(0, 0.04, 0.02);
  const world = new THREE.Group();
  scene.add(world);

  // Ridgelines: one line per row of latitude, lifted by elevation, lighter as it climbs.
  const terrain = new THREE.Group();
  world.add(terrain);
  {
    const pos: number[] = [];
    const col: number[] = [];
    const xAt = (k: number) => -HX + (D.w * k) / (COLS - 1);
    const zAt = (r: number) => -HZ + (D.h * r) / (ROWS - 1);
    const push = (r: number, k: number) => {
      const x = xAt(k);
      const z = zAt(r);
      const h = cell(r, k);
      pos.push(x, h * LIFT, z);
      const c = LOW.clone().lerp(HIGH, Math.pow(h, 0.7));
      col.push(c.r, c.g, c.b, (0.28 + 0.62 * h) * edge(x, z));
    };
    for (let r = 0; r < ROWS; r++) {
      for (let k = 0; k < COLS - 1; k++) {
        push(r, k);
        push(r, k + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
    terrain.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false })));
  }

  // Base frame: a faint outline of the slab on the ground with corner ticks.
  {
    const f = 1.0;
    const pts = [
      [-HX * f, -HZ * f], [HX * f, -HZ * f], [HX * f, HZ * f], [-HX * f, HZ * f], [-HX * f, -HZ * f],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z));
    terrain.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#8fb4f0', transparent: true, opacity: 0.18 })));
  }

  // Pins over the two packhouses.
  const siteKeys = Object.keys(D.sites);
  const pins = siteKeys.map((key) => {
    const [x, z] = D.sites[key]!;
    const y = heightAt(x, z);
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const stem = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.26, 0)]),
      new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85 }),
    );
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 12), new THREE.MeshBasicMaterial({ color: '#f59a23' }));
    dot.position.y = 0.26;
    const pulse = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.057, 64).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: '#ffd29a', transparent: true, opacity: 0.8, depthWrite: false }),
    );
    pulse.position.y = 0.004;
    g.add(stem, dot, pulse);
    g.scale.y = 0.001;
    world.add(g);
    return { g, pulse, anchor: new THREE.Vector3(x, y + 0.26, z) };
  });

  // HTML labels tracked to 3D anchors.
  const siteLabels = [...el.querySelectorAll<HTMLElement>('[data-lm-site]')];
  const townLabels = [...el.querySelectorAll<HTMLElement>('[data-lm-town]')].map((node) => {
    const [x, z] = D.towns[node.dataset.lmTown!] ?? [0, 0];
    return { node, v: new THREE.Vector3(x, heightAt(x, z) + 0.01, z) };
  });
  const tmp = new THREE.Vector3();
  function place(node: HTMLElement | null, v: THREE.Vector3, w: number, h: number) {
    if (!node) return;
    tmp.copy(v).applyMatrix4(world.matrixWorld).project(camera);
    node.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px)`;
  }

  // Drag to turn; a gentle sway when left alone.
  let dragging = false;
  let vx = 0;
  let lastX = 0;
  let spin = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vx = (e.clientX - lastX) * 0.007;
    lastX = e.clientX;
  });
  const stop = () => (dragging = false);
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  let W = 1;
  let H = 1;
  function resize() {
    const r = el.getBoundingClientRect();
    W = r.width;
    H = r.height;
    renderer.setSize(W, H, false);
    camera.aspect = W / Math.max(1, H);
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const th = tv * camera.aspect;
    const dist = Math.max(1.12 / th, 0.92 / tv) + 0.2;
    camera.position.set(0, dist * 0.7, dist * 0.72);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(el);
  resize();

  // Intro: the relief lifts out of the flat, pins rise.
  terrain.scale.y = 0.001;
  world.rotation.y = -0.5;
  let started = false;
  function intro() {
    if (started) return;
    started = true;
    el.classList.add('is-live');
    const d = reduce ? 0 : 1;
    gsap.to(terrain.scale, { y: 1, duration: 1.8 * d, ease: 'power3.out' });
    gsap.to(world.rotation, { y: 0, duration: 2.2 * d, ease: 'power3.out' });
    pins.forEach((p, i) => gsap.to(p.g.scale, { y: 1, duration: 0.9 * d, delay: (0.9 + i * 0.25) * d, ease: 'back.out(1.6)' }));
  }

  let visible = false;
  new IntersectionObserver(
    ([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) intro();
    },
    { rootMargin: '0px 0px -15% 0px' },
  ).observe(el);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (!dragging) vx *= 0.93;
    spin += vx;
    if (!dragging) spin *= 0.985;
    if (!gsap.isTweening(world.rotation)) world.rotation.y = spin + (reduce ? 0 : Math.sin(t * 0.25) * 0.28);
    pins.forEach((p, i) => {
      const k = (t * 0.55 + i * 0.5) % 1;
      p.pulse.scale.setScalar(1 + k * 2.2);
      (p.pulse.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k);
    });
    void dt;
    world.updateMatrixWorld();
    pins.forEach((p, i) => place(siteLabels[i] ?? null, p.anchor, W, H));
    townLabels.forEach((l) => place(l.node, l.v, W, H));
    renderer.render(scene, camera);
  });
}
