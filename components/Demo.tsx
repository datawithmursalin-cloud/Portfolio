'use client';

import { useEffect, useRef, useState } from 'react';

type Scenario = { label: string; calls: [string, string, string][]; answer: React.ReactNode };

// Sample data for illustration only.
const SCENARIOS: Scenario[] = [
  {
    label: 'Who should I call first today?',
    calls: [
      ['crm', 'crm.find_leads', 'status: "open", last_touch: "> 3 days"'],
      ['dialer', 'dialer.recent_calls', 'outcome: "callback requested"'],
    ],
    answer: (
      <>
        <p><b>Start with these three.</b></p>
        <ol>
          <li>Lead A asked for a callback on Tuesday and nobody has rung back.</li>
          <li>Lead B opened your offer email twice yesterday.</li>
          <li>Lead C was marked hot and has gone nine days without a touch.</li>
        </ol>
        <p className="quiet">Want me to draft the follow-ups? Nothing goes out until you've read them.</p>
      </>
    ),
  },
  {
    label: 'Summarise yesterday’s calls',
    calls: [
      ['dialer', 'dialer.calls_by_date', 'date: "yesterday"'],
      ['reports', 'reports.build_summary', 'group_by: "caller"'],
    ],
    answer: (
      <>
        <p><b>Here's yesterday.</b></p>
        <p>The team made 412 dials and had 38 conversations. Six sellers were qualified and two asked for an offer. Price was the most common objection.</p>
        <p className="quiet">The full breakdown is saved to the daily report.</p>
      </>
    ),
  },
  {
    label: 'Clean up duplicate contacts',
    calls: [
      ['crm', 'crm.search_contacts', 'match: "phone OR email"'],
      ['crm', 'crm.propose_merges', 'dry_run: true'],
    ],
    answer: (
      <>
        <p><b>I found 27 likely duplicates.</b></p>
        <p>21 match on phone number and 6 on email. I've lined up the merges but haven't changed anything yet.</p>
        <p className="quiet">Approve all, review one by one, or cancel.</p>
      </>
    ),
  },
];

const TOOLS = [
  ['crm', 'CRM', 'contacts, pipeline, notes'],
  ['dialer', 'Dialer', 'calls, dispositions, recordings'],
  ['reports', 'Reporting', 'KPIs and daily summaries'],
];

export default function Demo() {
  const [idx, setIdx] = useState(-1);
  const [typed, setTyped] = useState('');
  const [step, setStep] = useState(0); // number of calls shown
  const [done, setDone] = useState(0); // number of calls finished
  const [answered, setAnswered] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // run the first scenario once the demo scrolls into view
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); setIdx(0); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (idx < 0) return;
    const sc = SCENARIOS[idx];
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, fast ? 0 : ms));
    setTyped(''); setStep(0); setDone(0); setAnswered(false);
    let t = 0;
    for (let i = 1; i <= sc.label.length; i++) { t += 24; at(t, () => setTyped(sc.label.slice(0, i))); }
    t += 380;
    sc.calls.forEach((_, i) => {
      at(t, () => setStep(i + 1)); t += 850;
      at(t, () => setDone(i + 1)); t += 240;
    });
    at(t, () => setAnswered(true));
    return () => timers.forEach(clearTimeout);
  }, [idx]);

  const sc = idx >= 0 ? SCENARIOS[idx] : null;
  const activeTool = sc && step > done ? sc.calls[step - 1][0] : null;

  return (
    <div className="demo" ref={root}>
      <div className="demo-side">
        <p className="label">Try a request</p>
        <div className="demo-chips">
          {SCENARIOS.map((s, i) => (
            <button key={s.label} type="button" aria-pressed={i === idx} onClick={() => setIdx(i)} data-cursor>
              <span>{String(i + 1).padStart(2, '0')}</span>{s.label}
            </button>
          ))}
        </div>
        <p className="label">Connected tools</p>
        <ul className="demo-tools">
          {TOOLS.map(([id, name, what]) => (
            <li key={id} className={activeTool === id ? 'on' : ''}><i />{name}<small>{what}</small></li>
          ))}
        </ul>
      </div>
      <div className="demo-screen" aria-live="polite">
        <div className="demo-bar"><span>assistant</span><span>sample workspace</span></div>
        <div className="demo-body">
          {sc && (
            <>
              <p className="demo-you"><span>you</span>{typed}{typed.length < sc.label.length && <i className="caret" />}</p>
              {sc.calls.slice(0, step).map(([, fn, args], i) => (
                <p key={fn} className={'demo-call' + (i < done ? ' done' : '')}><b>{fn}</b>({args})</p>
              ))}
              {answered && <div className="demo-answer">{sc.answer}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
