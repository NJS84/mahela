/**
 * Real-time 3D orange. Built procedurally (no model download): ten wedge
 * segments, each with dimpled peel, white pith and juicy flesh faces.
 * Drag to spin it; scrolling through its section splits it into segments.
 *
 * Mount: <div data-orange3d> containing a fallback <img>. The canvas is added
 * only when WebGL works and motion is allowed, and it renders only while the
 * section is on screen.
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SEGMENTS = 10;

function noiseCanvas(size: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  draw(ctx);
  return c;
}

/** Peel colour + dimple bump maps. */
function peelTextures() {
  const color = noiseCanvas(1024, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 1024);
    g.addColorStop(0, '#f39a2c');
    g.addColorStop(0.5, '#f07d14');
    g.addColorStop(1, '#e06a0c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = Math.random() * 2.2 + 0.4;
      ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '255,190,90' : '190,80,0'},${Math.random() * 0.18})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const bump = noiseCanvas(1024, (ctx) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 26000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = Math.random() * 2.6 + 0.8;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(40,40,40,0.55)');
      g.addColorStop(1, 'rgba(128,128,128,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
  const mk = (c: HTMLCanvasElement, srgb: boolean) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 1);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };
  return { color: mk(color, true), bump: mk(bump, false) };
}

/** Flesh face: a half-disc with juice vesicles radiating from the core. */
function fleshTexture() {
  const c = noiseCanvas(512, (ctx) => {
    // Coordinates: the half disc spans the right half of the square.
    const cx = 0;
    const cy = 256;
    ctx.fillStyle = '#f7f1e3';
    ctx.fillRect(0, 0, 512, 512);
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 480);
    g.addColorStop(0, '#ffd27a');
    g.addColorStop(0.55, '#ffa53a');
    g.addColorStop(0.86, '#f58a1f');
    g.addColorStop(0.9, '#fbe7c4');
    g.addColorStop(1, '#f6d6a8');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 500, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    for (let i = 0; i < 1600; i++) {
      const a = (Math.random() - 0.5) * Math.PI;
      const d = 40 + Math.random() * 380;
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = `rgba(255,${200 + Math.random() * 50},${120 + Math.random() * 60},${0.25 + Math.random() * 0.35})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 9 + Math.random() * 10, 2.4 + Math.random() * 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeLeaf() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.18, 0.1, 0.32, 0.36, 0, 0.78);
  s.bezierCurveTo(-0.32, 0.36, -0.18, 0.1, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 24);
  const mat = new THREE.MeshStandardMaterial({ color: '#2f7a33', roughness: 0.38, metalness: 0.05, side: THREE.DoubleSide });
  const leaf = new THREE.Mesh(geo, mat);
  return leaf;
}

export function mountOrange(el: HTMLElement) {
  if (el.dataset.mounted) return;
  const test = document.createElement('canvas');
  if (!test.getContext('webgl2') && !test.getContext('webgl')) return;
  el.dataset.mounted = '1';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.className = 'absolute inset-0 h-full w-full cursor-grab touch-pan-y';
  canvas.setAttribute('aria-hidden', 'true');
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.25, 6.2);

  scene.add(new THREE.HemisphereLight('#fff7e8', '#1e4a30', 1.15));
  const key = new THREE.DirectionalLight('#fff1d6', 2.6);
  key.position.set(-3, 4, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#b9d1a6', 1.4);
  rim.position.set(3, 1, -4);
  scene.add(rim);

  const R = 1.25;
  const peel = peelTextures();
  const peelMat = new THREE.MeshStandardMaterial({ map: peel.color, bumpMap: peel.bump, bumpScale: 2.2, roughness: 0.52, metalness: 0 });
  const pithMat = new THREE.MeshStandardMaterial({ color: '#fbefd9', roughness: 0.9, side: THREE.BackSide });
  const fleshMat = new THREE.MeshStandardMaterial({ map: fleshTexture(), roughness: 0.35, metalness: 0, side: THREE.DoubleSide });

  const orange = new THREE.Group();
  const wedges: { group: THREE.Group; dir: THREE.Vector3; spin: number }[] = [];
  const step = (Math.PI * 2) / SEGMENTS;
  for (let i = 0; i < SEGMENTS; i++) {
    const phi = i * step;
    const g = new THREE.Group();
    // Peel shell
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 40, 48, phi, step), peelMat));
    // Pith (inside of the shell)
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 24, 32, phi, step), pithMat));
    // Two flesh faces closing the wedge
    for (const a of [phi, phi + step]) {
      const face = new THREE.Mesh(new THREE.CircleGeometry(R * 0.975, 40, -Math.PI / 2, Math.PI), fleshMat);
      face.rotation.y = Math.PI + a;
      g.add(face);
    }
    const mid = phi + step / 2;
    const dir = new THREE.Vector3(-Math.cos(mid), 0, Math.sin(mid));
    wedges.push({ group: g, dir, spin: (Math.random() - 0.5) * 0.6 });
    orange.add(g);
  }

  // Stem and leaves
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.22, 10), new THREE.MeshStandardMaterial({ color: '#5b6b2a', roughness: 0.7 }));
  stem.position.y = R + 0.06;
  const leafA = makeLeaf();
  leafA.position.set(0.02, R + 0.12, 0);
  leafA.rotation.set(-0.9, 0.4, -0.9);
  const leafB = makeLeaf();
  leafB.scale.setScalar(0.8);
  leafB.position.set(-0.02, R + 0.12, 0.02);
  leafB.rotation.set(-0.7, -2.2, 0.8);
  const top = new THREE.Group();
  top.add(stem, leafA, leafB);
  orange.add(top);

  orange.rotation.set(0.32, -0.6, 0.12);
  scene.add(orange);

  // Soft contact shadow
  const shadowTex = noiseCanvas(256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, 'rgba(0,0,0,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowTex), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -R - 0.35;
  scene.add(shadow);

  // State driven by scroll (split) and pointer (spin)
  const state = { split: 0, spinY: 0, tiltX: 0 };
  let velocity = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velocity = dx * 0.008;
    state.tiltX = THREE.MathUtils.clamp(state.tiltX + dy * 0.004, -0.6, 0.6);
  });
  const end = () => {
    dragging = false;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  const section = el.closest('section') ?? el;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 0.8,
    onUpdate: (self) => {
      // 0 → whole, peak split in the middle third, close again near the end
      const p = self.progress;
      const s = p < 0.35 ? p / 0.35 : p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;
      state.split = gsap.parseEase('power2.inOut')(Math.max(0, Math.min(1, s)));
      el.style.setProperty('--split', state.split.toFixed(3));
    },
  });

  function resize() {
    const r = el.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(el);
  resize();

  let visible = false;
  new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting), { rootMargin: '100px' }).observe(el);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (!dragging) velocity *= 0.95;
    state.spinY += velocity + dt * 0.25;
    orange.rotation.y = -0.6 + state.spinY;
    orange.rotation.x = 0.32 + state.tiltX + Math.sin(t * 0.8) * 0.03;
    orange.position.y = Math.sin(t * 1.1) * 0.05;
    const s = state.split;
    wedges.forEach((w, i) => {
      w.group.position.copy(w.dir).multiplyScalar(s * 0.85);
      w.group.position.y = s * Math.sin(i * 1.7) * 0.18;
      w.group.rotation.y = s * w.spin;
    });
    top.position.y = s * 0.9;
    top.rotation.z = s * 0.4;
    camera.position.z = 6.2 + s * 1.4;
    shadow.scale.setScalar(1 + s * 0.6);
    renderer.render(scene, camera);
  });

  el.classList.add('is-3d');
}
