/**
 * 3D line map of the Mahela packhouse at The Junction, Letsitele.
 * Orchards, roads and dams from OpenStreetMap; buildings traced from aerial
 * imagery and extruded. Free-floating disc (no frame) that fades out at its
 * rim; drag to spin, slow auto-rotate.
 *
 * Mount: <div data-packhouse-map> with optional [data-pm-label] and [data-pm-road] children.
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import data from '../data/packhouse-map-3d.json';

type Bld = { p: number[]; h: number; main: boolean };
const D = data as unknown as {
  orch: number[][]; rows: number[][]; water: number[][]; waterFill: number[][];
  primary: number[][]; minor: number[][]; track: number[][];
  blds: Bld[]; roadLabel: [number, number] | null;
};

const WHITE = new THREE.Color('#f5f2ea');
const BLUE = new THREE.Color('#8fb4f0');
const SKY = new THREE.Color('#bcd4ff');

/** Fade towards the rim of the unit disc. */
const rim = (x: number, z: number) => {
  const r = Math.hypot(x, z);
  return 1 - THREE.MathUtils.smoothstep(r, 0.7, 1);
};

/** Polylines (flat x,z arrays) -> LineSegments with per-vertex alpha fading at the rim. */
function lines(polys: number[][], color: THREE.Color, alpha: number, y = 0, dashed = false) {
  const pos: number[] = [];
  const col: number[] = [];
  for (const p of polys) {
    for (let i = 0; i + 3 < p.length; i += 2) {
      const [x1, z1, x2, z2] = [p[i]!, p[i + 1]!, p[i + 2]!, p[i + 3]!];
      pos.push(x1, y, z1, x2, y, z2);
      col.push(color.r, color.g, color.b, alpha * rim(x1, z1), color.r, color.g, color.b, alpha * rim(x2, z2));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  const m = dashed
    ? new THREE.LineDashedMaterial({ vertexColors: true, transparent: true, dashSize: 0.008, gapSize: 0.01, depthWrite: false })
    : new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  const l = new THREE.LineSegments(g, m);
  if (dashed) l.computeLineDistances();
  return l;
}

function shapeOf(p: number[]) {
  const s = new THREE.Shape();
  for (let i = 0; i < p.length; i += 2) {
    // Shape lies in XY; we rotate -90deg about X, so world z = -shape y.
    if (i === 0) s.moveTo(p[i]!, -p[i + 1]!);
    else s.lineTo(p[i]!, -p[i + 1]!);
  }
  return s;
}

export function mountPackhouseMap(el: HTMLElement) {
  if (el.dataset.mounted) return;
  const test = document.createElement('canvas');
  if (!test.getContext('webgl2') && !test.getContext('webgl')) return;
  el.dataset.mounted = '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.className = 'pm-canvas absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing';
  canvas.setAttribute('aria-hidden', 'true');
  el.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  const target = new THREE.Vector3(0, 0, 0.02);

  const world = new THREE.Group();
  world.rotation.y = -0.35;
  scene.add(world);

  // Ground: orchard rows and outlines, dams, roads.
  const ground = new THREE.Group();
  world.add(ground);
  ground.add(lines(D.rows, BLUE, 0.2));
  ground.add(lines(D.orch, BLUE, 0.75));
  for (const p of D.waterFill) {
    const geo = new THREE.ShapeGeometry(shapeOf(p));
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#3a7be0', transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }));
    mesh.position.y = -0.001;
    ground.add(mesh);
  }
  ground.add(lines(D.water, SKY, 0.9));
  ground.add(lines(D.track, WHITE, 0.4, 0, true));
  ground.add(lines(D.minor, WHITE, 0.75));
  ground.add(lines(D.primary, WHITE, 1));

  // Rim: a faint ring and compass ticks so the disc reads as an object.
  const ringPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 192; i++) {
    const a = (i / 192) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a) * 1.02, 0, Math.sin(a) * 1.02));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 }),
  );
  world.add(ring);
  const ticks: number[][] = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r2 = i % 18 === 0 ? 1.08 : 1.05;
    ticks.push([Math.cos(a) * 1.02, Math.sin(a) * 1.02, Math.cos(a) * r2, Math.sin(a) * r2]);
  }
  const tickGeo = new THREE.BufferGeometry();
  tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(ticks.flatMap(([a, b, c, d]) => [a!, 0, b!, c!, 0, d!]), 3));
  world.add(new THREE.LineSegments(tickGeo, new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.45 })));

  // North marker on the rim.
  const nCanvas = document.createElement('canvas');
  nCanvas.width = nCanvas.height = 64;
  const nctx = nCanvas.getContext('2d')!;
  nctx.fillStyle = '#f5f2ea';
  nctx.font = '700 40px Inter, system-ui, sans-serif';
  nctx.textAlign = 'center';
  nctx.textBaseline = 'middle';
  nctx.fillText('N', 32, 34);
  const north = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(nCanvas), transparent: true, depthWrite: false }));
  north.scale.setScalar(0.07);
  north.position.set(0, 0.02, -1.15);
  world.add(north);

  // Buildings: extruded, white edges, faint fill; the packhouse in blue glass.
  const buildings: THREE.Group[] = [];
  let mainTop = new THREE.Vector3();
  for (const b of D.blds) {
    const geo = new THREE.ExtrudeGeometry(shapeOf(b.p), { depth: b.h * 1.5, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const g = new THREE.Group();
    g.add(
      new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: b.main ? '#6f9be0' : '#f5f2ea', transparent: true, opacity: b.main ? 0.32 : 0.07, depthWrite: false, side: THREE.DoubleSide }),
      ),
    );
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), new THREE.LineBasicMaterial({ color: b.main ? '#ffffff' : '#e8eefc', transparent: true, opacity: b.main ? 1 : 0.85 })));
    g.scale.y = 0.001;
    world.add(g);
    buildings.push(g);
    if (b.main) {
      geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      mainTop = new THREE.Vector3((bb.min.x + bb.max.x) / 2, bb.max.y, (bb.min.z + bb.max.z) / 2);
    }
  }

  // Pin above the packhouse with a pulse ring on the ground.
  const stemGeo = new THREE.BufferGeometry().setFromPoints([mainTop.clone(), mainTop.clone().setY(mainTop.y + 0.24)]);
  const stem = new THREE.Line(stemGeo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8 }));
  world.add(stem);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  dot.position.copy(mainTop).setY(mainTop.y + 0.24);
  world.add(dot);
  const pulse = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.066, 64).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: '#bcd4ff', transparent: true, opacity: 0.8, depthWrite: false }),
  );
  pulse.position.set(mainTop.x, 0.002, mainTop.z);
  world.add(pulse);

  // HTML labels tracked to 3D anchors.
  const label = el.querySelector<HTMLElement>('[data-pm-label]');
  const road = el.querySelector<HTMLElement>('[data-pm-road]');
  const roadAnchor = D.roadLabel ? new THREE.Vector3(D.roadLabel[0], 0, D.roadLabel[1]) : null;
  const tmp = new THREE.Vector3();
  function place(node: HTMLElement | null, v: THREE.Vector3 | null, w: number, h: number) {
    if (!node || !v) return;
    tmp.copy(v).applyMatrix4(world.matrixWorld).project(camera);
    node.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px)`;
  }

  // Drag to spin.
  let dragging = false;
  let vx = 0;
  let lastX = 0;
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
    // Fit the whole disc (rim ticks included) inside the canvas, whatever its shape.
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const th = tv * camera.aspect;
    const dist = Math.max(1.12 / th, 0.86 / tv) + 0.3;
    camera.position.set(0, dist * 0.66, dist * 0.75);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(el);
  resize();

  // Intro: ground fades in, buildings rise.
  world.scale.setScalar(0.92);
  let started = false;
  function intro() {
    if (started) return;
    started = true;
    el.classList.add('is-live');
    gsap.to(world.scale, { x: 1, y: 1, z: 1, duration: reduce ? 0 : 1.8, ease: 'power3.out' });
    buildings.forEach((b, i) => gsap.to(b.scale, { y: 1, duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.4 + i * 0.04, ease: 'power3.out' }));
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
    if (!dragging) vx *= 0.94;
    world.rotation.y += vx + (reduce ? 0 : dt * 0.08);
    const t = (clock.elapsedTime * 0.6) % 1;
    pulse.scale.setScalar(1 + t * 2.4);
    (pulse.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - t);
    world.updateMatrixWorld();
    place(label, dot.position, W, H);
    place(road, roadAnchor, W, H);
    renderer.render(scene, camera);
  });
}
