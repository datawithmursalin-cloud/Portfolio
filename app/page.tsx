import Liquid from '@/components/Liquid';
import Experience from '@/components/Experience';
import Demo from '@/components/Demo';
import Flow from '@/components/Flow';
import { ICONS } from '@/lib/icons';
import { CONTACT } from '@/lib/contact';
import { BASE } from '@/lib/site';

function Shot({ name, alt }: { name: string; alt: string }) {
  return (
    <img
      src={`${BASE}/work/${name}-900.webp`}
      srcSet={`${BASE}/work/${name}-900.webp 900w, ${BASE}/work/${name}-1800.webp 1800w`}
      sizes="(max-width: 900px) 92vw, 50vw"
      width={1800} height={1125} alt={alt} loading="lazy" decoding="async"
    />
  );
}

const TOOLS: [string, string][] = [
  ['Model Context Protocol', 'mcp'], ['Claude', 'claude'], ['Codex', 'openai'], ['n8n', 'n8n'],
  ['GoHighLevel', 'ghl'], ['Close', 'close'], ['HubSpot', 'hubspot'], ['Salesforce', 'salesforce'],
  ['Microsoft Office', 'microsoft'], ['Google Workspace', 'google'], ['Python', 'python'], ['PostgreSQL', 'postgres'],
  ['Stripe', 'stripe'], ['Next.js', 'next'], ['Node.js', 'node'],
];

const CAPABILITIES = [
  ['Custom MCP servers', 'Model Context Protocol servers built around your business, so an AI assistant can read and act on your own tools and data in plain English, with permissions you control.', 'Any tool · Any data · Your rules'],
  ['CRM workflows', 'Pipelines, triggers and follow-up sequences inside GoHighLevel, Close, HubSpot and Salesforce, so every lead is routed, tagged and chased without anyone remembering to do it.', 'GoHighLevel · Close · HubSpot · Salesforce'],
  ['Data analysis and visualisation', 'Messy exports cleaned, analysed and turned into charts and dashboards people actually read, from a one-off question to a report that refreshes itself.', 'Python · SQL · Spreadsheets'],
  ['Scheduled AI tasks', 'The daily jobs, handed to AI and run on a timer: call summaries, lead notes, follow-up drafts and KPI reports, reviewed by a person before anything is sent.', 'Daily runs · Summaries · Reports'],
  ['Websites and backends', 'Marketing sites with the plumbing behind them: subscription billing, booking, transactional email and data sync, shipped and maintained.', 'Next.js · Stripe · PostgreSQL'],
];

const STAGES = [
  ['Lead arrives', 'A form, a call or a list import. Whatever the source, it lands in one place.', ['source', '"web form"'], ['phone', '"+1 ••• ••• 0142"']],
  ['AI qualifies', 'An agent checks the details, flags duplicates and scores how ready the seller is.', ['duplicate', 'false'], ['score', '0.86']],
  ['CRM updates', 'The record is created, tagged and placed in the right pipeline stage.', ['stage', '"Hot lead"'], ['owner', '"Acquisitions"']],
  ['Dialer queues', 'The callback is scheduled and the caller sees the notes before they ring.', ['queue', '"Today, 10:30"'], ['notes', 'attached']],
  ['Report writes itself', 'At the end of the day the numbers and next steps arrive without anyone compiling them.', ['report', '"Daily KPI"'], ['sent', 'true']],
];

// width, left %, length px (fixed so server and client render the same drips)
const DRIPS = [
  [26, 4, 70], [44, 11, 150], [18, 17, 46], [34, 26, 104], [22, 33, 60], [52, 43, 176], [20, 51, 52],
  [30, 58, 96], [16, 64, 40], [46, 72, 138], [24, 80, 74], [36, 88, 112], [18, 95, 50],
];

