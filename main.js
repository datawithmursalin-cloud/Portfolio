/* ------------------------------------------------------------------
   Contact settings. Put your WhatsApp number here in international
   format, digits only (example: '15551234567'). While it is empty,
   every contact button falls back to LinkedIn and reads "Message me".
------------------------------------------------------------------- */
const CONFIG = {
  whatsapp: '',
  whatsappText: "Hi Syed, I saw your portfolio and I'd like to talk about automating ",
  linkedin: 'https://www.linkedin.com/in/syedmursalin',
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- contact buttons ---------- */
(() => {
  const hasWa = /^\d{7,15}$/.test(CONFIG.whatsapp);
  const href = hasWa
    ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappText)}`
    : CONFIG.linkedin;
  $$('[data-contact]').forEach((a) => {
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    const label = $('[data-contact-label]', a);
    if (label) label.textContent = hasWa ? 'WhatsApp me' : 'Message me';
  });
  $('#year').textContent = new Date().getFullYear();
})();

/* ---------- mobile menu ---------- */
(() => {
  const btn = $('#menuBtn');
  const links = $('#navLinks');
  const set = (open) => {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(!links.classList.contains('open')));
  links.addEventListener('click', (e) => e.target.closest('a') && set(false));
})();

/* ---------- pointer state shared by robot, spotlight, cards ---------- */
const pointer = { x: innerWidth * 0.7, y: innerHeight * 0.3, active: false, last: 0 };
addEventListener('pointermove', (e) => {
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.last = performance.now();
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });
addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  if (t) { pointer.x = t.clientX; pointer.y = t.clientY; pointer.active = true; pointer.last = performance.now(); }
}, { passive: true });

/* ---------- the robot ---------- */
(() => {
  const svg = $('#bot');
  if (!svg) return;
  const head = $('#botHead');
  const eyes = $$('.eye', svg).map((g) => ({
    pupil: $('.pupil', g), cx: +g.dataset.cx, cy: +g.dataset.cy, x: 0, y: 0,
  }));
  const eyesGroup = $('#eyes');
  const happy = $('#happy');
  const mouth = $('#mouth');
  const bubble = $('#bubble');
  const MAX = 26; // how far a pupil can travel, in SVG units

  const lines = [
    "Hi. Move your cursor, I'm watching.",
    'I read CRMs so you don’t have to.',
    'Beep. That follow-up is already sent.',
    'I never forget a lead. Ever.',
    'Ask Syed what I can do for your team.',
    'Still here. Still not tired.',
  ];
  let lineIdx = 0;
  const say = (text) => {
    if (bubble.textContent === text) return;
    bubble.classList.add('swap');
    setTimeout(() => { bubble.textContent = text; bubble.classList.remove('swap'); }, 220);
  };

  let happyUntil = 0;
  const cheer = () => {
    happyUntil = performance.now() + 1100;
    lineIdx = (lineIdx + 1) % lines.length;
    say(lines[lineIdx]);
  };
  svg.addEventListener('click', cheer);

  $$('.btn-primary, .sticky-cta').forEach((b) => {
    b.addEventListener('pointerenter', () => say('Go on. Say hi.'));
  });

  // blinking
  const blink = () => {
    eyes.forEach((e) => e.pupil.setAttribute('ry', 2));
    setTimeout(() => eyes.forEach((e) => e.pupil.setAttribute('ry', 25)), 120);
    setTimeout(blink, 2200 + Math.random() * 3800);
  };
  if (!reduceMotion) setTimeout(blink, 1800);

  // idle wandering target (used on touch devices and when the pointer rests)
  let idle = { x: 0, y: 0, next: 0 };

  const frame = (now) => {
    const rect = svg.getBoundingClientRect();
    const scale = rect.width / 360;
    const resting = !pointer.active || now - pointer.last > 3500;

    if (resting && now > idle.next) {
      idle = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 1.2, next: now + 1200 + Math.random() * 1800 };
    }

    let headX = 0, headY = 0;
    eyes.forEach((e) => {
      let tx, ty;
      if (resting) {
        tx = idle.x * MAX * 0.8; ty = idle.y * MAX * 0.6;
      } else {
        const ex = rect.left + e.cx * scale;
        const ey = rect.top + e.cy * scale;
        const dx = (pointer.x - ex) / scale;
        const dy = (pointer.y - ey) / scale;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(MAX, dist * 0.14);
        tx = (dx / dist) * reach; ty = (dy / dist) * reach * 0.8;
      }
      e.x += (tx - e.x) * 0.16; e.y += (ty - e.y) * 0.16;
      e.pupil.setAttribute('transform', `translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})`);
      headX += e.x; headY += e.y;
    });

    // the whole head leans a little toward whatever it is looking at
    const tilt = (headX / 2 / MAX) * 7;
    const nod = (headY / 2 / MAX) * 5;
    head.style.transform = `rotate(${tilt.toFixed(2)}deg) translateY(${nod.toFixed(2)}px)`;

    const isHappy = now < happyUntil;
    eyesGroup.setAttribute('opacity', isHappy ? 0 : 1);
    happy.setAttribute('opacity', isHappy ? 1 : 0);
    mouth.setAttribute('d', isHappy ? 'M150 258q30 26 60 0' : 'M156 262q24 14 48 0');

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();

/* ---------- background particle field ---------- */
(() => {
  const canvas = $('#field');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, pts = [];
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr; h = canvas.height = innerHeight * dpr;
    const count = Math.min(70, Math.round((innerWidth * innerHeight) / 22000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr,
    }));
  };
  resize();
  addEventListener('resize', resize);
  const link = 150;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const L = link * dpr;
    const px = pointer.x * dpr, py = pointer.y * dpr;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const near = Math.hypot(p.x - px, p.y - py) < L * 1.4;
      ctx.fillStyle = near ? 'rgba(182,255,60,.9)' : 'rgba(255,255,255,.28)';
      ctx.beginPath(); ctx.arc(p.x, p.y, (near ? 1.8 : 1.1) * dpr, 0, 6.3); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < L) {
          ctx.strokeStyle = `rgba(140,150,180,${(1 - d / L) * 0.16})`;
          ctx.lineWidth = dpr;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const a = pts[i];
      const d = Math.hypot(a.x - px, a.y - py);
      if (pointer.active && d < L * 1.4) {
        ctx.strokeStyle = `rgba(182,255,60,${(1 - d / (L * 1.4)) * 0.35})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(px, py); ctx.stroke();
      }
    }
    if (!document.hidden) requestAnimationFrame(draw);
  };
  document.addEventListener('visibilitychange', () => !document.hidden && requestAnimationFrame(draw));
  requestAnimationFrame(draw);
})();

