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

type Market = { name: string; lat: number; lon: number; primary?: boolean };

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
  const markets = JSON.parse(el.dataset.markets ?? '[]') as Market[];

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const canvas = renderer.domElement;
  canvas.className = 'absolute inset-0 h-full w-full cursor-grab touch-pan-y';
  canvas.setAttribute('aria-hidden', 'true');
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 3.6);

  const world = new THREE.Group();
  scene.add(world);

  // Core sphere with a soft fresnel-like glow
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.995, 64, 48),
    new THREE.MeshBasicMaterial({ color: '#0f2a1f', transparent: true, opacity: 0.85 }),
  );
  world.add(core);
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.12, 64, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { c: { value: new THREE.Color('#b9d1a6') } },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.75 - dot(vN, vec3(0.,0.,1.)), 3.0); gl_FragColor = vec4(c, i*0.9); }',
    }),
  );
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
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: '#d9e6cf', size: 0.012, sizeAttenuation: true, transparent: true, opacity: 0.85 }));
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

  // Arcs
  const arcs = markets.map((m) => {
    const end = toVec(m.lat, m.lon, R * 1.005);
    const mid = o.clone().add(end).multiplyScalar(0.5);
    const lift = 1 + o.distanceTo(end) * 0.55;
    mid.normalize().multiplyScalar(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(o, mid, end);
    const geo = new THREE.TubeGeometry(curve, 80, m.primary ? 0.008 : 0.005, 8, false);
    const mat = new THREE.MeshBasicMaterial({ color: m.primary ? '#f5a524' : '#b9d1a6', transparent: true, opacity: 0.95 });
    const mesh = new THREE.Mesh(geo, mat);
    geo.setDrawRange(0, 0);
    world.add(mesh);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: m.primary ? '#f5a524' : '#e9f1df' }));
    dot.position.copy(end);
    dot.scale.setScalar(0.001);
    world.add(dot);
    const total = geo.index ? geo.index.count : 0;
    return { m, mesh, mat, dot, total, progress: { v: 0 } };
  });

  // Face Africa / Europe first
  const target = { y: -THREE.MathUtils.degToRad(origin.lon + 90) + 0.35, x: 0.32 };
  world.rotation.set(target.x, target.y, 0);

  // Draw arcs once in view
  ScrollTrigger.create({
    trigger: el,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      arcs.forEach((a, i) => {
        gsap.to(a.progress, {
          v: 1,
          duration: 1.6,
          delay: 0.25 + i * 0.22,
          ease: 'power2.inOut',
          onUpdate: () => a.mesh.geometry.setDrawRange(0, Math.floor(a.total * a.progress.v)),
          onComplete: () => void gsap.to(a.dot.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(3)' }),
        });
      });
    },
  });

  // Highlight from the market list
  document.querySelectorAll<HTMLElement>('[data-market]').forEach((li) => {
    const a = arcs.find((x) => x.m.name === li.dataset.market);
    if (!a) return;
    const on = () => {
      arcs.forEach((x) => (x.mat.opacity = x === a ? 1 : 0.25));
      gsap.to(a.dot.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.3 });
    };
    const off = () => {
      arcs.forEach((x) => (x.mat.opacity = 0.95));
      gsap.to(a.dot.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    };
    li.addEventListener('pointerenter', on);
    li.addEventListener('pointerleave', off);
    li.addEventListener('focusin', on);
    li.addEventListener('focusout', off);
  });

  // Drag to spin
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
    world.rotation.y += vx + dt * 0.06;
    const t = clock.elapsedTime;
    const s = 1 + ((t * 0.8) % 1) * 2.5;
    pulse.scale.setScalar(s);
    (pulse.material as THREE.MeshBasicMaterial).opacity = 1 - ((t * 0.8) % 1);
    renderer.render(scene, camera);
  });
  el.classList.add('is-3d');
}
