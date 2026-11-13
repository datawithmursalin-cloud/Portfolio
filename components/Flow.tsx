/*
  A workflow drawn as a graph. The section is tall and its content sticks, so
  scrolling draws each set of connections and lights the row they lead to.
  Experience.tsx drives it through the .fdraw paths and [data-row] elements.
*/

const STEPS = [
  ['Something starts it', 'A schedule, a new form entry or a message in chat. Nobody has to remember to do it.'],
  ['The agent picks it up', 'An AI agent reads the request and works out which of your tools it needs.'],
  ['Your tools answer', 'Custom MCP servers fetch from the CRM, spreadsheets and database, within the permissions you set.'],
  ['The data gets worked', 'Cleaned, analysed and charted in the same run, not exported and pasted.'],
  ['You approve', 'Anything that sends or writes waits for a person to say yes.'],
  ['It lands where you work', 'A report in the inbox, an updated CRM and a dashboard that is already current.'],
];

const X = [110, 320, 530];
const Y = [40, 172, 304, 436, 568, 700];
const ROWS: string[][] = [
  ['Daily at 09:00', 'New form entry', 'Chat message'],
  ['AI agent'],
  ['MCP · CRM', 'MCP · Sheets', 'MCP · Database'],
  ['Analyse and chart'],
  ['You approve'],
  ['Report sent', 'CRM updated', 'Dashboard live'],
];
const H = 48;
const xs = (n: number) => (n === 1 ? [X[1]] : X);

function edges() {
  const out: { row: number; d: string }[] = [];
  for (let r = 0; r < ROWS.length - 1; r++) {
    const y1 = Y[r] + H / 2, y2 = Y[r + 1] - H / 2, ym = (y1 + y2) / 2;
    for (const a of xs(ROWS[r].length)) for (const b of xs(ROWS[r + 1].length)) {
      out.push({ row: r, d: `M${a} ${y1} C${a} ${ym} ${b} ${ym} ${b} ${y2}` });
    }
  }
  return out;
}

export default function Flow() {
  const E = edges();
  return (
    <section className="flow" id="flow">
      <div className="flow-sticky">
        <div className="flow-copy">
          <p className="label">03 — How a workflow runs</p>
          <h2 data-split>One run, <em>start to finish.</em></h2>
          <ol className="flow-steps">
            {STEPS.map(([title, body], i) => (
              <li key={title} data-row={i}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <svg className="flow-graph" viewBox="0 0 640 740" role="img" aria-label="Diagram of a workflow: a trigger starts an AI agent, which pulls data through MCP servers, analyses it, waits for approval and delivers the results.">
          {E.map((e, i) => <path key={'b' + i} className="fbase" d={e.d} />)}
          {E.map((e, i) => <path key={'d' + i} className="fdraw" data-row={e.row} d={e.d} pathLength={1} />)}
          {E.map((e, i) => <path key={'f' + i} className="fdots" data-row={e.row} d={e.d} />)}
          {ROWS.map((row, r) => row.map((name, c) => {
            const x = xs(row.length)[c], w = row.length === 1 ? 220 : 184;
            return (
              <g key={name} className="fnode" data-row={r}>
                <rect x={x - w / 2} y={Y[r] - H / 2} width={w} height={H} rx={H / 2} />
                <circle cx={x - w / 2 + 22} cy={Y[r]} r={4} />
                <text x={x + 9} y={Y[r] + 5} textAnchor="middle">{name}</text>
              </g>
            );
          }))}
        </svg>
      </div>
    </section>
  );
}
