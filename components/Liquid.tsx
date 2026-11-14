'use client';

import { useEffect, useRef } from 'react';

/*
  A real-time liquid chrome form, raymarched in a fragment shader.
  It renders into a fixed, transparent canvas and positions itself over
  whichever [data-liquid-anchor] element is on screen. Two glass "eyes"
  track the pointer; satellites merge in and out of the body and a drop
  falls from it on a loop.
*/

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uTime;
uniform vec2 uLook;
uniform float uBlink;
uniform float uPress;
uniform float uShadow; // how far below the centre the contact shadow sits, in radii
uniform vec4 uHoles[8]; // xyz: mouth of the bore (body space), w: its radius
uniform float uCount;   // how many bores are open, so an untouched body costs nothing extra
uniform vec4 uDirs[8];  // xyz: direction it was drilled in, w: how deep it goes

vec3 C;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float t = uTime;
  vec3 q = p - C;
  float d = length(q) - 1.0;
  d += (0.03 + 0.05 * uPress) * sin(3.1 * q.x + t * 1.1) * sin(2.7 * q.y + t * 0.9) * sin(2.9 * q.z + t * 1.3);

  // bores: each click drills further into the body along the line of sight,
  // until repeated clicks open a hole you can see through; then it closes over
  // The bores are blended into one soft shape first, then pressed out of the body
  // with a wide blend, so rims are rounded lips and neighbouring holes flow together.
  float bore = 10.0;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uCount) break;
    vec4 h = uHoles[i];
    if (h.w > 0.001) {
      vec3 pa = q - h.xyz;
      vec3 ba = uDirs[i].xyz * uDirs[i].w;
      float k = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float flare = 1.0 + 0.4 * smoothstep(0.95, 0.25, k * uDirs[i].w); // wider at the mouth
      bore = smin(bore, length(pa - ba * k) - h.w * flare, 0.3);
    }
  }
  d = -smin(-d, bore, 0.34);

  // satellites orbit through the body, so they merge and separate
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float a = t * (0.26 + 0.11 * fi) + fi * 2.6;
    float tilt = 0.5 - fi * 1.15;
    vec3 o = vec3(cos(a) * (1.5 + 0.22 * fi), 0.0, sin(a) * 0.62 - 0.1);
    o.xy = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt)) * o.xy;
    d = smin(d, length(p - C - o) - (0.13 + 0.07 * fi), 0.34);
  }

  // the drip: a drop stretches away from the underside and falls
  float ph = fract(t * 0.16);
  float fall = ph * ph;
  vec3 dp = C + vec3(0.12, -0.72 - fall * 2.5, 0.12);
  float dr = 0.24 * (1.0 - fall * 0.55);
  d = smin(d, length(p - dp) - dr, 0.42 * (1.0 - fall) + 0.04);
  return d;
}

