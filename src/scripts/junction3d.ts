/**
 * 3D map of the Mahela packhouse at The Junction, Letsitele, in the same colour and line
 * style as the Packhouses page relief (limpopo3d.ts): white-to-blue ridgelines lifted by
 * the real (exaggerated) terrain, orange pin and pulse, glass labels, a faint square slab
 * that fades at its edges. On top: orchard blocks, dams and roads from OpenStreetMap and
 * the packhouse buildings (traced from aerial imagery) extruded in 3D.
 * Drag to turn; it sways gently on its own.
 *
 * Mount: <div data-junction-map> with [data-jm-label] and [data-jm-road] children.
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import data from '../data/junction-map-3d.json';

type Bld = { p: number[]; h: number; main: boolean };
const D = data as unknown as {
  orch: number[][]; water: number[][]; waterFill: number[][]; river: number[][];
  primary: number[][]; minor: number[][]; track: number[][];
  blds: Bld[]; roadLabel: [number, number] | null;
  terrain: { rows: number[][]; min: number; max: number };
};

const T = D.terrain;
const ROWS = T.rows.length;
const COLS = T.rows[0]!.length;
const LIFT = 0.09; // the ground only falls ~25 m across the map, so it is exaggerated
const BUILD = 1.6; // building height exaggeration

const LOW = new THREE.Color('#5d86c9');
const HIGH = new THREE.Color('#ffffff');
const ORANGE = '#f59a23';
const PEACH = '#ffd29a';

const cell = (r: number, k: number) => (T.rows[r]![k]! - T.min) / (T.max - T.min);

/** Bilinear terrain height at map x,z (both -1..1). */
function heightAt(x: number, z: number) {
  const fk = THREE.MathUtils.clamp(((x + 1) / 2) * (COLS - 1), 0, COLS - 1.001);
  const fr = THREE.MathUtils.clamp(((z + 1) / 2) * (ROWS - 1), 0, ROWS - 1.001);
  const k = Math.floor(fk);
  const r = Math.floor(fr);
  const a = fk - k;
  const b = fr - r;
  const h = cell(r, k) * (1 - a) * (1 - b) + cell(r, k + 1) * a * (1 - b) + cell(r + 1, k) * (1 - a) * b + cell(r + 1, k + 1) * a * b;
  return h * LIFT;
}

/** Fade towards the edges of the slab. */
const edge = (x: number, z: number) => {
  const ex = 1 - THREE.MathUtils.smoothstep(Math.abs(x), 0.72, 1);
  const ez = 1 - THREE.MathUtils.smoothstep(Math.abs(z), 0.72, 1);
  return ex * ez;
};

/** Polylines draped over the terrain (segments subdivided so they follow the ground). */
function draped(polys: number[][], color: THREE.Color, alpha: number, lift = 0.004, dashed = false) {
  const pos: number[] = [];
  const col: number[] = [];
  const step = 0.02;
  for (const p of polys) {
    for (let i = 0; i + 3 < p.length; i += 2) {
      const [x1, z1, x2, z2] = [p[i]!, p[i + 1]!, p[i + 2]!, p[i + 3]!];
      const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, z2 - z1) / step));
      for (let s = 0; s < n; s++) {
        const ax = x1 + ((x2 - x1) * s) / n;
        const az = z1 + ((z2 - z1) * s) / n;
        const bx = x1 + ((x2 - x1) * (s + 1)) / n;
        const bz = z1 + ((z2 - z1) * (s + 1)) / n;
        pos.push(ax, heightAt(ax, az) + lift, az, bx, heightAt(bx, bz) + lift, bz);
        col.push(color.r, color.g, color.b, alpha * edge(ax, az), color.r, color.g, color.b, alpha * edge(bx, bz));
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  const m = dashed
    ? new THREE.LineDashedMaterial({ vertexColors: true, transparent: true, dashSize: 0.01, gapSize: 0.012, depthWrite: false })
    : new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  const l = new THREE.LineSegments(g, m);
  if (dashed) l.computeLineDistances();
  return l;
}

function shapeOf(p: number[]) {
  const s = new THREE.Shape();
  for (let i = 0; i < p.length; i += 2) {
    // Shape lies in XY; rotated -90deg about X, so world z = -shape y.
    if (i === 0) s.moveTo(p[i]!, -p[i + 1]!);
    else s.lineTo(p[i]!, -p[i + 1]!);
  }
  return s;
}

