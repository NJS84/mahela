/**
 * Interactive export globe: a dotted Earth, glowing arcs from Letsitele to
 * each market, drag to spin. Markets in the side list highlight their arc.
 *
 * Mount: <div data-globe data-origin='{"lat":..,"lon":..}' data-markets='[{"name","lat","lon","primary"}]'>
 */
import * as THREE from 'three';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import landTopo from 'world-atlas/land-110m.json';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Route = { produce: string; market: string; color: string; lat: number; lon: number };

const R = 1;

function toVec(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Rasterise land polygons to an equirectangular mask for dot sampling. */
function landMask() {
  const W = 720;
  const H = 360;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const topo = landTopo as unknown as Topology<{ land: GeometryCollection }>;
  const geo = feature(topo, topo.objects.land) as unknown as GeoJSON.FeatureCollection | GeoJSON.Feature;
  const feats = 'features' in geo ? geo.features : [geo];
  ctx.fillStyle = '#fff';
  for (const f of feats) {
    const g = f.geometry;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const poly of polys) {
      ctx.beginPath();
      for (const ring of poly) {
        ring.forEach(([lon, lat], i) => {
          const x = ((lon! + 180) / 360) * W;
          const y = ((90 - lat!) / 180) * H;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
      ctx.fill('evenodd');
    }
  }
  const data = ctx.getImageData(0, 0, W, H).data;
  return (lat: number, lon: number) => {
    const x = Math.floor(((lon + 180) / 360) * W) % W;
    const y = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H));
    return data[(y * W + x) * 4]! > 128;
  };
}

export function mountGlobe(el: HTMLElement) {
  if (el.dataset.mounted) return;
  const test = document.createElement('canvas');
  if (!test.getContext('webgl2') && !test.getContext('webgl')) return;
  el.dataset.mounted = '1';

  const origin = JSON.parse(el.dataset.origin ?? '{"lat":-23.88,"lon":30.39}') as { lat: number; lon: number };
  const routes = JSON.parse(el.dataset.routes ?? '[]') as Route[];
  // Optional blue theme (Export page) and click-to-spin market chips.
  const blue = el.dataset.theme === 'blue';
  const spinTo = JSON.parse(el.dataset.spinTo ?? 'null') as Record<string, { lat: number; lon: number }> | null;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const canvas = renderer.domElement;
  canvas.className = 'globe-canvas absolute inset-0 h-full w-full cursor-grab touch-pan-y';
  canvas.setAttribute('aria-hidden', 'true');
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  // Pulled back so the halo and the arcs always sit inside the canvas.
  camera.position.set(0, 0, 4.8);

  const world = new THREE.Group();
  scene.add(world);

  // Core sphere with a soft fresnel-like glow
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.995, 64, 48),
    new THREE.MeshBasicMaterial({ color: blue ? '#0c1d36' : '#0f2a1f', transparent: true, opacity: 0.85 }),
  );
  world.add(core);
  // Atmosphere: a camera-facing disc whose glow fades to nothing well before
  // the canvas edge, so it reads as a soft halo and is never cut off.
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(R * 3.6, R * 3.6),
    new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: { c: { value: new THREE.Color(blue ? '#8fb6ec' : '#b9d1a6') }, r: { value: R * 1.02 } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'uniform vec3 c; uniform float r; varying vec2 vP;',
        'void main(){',
        '  float d = length(vP) / r;',
        '  float outer = 1.0 - smoothstep(0.96, 1.45, d);',
        '  outer = outer * outer * smoothstep(0.7, 1.0, d);',
        '  gl_FragColor = vec4(c, outer * 0.42);',
        '}',
      ].join('\n'),
    }),
  );
  glow.renderOrder = -1;
  scene.add(glow);

  // Land dots
  const isLand = landMask();
  const pts: number[] = [];
  for (let lat = -84; lat <= 84; lat += 1.5) {
    const ring = Math.max(1, Math.round(360 * Math.cos(THREE.MathUtils.degToRad(lat)) / 1.5));
    for (let i = 0; i < ring; i++) {
      const lon = -180 + (i / ring) * 360;
      if (!isLand(lat, lon)) continue;
      const v = toVec(lat, lon, R * 1.001);
      pts.push(v.x, v.y, v.z);
    }
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: blue ? '#dbe8fb' : '#d9e6cf', size: 0.012, sizeAttenuation: true, transparent: true, opacity: 0.85 }));
  world.add(dots);

  // Origin marker
  const o = toVec(origin.lat, origin.lon, R * 1.01);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), new THREE.MeshBasicMaterial({ color: '#f5a524' }));
  pin.position.copy(o);
  world.add(pin);
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.045, 32), new THREE.MeshBasicMaterial({ color: '#f5a524', transparent: true, side: THREE.DoubleSide }));
  pulse.position.copy(o);
  pulse.lookAt(o.clone().multiplyScalar(2));
  world.add(pulse);

  // Routes: one arc per produce and destination, coloured by produce. Each arc
  // has a faint permanent trail and a bright stream of light that shoots along it.
  const SEG = 120;
  const RAD = 6;
  const perSeg = RAD * 6;
  const arcs = routes.map((m, k) => {
    const end = toVec(m.lat, m.lon, R * 1.005);
    const mid = o.clone().add(end).multiplyScalar(0.5);
    const lift = Math.min(1.42, 1 + o.distanceTo(end) * (0.24 + (k % 4) * 0.035));
    mid.normalize().multiplyScalar(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(o, mid, end);
    const color = new THREE.Color(m.color);
    const trail = new THREE.Mesh(
      new THREE.TubeGeometry(curve, SEG, 0.0035, RAD, false),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false }),
    );
    const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
    const coreMat = new THREE.MeshBasicMaterial({ color: color.clone().lerp(new THREE.Color('#ffffff'), 0.45), transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, 0.011, RAD, false), glowMat);
    const core = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, 0.0055, RAD, false), coreMat);
    [glow, core].forEach((x) => x.geometry.setDrawRange(0, 0));
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
    head.add(halo);
    head.visible = false;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), new THREE.MeshBasicMaterial({ color }));
    dot.position.copy(end);
    dot.scale.setScalar(0.001);
    world.add(trail, glow, core, head, dot);
    // Each stream has its own speed and start, so they don't fire in step.
    return { m, curve, trail, glow, core, head, dot, dim: 1, trailBase: 0, speed: 0.32 + ((k * 37) % 10) / 60, phase: (k * 0.173) % 1 };
  });

  const windowRange = (g: THREE.BufferGeometry, from: number, to: number) => {
    const a = Math.max(0, Math.min(SEG, Math.floor(from * SEG)));
    const b = Math.max(0, Math.min(SEG, Math.ceil(to * SEG)));
    g.setDrawRange(a * perSeg, Math.max(0, b - a) * perSeg);
  };
  let started = false;
  let startTime = -1;

  // Face Africa / Europe first
  const target = { y: -THREE.MathUtils.degToRad(origin.lon + 90) + 0.35, x: 0.32 };
  world.rotation.set(target.x, target.y, 0);

  // Streams start once the globe is in view; trails and end dots fade in.
  ScrollTrigger.create({
    trigger: el,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      started = true;
      arcs.forEach((a, i) => {
        gsap.to(a, { trailBase: 0.18, duration: 1.2, delay: i * 0.05 });
        gsap.to(a.dot.scale, { x: 1, y: 1, z: 1, duration: 0.6, delay: 0.6 + i * 0.05, ease: 'back.out(3)' });
      });
    },
  });

  // Highlight: a market in the list, or a produce in the colour key.
  const setFocus = (match: ((r: Route) => boolean) | null) => {
    arcs.forEach((a) => {
      const on = !match || match(a.m);
      a.dim = on ? 1 : 0.12;
      gsap.to(a.dot.scale, { x: on && match ? 1.6 : 1, y: on && match ? 1.6 : 1, z: on && match ? 1.6 : 1, duration: 0.3 });
    });
  };
  // A clicked market stays lit (and the globe holds still on it) until another is picked.
  let sticky: ((r: Route) => boolean) | null = null;
  let hold = false;
  const bind = (els: NodeListOf<HTMLElement>, match: (li: HTMLElement) => (r: Route) => boolean) =>
    els.forEach((li) => {
      const on = () => setFocus(match(li));
      const off = () => setFocus(sticky);
      li.addEventListener('pointerenter', on);
      li.addEventListener('pointerleave', off);
      li.addEventListener('focusin', on);
      li.addEventListener('focusout', off);
    });
  bind(document.querySelectorAll<HTMLElement>('[data-market]'), (li) => (r) => r.market === li.dataset.market);
  bind(document.querySelectorAll<HTMLElement>('[data-produce-key]'), (li) => (r) => r.produce === li.dataset.produceKey);

  if (spinTo) {
    const chips = document.querySelectorAll<HTMLElement>('[data-market]');
    const spin = (name: string) => {
      const m = spinTo[name];
      if (!m) return;
      // Face the midpoint between Letsitele and the market, so the whole route shows.
      const lat = (m.lat + origin.lat) / 2;
      const lon = (m.lon + origin.lon) / 2;
      const want = -THREE.MathUtils.degToRad(lon + 90);
      let d = (want - world.rotation.y) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      hold = true;
      vx = 0;
      gsap.to(world.rotation, { y: world.rotation.y + d, x: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(lat), -0.2, 0.7), duration: 1.4, ease: 'power3.inOut', overwrite: true });
      sticky = (r) => r.market === name;
      setFocus(sticky);
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.market === name)));
      el.dispatchEvent(new CustomEvent('globe:market', { detail: name, bubbles: true }));
    };
    chips.forEach((c) => c.addEventListener('click', () => spin(c.dataset.market!)));
  }

  const tick = (t: number) => {
    if (!started) return;
    if (startTime < 0) startTime = t;
    const p = new THREE.Vector3();
    arcs.forEach((a) => {
      const run = ((t - startTime) * a.speed + a.phase) % 1.35; // 0..1 travels, 1..1.35 rests
      const h = Math.min(run, 1);
      const resting = run > 1;
      (a.glow.material as THREE.MeshBasicMaterial).opacity = (resting ? 0 : 0.45) * a.dim;
      (a.core.material as THREE.MeshBasicMaterial).opacity = (resting ? 0 : 1) * a.dim;
      (a.trail.material as THREE.MeshBasicMaterial).opacity = a.trailBase * (a.dim < 1 ? 0.3 : 1);
      windowRange(a.glow.geometry, h - 0.32, h);
      windowRange(a.core.geometry, h - 0.12, h);
      a.head.visible = !resting && a.dim > 0.5;
      if (!resting) {
        a.curve.getPoint(h, p);
        a.head.position.copy(p);
      }
    });
  };

  // Drag to spin
  let dragging = false;
  let vx = 0;
  let lastX = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    hold = false;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vx = (e.clientX - lastX) * 0.006;
    lastX = e.clientX;
  });
  const stop = () => (dragging = false);
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

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
    if (!dragging) vx *= 0.94;
    world.rotation.y += vx + (hold ? 0 : dt * 0.06);
    const t = clock.elapsedTime;
    const s = 1 + ((t * 0.8) % 1) * 2.5;
    pulse.scale.setScalar(s);
    (pulse.material as THREE.MeshBasicMaterial).opacity = 1 - ((t * 0.8) % 1);
    tick(t);
    renderer.render(scene, camera);
  });
  el.classList.add('is-3d');
}
