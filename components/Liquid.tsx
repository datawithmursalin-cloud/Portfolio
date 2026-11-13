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
  vec2 sp = (uv - vec2(0.0, -2.3)) / vec2(1.7, 0.13);
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
  for (int i = 0; i < 64; i++) {
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
  vec3 col = env(reflect(rd, n));
  col = mix(col, vec3(1.0), fres * 0.45);
  // a breath of thin-film colour at grazing angles
  col += 0.07 * fres * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 1.4 + uTime * 0.04));
  col = col / (1.0 + col * 0.28);
  col = pow(col, vec3(0.92));

  // eyes: two black glass capsules set into the main body, aimed at the pointer
  vec3 q = p - C;
  float onBody = smoothstep(1.13, 1.03, length(q));
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
    const U = { center: u('uCenter'), radius: u('uRadius'), time: u('uTime'), look: u('uLook'), blink: u('uBlink'), press: u('uPress') };

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches;
    let dpr = 1, W = 0, H = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      W = Math.round(innerWidth * dpr); H = Math.round(innerHeight * dpr);
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    addEventListener('resize', resize);

    const pointer = { x: innerWidth * 0.5, y: innerHeight * 0.5, last: -1e9 };
    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.last = performance.now(); };
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) { pointer.x = t.clientX; pointer.y = t.clientY; pointer.last = performance.now(); } };
    let press = 0, pressTarget = 0;
    const onDown = () => { pressTarget = 1; setTimeout(() => { pressTarget = 0; }, 420); };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('touchmove', onTouch, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });

    const anchors = () => Array.from(document.querySelectorAll<HTMLElement>('[data-liquid-anchor]'));
    const look = { x: 0, y: 0 };
    let idle = { x: 0, y: 0, next: 0 };
    let blink = 1, blinkAt = performance.now() + 2600;
    let raf = 0, cleared = false;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      // find the anchor with the most area on screen
      let best: DOMRect | null = null, bestArea = 0;
      for (const el of anchors()) {
        const r = el.getBoundingClientRect();
        const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * r.width;
        if (vis > bestArea) { bestArea = vis; best = r; }
      }
      if (!best) {
        if (!cleared) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); cleared = true; }
        return;
      }
      cleared = false;

      const cx = best.left + best.width / 2;
      const cy = best.top + best.height * 0.46;
      const radius = Math.min(best.width, best.height) * 0.235;

      const resting = now - pointer.last > 3200;
      if (resting && now > idle.next) idle = { x: (Math.random() - 0.5) * 1.6, y: (Math.random() - 0.5) * 0.9, next: now + 1400 + Math.random() * 2200 };
      const tx = resting ? idle.x : Math.max(-1.6, Math.min(1.6, (pointer.x - cx) / (radius * 2.2)));
      const ty = resting ? idle.y : Math.max(-1.3, Math.min(1.3, -(pointer.y - cy) / (radius * 2.2)));
      look.x += (tx - look.x) * 0.08; look.y += (ty - look.y) * 0.08;

      if (now > blinkAt) { blink = 0; blinkAt = now + 2400 + Math.random() * 4200; }
      blink += (1 - blink) * 0.2;
      press += (pressTarget - press) * 0.12;

      gl.uniform2f(U.center, cx * dpr, (innerHeight - cy) * dpr);
      gl.uniform1f(U.radius, radius * dpr);
      gl.uniform1f(U.time, reduce ? 4.0 : (now - t0) / 1000);
      gl.uniform2f(U.look, look.x, look.y);
      gl.uniform1f(U.blink, blink);
      gl.uniform1f(U.press, press);
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
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="liquid" aria-hidden="true" />;
}
