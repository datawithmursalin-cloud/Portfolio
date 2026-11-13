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
  ['Custom MCP servers', "An MCP server is a connector that lets an AI assistant like Claude use your own software. I build one around your tools, so you can ask for something in plain English and it reads or updates the real data. You decide what it is allowed to touch.", 'Claude · Codex · Your own tools'],
  ['CRM workflows', 'I set up pipelines, triggers and follow-up sequences in GoHighLevel, Close, HubSpot and Salesforce. New leads get assigned, tagged and followed up, even on the days your team is flat out.', 'GoHighLevel · Close · HubSpot · Salesforce'],
  ['Data analysis and visualisation', 'Send me the messy export. I clean it, work out what it says and turn it into charts or a dashboard. If you need the same report every week, I set it up to refresh on its own.', 'Python · SQL · Spreadsheets'],
  ['Scheduled AI tasks', "Jobs that run on a timer with nobody starting them: yesterday's call summary, notes on new leads, follow-up drafts, the weekly KPI report. A person still checks anything before it goes out.", 'Daily runs · Summaries · Reports'],
  ['Websites and backends', "Websites, plus the parts behind them that visitors never see: subscription billing, booking, automatic emails and keeping data in sync. I keep them running after launch too.", 'Next.js · Stripe · PostgreSQL'],
];

const STAGES = [
  ['Lead arrives', 'From a web form, a phone call or an imported list. They all end up in the same place.', ['source', '"web form"'], ['phone', '"+1 ••• ••• 0142"']],
  ['AI checks it', 'It looks for duplicates and scores how ready the seller is to talk.', ['duplicate', 'false'], ['score', '0.86']],
  ['CRM updates', 'The contact is created, tagged and put in the right pipeline stage.', ['stage', '"Hot lead"'], ['owner', '"Acquisitions"']],
  ['Dialer queues', 'A callback is scheduled. The caller sees the notes before they dial.', ['queue', '"Today, 10:30"'], ['notes', 'attached']],
  ['The report goes out', 'At the end of the day the numbers and next steps land in your inbox. Nobody has to put them together.', ['report', '"Daily KPI"'], ['sent', 'true']],
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
            <h1 data-split data-hero>I automate<br />the <em>busywork.</em></h1>
            <div className="hero-foot">
              <p data-hero-fade>I'm Syed. I started out cold calling, ended up running the team and its CRM, and now I build the automations I wish I'd had back then.</p>
              <div className="actions" data-hero-fade>
                <a className="btn btn-ink" data-contact href="#contact"><span data-contact-label>Message me</span><b>↗</b></a>
                <a className="btn" href="#work">See the work</a>
              </div>
            </div>
          </div>
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
            Most of what slows a team down is small. Someone forgets to log a call. A lead sits for a week because nobody was told. A report gets built by hand every Friday. I've done all of those jobs myself, so I know <em>which ones a computer should be doing</em>, and I build the thing that does them.
          </p>
        </section>

        {/* CAPABILITIES */}
        <section className="caps" id="capabilities">
          <header className="head">
            <p className="label">02 — Capabilities</p>
            <h2 data-split>What I <em>build.</em></h2>
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
              <h2 data-split>Follow <em>one lead</em><br />through it.</h2>
              <p className="pipe-sub">This is what happens to a single enquiry in the kind of pipeline I build for acquisitions teams. Keep scrolling.</p>
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
            <h2 data-split>Ask your tools<br /><em>a question.</em></h2>
            <p className="sub" data-fade>This is roughly what using an MCP server is like. Pick a question and watch the assistant go and get the answer. It's all sample data.</p>
          </header>
          <div data-fade><Demo /></div>
        </section>
        <Drip tone="ink" />

        {/* WORK */}
        <section className="work" id="work">
          <header className="head">
            <p className="label">06 — Selected work</p>
            <h2 data-split>Things I've <em>built.</em></h2>
          </header>

          <article className="work-panel">
            <div className="work-inner">
              <div className="work-copy">
                <p className="label">01 / Founder</p>
                <h3>VoloLeads</h3>
                <p>My company. We run seller acquisition for US real estate wholesalers, investors and agents. I built the business and the systems it runs on.</p>
                <ul>
                  <li>Subscription billing on Stripe, with webhooks and renewal emails</li>
                  <li>Onboarding calls that book themselves into Google Calendar and Meet</li>
                  <li>CRM builds in GoHighLevel and Podio for clients' acquisitions teams</li>
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
                <p>MCP servers I build for one business at a time. They give an AI assistant access to the tools and data that team already uses, limited to what the owner allows.</p>
                <ul>
                  <li>Connectors for CRMs, dialers, spreadsheets, databases and in-house tools</li>
                  <li>Ask for an analysis or a chart in plain English</li>
                  <li>Tasks that run every day and report back</li>
                  <li>It reads first. Anything it wants to change waits for approval</li>
                </ul>
                <a className="link" href="#demo">Try the demo <b>↑</b></a>
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
                <p>My studio. We build websites, apps, backends, MCP integrations and automations for businesses, and we stay on to maintain them.</p>
                <ul>
                  <li>React, Next.js and TypeScript on the front end</li>
                  <li>Node.js, PostgreSQL and Python on the back end</li>
                  <li>Seven working demos you can try on the site</li>
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
            <h2 data-split>VoloLeads <em>so far.</em></h2>
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
            <h2 data-split>I did the job <em>before I automated it.</em></h2>
          </header>
          <div className="about-grid">
            <div className="about-copy" data-fade>
              <p>I started on the phones in 2023, cold calling sellers for a Florida real estate group. Within two years I was leading the acquisition team and looking after its CRM. In 2026 I started VoloLeads and VoloTech.</p>
              <p>So when I automate something, I've usually done it by hand first. I know which steps get skipped on a busy day, where leads go cold and which reports nobody opens.</p>
              <p>I also have an economics degree and work as a university research assistant, mostly cleaning survey data and running regressions in Stata. That's where the data side comes from.</p>
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
          <h2 data-split>What are you <em>tired of doing</em> by hand?</h2>
          <p className="sub" data-fade>Send me a message about it. I'll tell you how I'd automate it and roughly what it would take.</p>
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