vec3 normal(vec3 p) {
  vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

// a procedural photo studio: bright ceiling, dark floor, two soft boxes
vec3 env(vec3 d) {
  float a = uTime * 0.05;
  d.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * d.xz;
  float y = d.y;
  vec3 c = mix(vec3(0.05, 0.052, 0.06), vec3(0.94, 0.94, 0.92), smoothstep(-0.85, 0.5, y));
  c += vec3(1.25) * smoothstep(0.7, 0.93, y);
  float window = smoothstep(-0.1, 0.25, y) * smoothstep(0.96, 0.5, y);
  c += vec3(1.2, 1.18, 1.12) * smoothstep(0.13, 0.0, abs(d.x - 0.5)) * window;
  c += vec3(0.6, 0.74, 1.0) * 0.6 * smoothstep(0.24, 0.0, abs(d.x + 0.68)) * window;
  c *= mix(0.72, 1.0, smoothstep(0.0, 0.3, abs(y + 0.3)));
  c += vec3(1.0, 0.46, 0.2) * 0.07 * smoothstep(-0.3, -0.95, y);
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uCenter) / uRadius;
  C = vec3(uLook * 0.07, 0.0);

  // contact shadow on the page beneath the form
  vec2 sp = (uv - vec2(0.0, -uShadow)) / vec2(1.7, 0.13);
  float shadow = exp(-dot(sp, sp) * 1.4) * 0.1;

  if (length(uv - vec2(0.0, -0.9)) > 3.4) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
    return;
  }

  vec3 ro = vec3(0.0, 0.0, 6.0);
  vec3 rd = normalize(vec3(uv, -6.0));
  float t = 3.4;
  float minD = 10.0;
  bool hit = false;
  for (int i = 0; i < 84; i++) {
    float d = map(ro + rd * t);
    minD = min(minD, d);
    if (d < 0.0015) { hit = true; break; }
    t += d * 0.9;
    if (t > 10.0) break;
  }

  if (!hit) {
    float edge = smoothstep(0.012, 0.0, minD);
    gl_FragColor = vec4(vec3(0.28) * edge, max(edge, shadow * (1.0 - edge)));
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = normal(p);
  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  // inside a bore the walls sit edge-on to the eye: ease off the rim light there
  // and let them fall into shade, so the hole reads as depth, not as a bright band
  float inner = smoothstep(0.96, 0.7, length(p - C));
  fres *= 1.0 - 0.8 * inner;
  vec3 col = env(reflect(rd, n));
  col = mix(col, vec3(1.0), fres * 0.45);
  col *= mix(1.0, 0.42, inner);
  // a breath of thin-film colour at grazing angles
  col += 0.07 * fres * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 1.4 + uTime * 0.04));
  col = col / (1.0 + col * 0.28);
  col = pow(col, vec3(0.92));

  // eyes: two black glass capsules set into the main body, aimed at the pointer
  vec3 q = p - C;
  float onBody = smoothstep(1.13, 1.03, length(q)) * smoothstep(0.88, 0.96, length(q));
  vec3 L = normalize(vec3(uLook.x * 0.62, uLook.y * 0.5, 1.0));
  vec3 R = normalize(cross(vec3(0.0, 1.0, 0.0), L));
  vec3 U = cross(L, R);
  vec3 nl = normalize(q);
  if (dot(nl, L) > 0.0) {
    vec2 e = vec2(abs(dot(nl, R)) - 0.17, dot(nl, U) - 0.1);
    float shape = length(e / vec2(0.036, 0.125 * uBlink + 0.008));
    float m = (1.0 - smoothstep(0.78, 1.06, shape)) * onBody;
    vec3 glass = vec3(0.012, 0.013, 0.016);
    col = mix(col, glass, m);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Liquid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) { canvas.style.display = 'none'; document.documentElement.classList.add('no-webgl'); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = { center: u('uCenter'), radius: u('uRadius'), time: u('uTime'), look: u('uLook'), blink: u('uBlink'), press: u('uPress'), shadow: u('uShadow'), holes: u('uHoles'), dirs: u('uDirs'), count: u('uCount') };

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const narrow = matchMedia('(max-width: 900px)');
    let dpr = 1, W = 0, H = 0, CH = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      // size from the canvas itself, and only when it really changed: a phone fires
      // resize every time its address bar moves, and resizing clears the picture
      CH = canvas.clientHeight || innerHeight;
      const w = Math.round((canvas.clientWidth || innerWidth) * dpr), h = Math.round(CH * dpr);
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    addEventListener('resize', resize);

    const pointer = { x: innerWidth * 0.5, y: innerHeight * 0.5, last: -1e9 };
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) { pointer.x = t.clientX; pointer.y = t.clientY; pointer.last = performance.now(); } };
    let press = 0, pressTarget = 0;
    // click to drill: a first click dents the body, more clicks in the same place go
    // deeper until the hole runs right through. Left alone, it regrows by itself.
    const HOLD = 2.2, REGROW = 2.8;
    const RADIUS = [0, 0.2, 0.25, 0.3], DEPTH = [0, 0.62, 1.25, 2.9]; // by number of hits; the bore starts 0.3 outside the surface
    type Hole = { x: number; y: number; z: number; dx: number; dy: number; dz: number; hits: number; t: number; rad: number; depth: number };
    let holes: Hole[] = [];
    const holeData = new Float32Array(32), dirData = new Float32Array(32);
    const geo = { cx: 0, cy: 0, radius: 0, live: false };
    const look = { x: 0, y: 0 };
    // cast the same ray the shader does; where it meets the body, start a bore or deepen the one already there
    const damage = (clientX: number, clientY: number, amount: number) => {
      if (!geo.live) return false;
      const ux = (clientX - geo.cx) / geo.radius, uy = -(clientY - geo.cy) / geo.radius;
      const len = Math.hypot(ux, uy, 6);
      const rx = ux / len, ry = uy / len, rz = -6 / len;
      const ox = -look.x * 0.07, oy = -look.y * 0.07, oz = 6;
      const b = ox * rx + oy * ry + oz * rz;
      const disc = b * b - (ox * ox + oy * oy + oz * oz - 1);
      if (disc < 0) return false;
      const t = -b - Math.sqrt(disc);
      const x = ox + rx * t, y = oy + ry * t, z = oz + rz * t, now = performance.now();
      const near = holes.find((h) => Math.hypot(h.x - x, h.y - y, h.z - z) < 0.3);
      if (near) { near.hits = Math.min(near.hits + amount, 3); near.t = now; return true; }
      if (holes.length >= 8) holes.shift();
      holes.push({ x, y, z, dx: rx, dy: ry, dz: rz, hits: 1, t: now, rad: 0, depth: 0.3 });
      return true;
    };
    // a click is one hit; holding and dragging carves a groove along the path
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      pressTarget = 1; setTimeout(() => { pressTarget = 0; }, 420);
      if ((e.target as HTMLElement | null)?.closest?.('a, button')) return;
      dragging = damage(e.clientX, e.clientY, 1);
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.last = performance.now();
      if (dragging && e.buttons) damage(e.clientX, e.clientY, 0.07);
    };
    const onUp = () => { dragging = false; };
    const onSelect = (e: Event) => { if (dragging) e.preventDefault(); }; // don't select the headline mid-drag
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('touchmove', onTouch, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    addEventListener('pointercancel', onUp, { passive: true });
    document.addEventListener('selectstart', onSelect);

    const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-liquid-anchor]'));
    let idle = { x: 0, y: 0, next: 0 };
    let blink = 1, blinkAt = performance.now() + 2600;
    let raf = 0, cleared = false;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      // find the anchor with the most area on screen
      let best: DOMRect | null = null, bestArea = 0;
      for (const el of anchors) {
        const r = el.getBoundingClientRect();
        const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * r.width;
        if (vis > bestArea) { bestArea = vis; best = r; }
      }
      if (!best) {
        geo.live = false;
        if (!cleared) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); cleared = true; }
        return;
      }
      cleared = false;

      const cx = best.left + best.width / 2;
      const cy = best.top + best.height * 0.46;
      // on a phone the slot is short and wide: let the body fill its height rather than
      // leave room for the drip, and bring the shadow up to the foot of the slot
      const radius = narrow.matches ? Math.min(best.width * 0.2, best.height * 0.42) : Math.min(best.width, best.height) * 0.235;
      const shadow = narrow.matches ? Math.min(2.3, Math.max(1.25, (best.bottom - cy) / radius)) : 2.3;

      geo.cx = cx; geo.cy = cy; geo.radius = radius; geo.live = true;

      holes = holes.filter((h) => (now - h.t) / 1000 < HOLD + REGROW);
      holeData.fill(0); dirData.fill(0);
      holes.forEach((h, i) => {
        const lo = Math.floor(h.hits), hi = Math.min(lo + 1, 3), f = h.hits - lo;
        h.rad += (RADIUS[lo] + (RADIUS[hi] - RADIUS[lo]) * f - h.rad) * 0.1;
        h.depth += (DEPTH[lo] + (DEPTH[hi] - DEPTH[lo]) * f - h.depth) * 0.08;
        const k = Math.min(Math.max(((now - h.t) / 1000 - HOLD) / REGROW, 0), 1);
        const open = 1 - k * k * (3 - 2 * k);
        holeData.set([h.x - h.dx * 0.3, h.y - h.dy * 0.3, h.z - h.dz * 0.3, h.rad * open], i * 4);
        dirData.set([h.dx, h.dy, h.dz, Math.max(h.depth * open, 0.05)], i * 4);
      });

      const resting = now - pointer.last > 3200;
      if (resting && now > idle.next) idle = { x: (Math.random() - 0.5) * 1.6, y: (Math.random() - 0.5) * 0.9, next: now + 1400 + Math.random() * 2200 };
      const tx = resting ? idle.x : Math.max(-1.6, Math.min(1.6, (pointer.x - cx) / (radius * 2.2)));
      const ty = resting ? idle.y : Math.max(-1.3, Math.min(1.3, -(pointer.y - cy) / (radius * 2.2)));
      look.x += (tx - look.x) * 0.08; look.y += (ty - look.y) * 0.08;

      if (now > blinkAt) { blink = 0; blinkAt = now + 2400 + Math.random() * 4200; }
      blink += (1 - blink) * 0.2;
      press += (pressTarget - press) * 0.12;

      gl.uniform2f(U.center, cx * dpr, (CH - cy) * dpr);
      gl.uniform1f(U.radius, radius * dpr);
      gl.uniform1f(U.time, reduce ? 4.0 : (now - t0) / 1000);
      gl.uniform2f(U.look, look.x, look.y);
      gl.uniform1f(U.blink, blink);
      gl.uniform1f(U.press, press);
      gl.uniform1f(U.shadow, shadow);
      gl.uniform4fv(U.holes, holeData);
      gl.uniform4fv(U.dirs, dirData);
      gl.uniform1f(U.count, holes.length);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('touchmove', onTouch);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('pointercancel', onUp);
      document.removeEventListener('selectstart', onSelect);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="liquid" aria-hidden="true" />;
}