/* ---------- scroll reveal, counters, sticky CTA ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  const fmt = (n, dec) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const counters = $$('[data-count]');
  if (!reduceMotion) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; cio.unobserve(el);
        const end = +el.dataset.count, dec = +(el.dataset.decimals || 0), suffix = el.dataset.suffix || '';
        const t0 = performance.now(), dur = 1400;
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = fmt(end * eased, dec) + suffix;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  const sticky = $('.sticky-cta');
  const contact = $('#contact');
  const onScroll = () => {
    const nearEnd = contact.getBoundingClientRect().top < innerHeight * 0.9;
    sticky.classList.toggle('show', scrollY > innerHeight * 0.6 && !nearEnd);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- card tilt ---------- */
(() => {
  if (reduceMotion || !matchMedia('(hover: hover)').matches) return;
  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--cx', x * 100 + '%');
      card.style.setProperty('--cy', y * 100 + '%');
      card.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
})();

/* ---------- "ask your CRM" demo (sample data) ---------- */
(() => {
  const term = $('#terminal');
  const chips = $('#chips');
  if (!term || !chips) return;

  const scenarios = [
    {
      label: 'Who should I call first today?',
      calls: [
        ['crm', 'crm.find_leads', 'status: "open", last_touch: "> 3 days"'],
        ['dialer', 'dialer.recent_calls', 'outcome: "callback requested"'],
      ],
      answer: `<b>Three leads are worth your first hour:</b>
        <ol>
          <li><b>Lead A</b> asked for a callback on Tuesday and nobody has rung back.</li>
          <li><b>Lead B</b> opened your offer email twice yesterday.</li>
          <li><b>Lead C</b> has gone 9 days without a touch but was marked "hot".</li>
        </ol>
        <small>Want me to draft the follow-up texts? You review before anything is sent.</small>`,
    },
    {
      label: 'Summarise yesterday’s calls',
      calls: [
        ['dialer', 'dialer.calls_by_date', 'date: "yesterday"'],
        ['reports', 'reports.build_summary', 'group_by: "caller"'],
      ],
      answer: `<b>Yesterday in one paragraph:</b> the team made 412 dials and had 38 conversations.
        6 sellers were qualified and 2 asked for an offer. The most common objection was price,
        and one caller is converting at twice the floor average.
        <small>The full breakdown is saved to the daily report sheet.</small>`,
    },
    {
      label: 'Clean up duplicate contacts',
      calls: [
        ['crm', 'crm.search_contacts', 'match: "phone OR email"'],
        ['crm', 'crm.propose_merges', 'dry_run: true'],
      ],
      answer: `<b>Found 27 likely duplicates.</b> 21 match on phone number and 6 on email.
        I've prepared the merges but changed nothing yet.
        <small>Approve all, review one by one, or cancel. Nothing is written without your say-so.</small>`,
    },
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  let runId = 0;

  const setTool = (name) => $$('#toolList li').forEach((li) => li.classList.toggle('on', li.dataset.tool === name));

  const type = async (el, text, id, speed = 22) => {
    if (reduceMotion) { el.textContent = text; return; }
    for (let i = 1; i <= text.length; i++) {
      if (id !== runId) return;
      el.textContent = text.slice(0, i);
      await sleep(speed);
    }
  };

  const run = async (idx) => {
    const id = ++runId;
    const sc = scenarios[idx];
    $$('.chip', chips).forEach((c, i) => c.setAttribute('aria-pressed', String(i === idx)));
    term.innerHTML = '';
    setTool(null);

    const user = document.createElement('div');
    user.className = 't-user';
    const span = document.createElement('span');
    const caret = document.createElement('i');
    caret.className = 'caret';
    user.append(span, caret);
    term.append(user);
    await type(span, sc.label, id);
    if (id !== runId) return;
    caret.remove();
    await sleep(350);

    for (const [tool, fn, args] of sc.calls) {
      if (id !== runId) return;
      setTool(tool);
      const line = document.createElement('div');
      line.className = 't-call';
      line.innerHTML = `→ <b>${fn}</b>(${args})`;
      term.append(line);
      await sleep(900);
      if (id !== runId) return;
      line.classList.add('done');
      await sleep(250);
    }
    if (id !== runId) return;
    setTool(null);
    const ans = document.createElement('div');
    ans.className = 't-answer';
    ans.innerHTML = sc.answer;
    term.append(ans);
  };

  scenarios.forEach((sc, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = sc.label;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => run(i));
    chips.append(b);
  });

  // start the first scenario the first time the demo scrolls into view
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); run(0); }
  }, { threshold: 0.35 });
  io.observe(term);
})();