function Drip({ tone }: { tone: 'ink' | 'paper' }) {
  return (
    <div className={`drip drip-${tone}`} aria-hidden="true">
      <div className="drip-goo">
        <i className="drip-bar" />
        {DRIPS.map(([w, l, h], i) => (
          <i key={i} className="drip-run" style={{ width: w, left: `${l}%`, ['--h' as string]: `${h}px` }} />
        ))}
        <i className="drip-drop" style={{ left: 'calc(11% + 12px)', ['--h' as string]: '150px' }} />
        <i className="drip-drop late" style={{ left: 'calc(72% + 13px)', ['--h' as string]: '138px' }} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <svg className="defs" aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <div className="intro" aria-hidden="true"><span>Syed M. Mursalin</span><i /></div>
      <Liquid />
      <Experience />

      <header className="nav">
        <a href="#top" className="nav-name">Syed M. Mursalin</a>
        <nav aria-label="Sections">
          <a href="#capabilities">Capabilities</a>
          <a href="#pipeline">Pipeline</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
        </nav>
        <a className="nav-cta" data-contact href="#contact"><i />Available for projects</a>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="top">
          <div className="hero-form" data-liquid-anchor />
          <div className="hero-copy">
            <p className="label" data-hero-fade>AI automation · Custom MCP servers · Data workflows</p>
            <h1 data-split data-hero>Work that <em>flows</em><br />by itself.</h1>
            <div className="hero-foot">
              <p data-hero-fade>I'm Syed. I build the workflows, connectors and AI agents that sit between your tools, your data and your team.</p>
              <div className="actions" data-hero-fade>
                <a className="btn btn-ink" data-contact href="#contact"><span data-contact-label>Message me</span><b>↗</b></a>
                <a className="btn" href="#work">See the work</a>
              </div>
            </div>
          </div>
          <p className="hero-hint label" data-hero-fade>It follows your cursor. Click or drag to carve it. It grows back.</p>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-label="Tools I work with">
          <div className="marquee-track">
            {[0, 1].map((k) => TOOLS.map(([name, icon]) => (
              <span key={k + name} aria-hidden={k === 1}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[icon]} /></svg>
                {name}
              </span>
            )))}
          </div>
        </div>

        {/* STATEMENT */}
        <section className="statement">
          <p className="label">01 — Introduction</p>
          <p className="statement-text" data-scrub>
            Most teams lose hours to work that software should already be doing. I find those hours, then build the <em>quiet systems</em> that give them back: a CRM that updates itself, a dialer that knows who to call, and an assistant that answers questions about your pipeline.
          </p>
        </section>

        {/* CAPABILITIES */}
        <section className="caps" id="capabilities">
          <header className="head">
            <p className="label">02 — Capabilities</p>
            <h2 data-split>Five ways I take work <em>off your plate.</em></h2>
          </header>
          <ul className="cap-list">
            {CAPABILITIES.map(([title, body, tags], i) => (
              <li key={title} data-fade data-cursor>
                <span className="cap-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="cap-tags">{tags}</span>
              </li>
            ))}
          </ul>
        </section>

        <Flow />

        {/* PIPELINE (dark) */}
        <Drip tone="paper" />
        <section className="pipe dark" id="pipeline">
          <div className="pipe-track">
            <div className="pipe-intro">
              <p className="label">04 — Pipeline</p>
              <h2 data-split>One lead.<br /><em>Zero</em> copy and paste.</h2>
              <p className="pipe-sub">Follow a single enquiry through an automated acquisition pipeline. Keep scrolling.</p>
            </div>
            <div className="pipe-stages">
              <div className="pipe-line"><i /><b /></div>
              {STAGES.map(([title, body, a, b], i) => (
                <article className="stage" key={title as string}>
                  <span className="stage-dot" />
                  <span className="stage-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{title as string}</h3>
                  <p>{body as string}</p>
                  <pre aria-hidden="true">
                    <span>{(a as string[])[0]}</span>{': '}{(a as string[])[1]}{'\n'}
                    <span>{(b as string[])[0]}</span>{': '}{(b as string[])[1]}
                  </pre>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO (dark) */}
        <section className="ask dark" id="demo">
          <header className="head">
            <p className="label">05 — Ask your tools</p>
            <h2 data-split>Ask a question.<br />Get an <em>answer</em>, not a dashboard.</h2>
            <p className="sub" data-fade>This is what an MCP connector feels like. Pick a request and watch the assistant call the tools. Everything shown is sample data.</p>
          </header>
          <div data-fade><Demo /></div>
        </section>
        <Drip tone="ink" />

        {/* WORK */}
        <section className="work" id="work">
          <header className="head">
            <p className="label">06 — Selected work</p>
            <h2 data-split>Built, shipped and <em>still running.</em></h2>
          </header>

          <article className="work-panel">
            <div className="work-inner">
              <div className="work-copy">
                <p className="label">01 / Founder</p>
                <h3>VoloLeads</h3>
                <p>A managed seller-acquisition service for US real estate wholesalers, investors and agents. I built the company and the systems under it.</p>
                <ul>
                  <li>Subscription billing on Stripe with webhooks and renewal emails</li>
                  <li>Onboarding calls booked into Google Calendar and Meet</li>
                  <li>CRM builds in GoHighLevel and Podio for acquisitions teams</li>
                </ul>
                <a className="link" href="https://www.vololeads.com" target="_blank" rel="noopener">vololeads.com <b>↗</b></a>
              </div>
              <div className="work-shot"><div className="chrome"><i /><i /><i /><span>vololeads.com</span></div><Shot name="vololeads" alt="The VoloLeads website home page" /></div>
            </div>
          </article>

          <article className="work-panel">
            <div className="work-inner tone-ink">
              <div className="work-copy">
                <p className="label">02 / Workflow automation</p>
                <h3>Custom MCPs</h3>
                <p>Model Context Protocol servers built around one business's needs, giving an AI assistant direct, permissioned access to the tools and data its team already uses.</p>
                <ul>
                  <li>Connectors for CRMs, dialers, spreadsheets, databases and internal tools</li>
                  <li>Data analysis and charts on request, asked for in plain English</li>
                  <li>Scheduled tasks that run every day and report back</li>
                  <li>Read first, and review before anything is written back</li>
                </ul>
                <a className="link" href="#demo">See how it feels <b>↑</b></a>
              </div>
              <div className="work-code" aria-hidden="true">
                <p className="label">Illustrative tool definition</p>
                <pre>{`server.tool(
  `}<span>{`"find_leads"`}</span>{`,
  { status, last_touch },
  `}<b>{`async`}</b>{` (query) => {
    `}<b>{`const`}</b>{` leads = `}<b>{`await`}</b>{` crm.search(query);
    `}<b>{`return`}</b>{` rank(leads);
  }
);`}</pre>
                <div className="work-wires"><span>CRM</span><span>Data</span><span>Charts</span><span>Schedules</span><b>AI</b></div>
              </div>
            </div>
          </article>

          <article className="work-panel">
            <div className="work-inner">
              <div className="work-copy">
                <p className="label">03 / Studio</p>
                <h3>VoloTech</h3>
                <p>Websites, applications, backend systems, MCP integrations and automation for businesses that need the missing piece built, then looked after.</p>
                <ul>
                  <li>React, Next.js and TypeScript on the front</li>
                  <li>Node.js, PostgreSQL and Python behind it</li>
                  <li>Seven working demo builds on the site</li>
                </ul>
                <a className="link" href="https://www.volotech.us" target="_blank" rel="noopener">volotech.us <b>↗</b></a>
              </div>
              <div className="work-shot"><div className="chrome"><i /><i /><i /><span>volotech.us</span></div><Shot name="volotech" alt="The VoloTech website home page" /></div>
            </div>
          </article>
        </section>

        {/* PROOF */}
        <section className="proof" id="results">
          <header className="head">
            <p className="label">07 — Results</p>
            <h2 data-split>Numbers from the company <em>I run on these systems.</em></h2>
          </header>
          <dl className="stats">
            <div data-fade><dt data-count="50" data-suffix="+">50+</dt><dd>clients across the United States</dd></div>
            <div data-fade><dt data-count="10000" data-suffix="+">10,000+</dt><dd>qualified leads generated</dd></div>
            <div data-fade><dt data-count="4.9" data-decimals="1">4.9</dt><dd>average client rating</dd></div>
          </dl>
          <div className="quotes">
            <figure data-fade>
              <blockquote>In our first month, Syed and his team helped me generate a <em>$28,000 deal.</em></blockquote>
              <figcaption>Arya Saliany<span>Founder, College of Wholesale</span></figcaption>
            </figure>
            <figure data-fade>
              <blockquote>Syed spent over an hour with me on an issue I was having with my CRM and Dialer. He absolutely went over and above just to help me out.</blockquote>
              <figcaption>Keenan Lusk<span>Founder, Texas Home Resources</span></figcaption>
            </figure>
            <figure data-fade>
              <blockquote>When I ran into problems importing our lead data into the CRM they stepped in and handled the integration for me.</blockquote>
              <figcaption>Rodrigo Moran<span>Real estate wholesaler, Florida</span></figcaption>
            </figure>
          </div>
          <p className="label note">Figures and client reviews are for VoloLeads, as published on vololeads.com.</p>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <header className="head">
            <p className="label">08 — About</p>
            <h2 data-split>Operator first. <em>Builder second.</em></h2>
          </header>
          <div className="about-grid">
            <div className="about-copy" data-fade>
              <p>I started on the phones in 2023, cold calling sellers for a Florida real estate group. Within two years I was leading the acquisition team and running its CRM workflows, and in 2026 I founded VoloLeads and VoloTech.</p>
              <p>That is why my automations look the way they do. I know which steps a sales team skips when it gets busy, where leads go quiet and which reports nobody reads.</p>
              <p>I am also an economics graduate and a university research assistant, so the data side gets the same care as the build.</p>
              <p className="label">Based in Dhaka, Bangladesh · Working with clients in the United States</p>
              <div className="about-links">
                <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email} <b>↗</b></a>
                <a className="link" href={CONTACT.linkedin} target="_blank" rel="noopener">Full history on LinkedIn <b>↗</b></a>
                <a className="link" href={CONTACT.facebook} target="_blank" rel="noopener">Facebook <b>↗</b></a>
              </div>
            </div>
            <ol className="timeline">
              <li data-fade><span>2026 — Now</span><h3>Founder &amp; CEO, VoloLeads</h3><p>Virtual assistant services and automated solutions for real estate wholesalers in the United States.</p></li>
              <li data-fade><span>2026 — Now</span><h3>Founder &amp; CEO, VoloTech</h3><p>A studio building websites, applications, backend systems, MCP integrations and automation for businesses.</p></li>
              <li data-fade><span>2025 — Now</span><h3>Lead Manager, All With Realty</h3><p>Joined as Virtual Acquisition Team Leader, running a remote cold calling team and its CRM workflows. Conversion rates rose by over 90%, with more than $24,000 in revenue in three months.</p></li>
              <li data-fade><span>2024 — Now</span><h3>Research Assistant, North South University</h3><p>Cleaning large survey datasets and running regression models in Stata for a study of labour-market effects in Cox's Bazar.</p></li>
              <li data-fade><span>2023 — 2025</span><h3>Virtual Telemarketer, Rise Real Estate Group</h3><p>Lead generation and first-contact outreach for the US real estate market, handing qualified sellers to the acquisition team.</p></li>
              <li data-fade><span>2022 — 2025</span><h3>BS in Economics, North South University</h3><p>Followed by certifications in machine learning foundations and Stata.</p></li>
            </ol>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <div className="contact-form" data-liquid-anchor />
          <p className="label">09 — Contact</p>
          <h2 data-split>Tell me the task you are <em>tired of doing.</em></h2>
          <p className="sub" data-fade>Send one message describing it. I will reply with how I would automate it and what it would take.</p>
          <div className="actions" data-fade>
            <a className="btn btn-ink btn-xl" data-contact href="https://www.linkedin.com/in/syedmursalin"><span data-contact-label>Message me</span><b>↗</b></a>
            <a className="btn btn-xl" href={`mailto:${CONTACT.email}`}>Email me</a>
            <a className="btn btn-xl" href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          </div>
          <p className="contact-mail" data-fade><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 Syed M. Mursalin</span>
        <span><a href="https://www.vololeads.com" target="_blank" rel="noopener">VoloLeads</a><a href="https://www.volotech.us" target="_blank" rel="noopener">VoloTech</a><a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a><a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a><a href={`mailto:${CONTACT.email}`}>Email</a></span>
      </footer>
    </>
  );
}
