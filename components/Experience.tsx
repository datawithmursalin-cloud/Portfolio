'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CONTACT } from '@/lib/contact';

/* Wires up everything that moves: smooth scrolling, text reveals,
   the pinned pipeline, the liquid drips, counters and the cursor. */

function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (child.textContent || '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = part;
          w.append(i); frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== 'BR') {
        walk(child);
      }
    }
  };
  walk(el);
  return Array.from(el.querySelectorAll<HTMLElement>('.wi'));
}

export default function Experience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $$ = <T extends HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));

    // contact buttons
    const hasWa = /^\d{7,15}$/.test(CONTACT.whatsapp);
    const href = hasWa ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappText)}` : CONTACT.linkedin;
    $$<HTMLAnchorElement>('[data-contact]').forEach((a) => {
      a.href = href; a.target = '_blank'; a.rel = 'noopener';
      const label = a.querySelector('[data-contact-label]');
      if (label) label.textContent = hasWa ? 'WhatsApp me' : 'Message me';
    });

    // the workflow graph: p (0 to 1) draws each set of connections, then lights the row it reaches
    const flow = document.querySelector<HTMLElement>('.flow');
    const flowRows = flow ? Array.from(flow.querySelectorAll<HTMLElement | SVGElement>('.fnode, .flow-steps li')) : [];
    const flowEdges = flow ? Array.from(flow.querySelectorAll<SVGPathElement>('.fdraw, .fdots')) : [];
    const drawFlow = (p: number) => {
      const s = p * 6.5;
      const now = Math.min(5, Math.floor(s));
      flowRows.forEach((el) => {
        const r = +el.dataset.row!;
        el.classList.toggle('on', s >= (r || 0.12));
        el.classList.toggle('now', s >= 0.12 && r === now);
      });
      flowEdges.forEach((el) => {
        const v = Math.min(Math.max((s - +el.dataset.row! - 0.3) / 0.7, 0), 1);
        if (el.classList.contains('fdraw')) el.style.strokeDashoffset = String(1 - v);
        else el.style.opacity = v >= 1 ? '1' : '0';
      });
    };

    if (reduce) { drawFlow(1); root.classList.add('ready', 'static'); return; }

    // smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
    const lenis = new Lenis({ lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector<HTMLElement>(a.getAttribute('href')!);
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: 0, duration: 1.4 }); }
    };
    document.addEventListener('click', onAnchor);

    const ctx = gsap.context(() => {
      // headline reveals: each word rises out of a mask
      $$('[data-split]').forEach((el) => {
        const words = splitWords(el);
        const hero = el.hasAttribute('data-hero');
        gsap.from(words, {
          yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.045, delay: hero ? 0.55 : 0,
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 86%' },
        });
      });

      // the statement lights up word by word as it crosses the screen
      $$('[data-scrub]').forEach((el) => {
        const words = splitWords(el);
        gsap.fromTo(words, { opacity: 0.12 }, {
          opacity: 1, stagger: 0.1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: 0.4 },
        });
      });

      ScrollTrigger.batch('[data-fade]', {
        start: 'top 90%', once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
      });
      gsap.set('[data-fade]', { opacity: 0, y: 36 });
      gsap.to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 1.0 });

      // counters
      $$('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count!), dec = +(el.dataset.decimals || 0), suffix = el.dataset.suffix || '';
        const v = { n: 0 };
        gsap.to(v, {
          n: end, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => { el.textContent = v.n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; },
        });
      });

      // liquid drips grow as their edge scrolls through the viewport
      $$('.drip').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 95%', end: 'top 25%', scrub: 0.6,
          onUpdate: (self) => el.style.setProperty('--p', self.progress.toFixed(3)),
        });
      });

      // parallax
      $$('[data-speed]').forEach((el) => {
        gsap.to(el, { yPercent: parseFloat(el.dataset.speed!) * -100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      // the pipeline: pinned and scrolled sideways on wide screens, a drawn line on narrow ones
      const mm = gsap.matchMedia();
      const stages = $$('.stage');
      const light = (p: number) => stages.forEach((s, i) => s.classList.toggle('on', p >= i / stages.length - 0.02));
      mm.add('(min-width: 901px)', () => {
        const track = document.querySelector<HTMLElement>('.pipe-track')!;
        const dist = () => track.scrollWidth - innerWidth;
        gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: '.pipe', pin: true, scrub: 0.5, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true,
            onUpdate: (self) => { root.style.setProperty('--pipe', self.progress.toFixed(4)); light(self.progress * 1.12); },
          },
        });
      });
      mm.add('(min-width: 901px)', () => {
        ScrollTrigger.create({ trigger: '.flow', start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => drawFlow(self.progress) });
      });
      mm.add('(max-width: 900px)', () => {
        ScrollTrigger.create({ trigger: '.flow-graph', start: 'top 75%', end: 'bottom 55%', scrub: 0.4, onUpdate: (self) => drawFlow(self.progress) });
      });
      mm.add('(max-width: 900px)', () => {
        ScrollTrigger.create({
          trigger: '.pipe-track', start: 'top 70%', end: 'bottom 60%', scrub: 0.4,
          onUpdate: (self) => { root.style.setProperty('--pipe', self.progress.toFixed(4)); light(self.progress * 1.15); },
        });
      });

      // work panels settle back as the next one slides over them
      const panels = $$('.work-panel');
      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return;
        gsap.to(panel.querySelector('.work-inner'), {
          scale: 0.94, opacity: 0.55, ease: 'none',
          scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top 12%', scrub: true },
        });
      });

      // marquee leans with scroll velocity
      const marquee = document.querySelector<HTMLElement>('.marquee-track');
      if (marquee) {
        const skew = gsap.quickTo(marquee, 'skewX', { duration: 0.5, ease: 'power3' });
        ScrollTrigger.create({ onUpdate: (self) => skew(gsap.utils.clamp(-12, 12, self.getVelocity() / -260)) });
      }
    });

    // cursor
    const cursor = document.querySelector<HTMLElement>('.cursor');
    let moveCursor: ((e: PointerEvent) => void) | null = null;
    let overCursor: ((e: PointerEvent) => void) | null = null;
    if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const x = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
      const y = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
      moveCursor = (e) => { x(e.clientX); y(e.clientY); cursor.classList.add('live'); };
      overCursor = (e) => cursor.classList.toggle('big', !!(e.target as HTMLElement).closest('a, button, [data-cursor]'));
      addEventListener('pointermove', moveCursor, { passive: true });
      addEventListener('pointerover', overCursor, { passive: true });
    }

    root.classList.add('ready');
    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.removeEventListener('click', onAnchor);
      removeEventListener('load', refresh);
      if (moveCursor) removeEventListener('pointermove', moveCursor);
      if (overCursor) removeEventListener('pointerover', overCursor);
    };
  }, []);

  return <div className="cursor" aria-hidden="true" />;
}