export function mountJunctionMap(el: HTMLElement) {
  if (el.dataset.mounted) return;
  const test = document.createElement('canvas');
  if (!test.getContext('webgl2') && !test.getContext('webgl')) return;
  el.dataset.mounted = '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.className = 'jm-canvas absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing';
  canvas.setAttribute('aria-hidden', 'true');
  el.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  const target = new THREE.Vector3(0, 0.04, 0.02);
  const world = new THREE.Group();
  scene.add(world);

  // Ground: ridgelines, one per row, lighter as the ground climbs.
  const ground = new THREE.Group();
  world.add(ground);
  {
    const pos: number[] = [];
    const col: number[] = [];
    const push = (r: number, k: number) => {
      const x = -1 + (2 * k) / (COLS - 1);
      const z = -1 + (2 * r) / (ROWS - 1);
      const h = cell(r, k);
      pos.push(x, h * LIFT, z);
      const c = LOW.clone().lerp(HIGH, Math.pow(h, 0.7));
      col.push(c.r, c.g, c.b, (0.22 + 0.5 * h) * edge(x, z));
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
    ground.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false })));

    const frame = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]].map(([x, z]) => new THREE.Vector3(x, 0, z));
    ground.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(frame), new THREE.LineBasicMaterial({ color: '#8fb4f0', transparent: true, opacity: 0.18 })));
  }

  // Orchards, dams, river and roads draped on the ground.
  for (const p of D.waterFill) {
    // Fills have no per-vertex fade, so only draw dams well inside the slab; outlines still fade out.
    let mx = 0;
    for (let i = 0; i < p.length; i++) mx = Math.max(mx, Math.abs(p[i]!));
    if (mx > 0.78) continue;
    const geo = new THREE.ShapeGeometry(shapeOf(p));
    geo.rotateX(-Math.PI / 2);
    const pa = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pa.count; i++) pa.setY(i, heightAt(pa.getX(i), pa.getZ(i)) + 0.002);
    ground.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#3a7be0', transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide })));
  }
  ground.add(draped(D.orch, new THREE.Color('#8fb4f0'), 0.7));
  ground.add(draped(D.water, new THREE.Color('#bcd4ff'), 0.9));
  ground.add(draped(D.river, new THREE.Color('#8fb4f0'), 0.8));
  ground.add(draped(D.track, new THREE.Color('#ffffff'), 0.35, 0.004, true));
  ground.add(draped(D.minor, new THREE.Color('#ffffff'), 0.8));
  ground.add(draped(D.primary, new THREE.Color('#ffffff'), 1));

  // Buildings: extruded from the ground, white edges; the packhouse glows orange.
  const buildings: THREE.Group[] = [];
  let mainTop = new THREE.Vector3();
  for (const b of D.blds) {
    const h = b.h * BUILD;
    const geo = new THREE.ExtrudeGeometry(shapeOf(b.p), { depth: h, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cz = (bb.min.z + bb.max.z) / 2;
    const g = new THREE.Group();
    g.position.y = heightAt(cx, cz);
    g.add(
      new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: b.main ? ORANGE : '#ffffff', transparent: true, opacity: b.main ? 0.26 : 0.06, depthWrite: false, side: THREE.DoubleSide }),
      ),
    );
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: b.main ? 1 : 0.85 })));
    g.scale.y = 0.001;
    world.add(g);
    buildings.push(g);
    if (b.main) mainTop = new THREE.Vector3(cx, g.position.y + h, cz);
  }

  // Orange pin over the packhouse with a pulse ring on the ground.
  const pin = new THREE.Group();
  pin.position.copy(mainTop);
  const STEM = 0.22;
  pin.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, STEM, 0)]),
      new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85 }),
    ),
  );
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 12), new THREE.MeshBasicMaterial({ color: ORANGE }));
  dot.position.y = STEM;
  pin.add(dot);
  pin.scale.y = 0.001;
  world.add(pin);
  const pulse = new THREE.Mesh(
    new THREE.RingGeometry(0.07, 0.077, 64).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: PEACH, transparent: true, opacity: 0.8, depthWrite: false }),
  );
  pulse.position.set(mainTop.x, heightAt(mainTop.x, mainTop.z) + 0.004, mainTop.z);
  world.add(pulse);
  const labelAnchor = mainTop.clone().setY(mainTop.y + STEM);

  // HTML labels tracked to 3D anchors.
  const label = el.querySelector<HTMLElement>('[data-jm-label]');
  const road = el.querySelector<HTMLElement>('[data-jm-road]');
  const roadAnchor = D.roadLabel ? new THREE.Vector3(D.roadLabel[0], heightAt(D.roadLabel[0], D.roadLabel[1]) + 0.01, D.roadLabel[1]) : null;
  const tmp = new THREE.Vector3();
  function place(node: HTMLElement | null, v: THREE.Vector3 | null, w: number, h: number) {
    if (!node || !v) return;
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
    const dist = Math.max(1.2 / th, 0.95 / tv) + 0.2;
    camera.position.set(0, dist * 0.7, dist * 0.72);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(el);
  resize();

  // Intro: the ground lifts out of the flat, buildings rise, the pin drops in.
  ground.scale.y = 0.001;
  world.rotation.y = -0.5;
  let started = false;
  function intro() {
    if (started) return;
    started = true;
    el.classList.add('is-live');
    const d = reduce ? 0 : 1;
    gsap.to(ground.scale, { y: 1, duration: 1.6 * d, ease: 'power3.out' });
    gsap.to(world.rotation, { y: 0, duration: 2.2 * d, ease: 'power3.out' });
    buildings.forEach((b, i) => gsap.to(b.scale, { y: 1, duration: 1.1 * d, delay: (0.6 + i * 0.04) * d, ease: 'power3.out' }));
    gsap.to(pin.scale, { y: 1, duration: 0.9 * d, delay: 1.4 * d, ease: 'back.out(1.6)' });
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
    const t = clock.getElapsedTime();
    if (!dragging) vx *= 0.93;
    spin += vx;
    if (!gsap.isTweening(world.rotation)) world.rotation.y = spin + (reduce ? 0 : Math.sin(t * 0.25) * 0.28);
    const k = (t * 0.55) % 1;
    pulse.scale.setScalar(1 + k * 2.2);
    (pulse.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k);
    world.updateMatrixWorld();
    place(label, labelAnchor, W, H);
    place(road, roadAnchor, W, H);
    renderer.render(scene, camera);
  });
}
