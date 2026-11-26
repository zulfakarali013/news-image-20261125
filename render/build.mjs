// Builds entry.png, "Wednesday 25 November 2026 in one picture", from render/stories.json.
// Edition 2: the same front page with bigger type, so it still reads when shrunk to ~300 px.
// Lays the day out as HTML + inline SVG drawings and a map, renders it at exactly 1024x1024 in
// headless Chromium, refuses to write the image if any line overflows, is cut off or collides,
// and keeps the file under the 1 MiB cap. Run: node render/build.mjs (Playwright is dev-only).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { art } from './art.mjs';
import { dayMap } from './map.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const day = JSON.parse(readFileSync(join(here, 'stories.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const [yy, mm, dd] = day.date.split('-').map(Number);
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mm - 1];
const dayName = `${day.weekday} ${dd} ${MONTH} ${yy}`;
const colourOf = (r) => day.regions[r][1];

// Every story in reading order: leads, picture panels, then the numbered list.
const pictured = [...day.leads, ...day.stories];
const all = [...pictured, ...day.brief];
const total = all.length;

// Count stories per region and per field for the header bars.
const tally = (key) => {
  const m = new Map();
  for (const s of all) m.set(s[key], (m.get(s[key]) || 0) + 1);
  return m;
};
const byRegion = tally('region');
const byField = [...tally('field')].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const regionsUsed = Object.keys(day.regions).filter((r) => byRegion.get(r));
const bigFields = byField.filter(([, n]) => n >= 2);
const oneFields = byField.filter(([, n]) => n === 1);

const STATUS = {
  OFFICIAL: ['#1f3a5f', 'OFFICIAL'],
  CONFIRMED: ['#1f6b3a', 'CONFIRMED'],
  REPORTED: ['#6a5a2a', 'REPORTED'],
  CLAIMED: ['#b3261e', 'CLAIM'],
};
const chip = (st) => { const [c, t] = STATUS[st]; return `<span class="chip" style="border-color:${c};color:${c}">${t}</span>`; };
const num = (i, region, cls = 'no') => `<span class="${cls}" style="background:${colourOf(region)}">${i}</span>`;

const lead = (s, i) => `
  <article class="lead">
    <div class="pic">${art(s.art)}${num(i + 1, s.region)}</div>
    <div class="body">
      <div class="row"><span class="kick" style="color:${colourOf(s.region)}">${esc(s.kicker)}</span>${chip(s.status)}</div>
      <h2>${esc(s.headline)}</h2>
      <p>${esc(s.dek)}</p>
      <div class="why"><b>WHY IT MATTERS</b> ${esc(s.why)} <span class="src">· ${esc(s.source)}</span></div>
    </div>
  </article>`;

const panel = (s, i) => `
  <article class="mid">
    <div class="pic">${art(s.art)}${num(i + 4, s.region)}<span class="tag">${esc(s.tag)}</span></div>
    <div class="body">
      <div class="row"><span class="kick" style="color:${colourOf(s.region)}">${esc(s.kicker)}</span>${chip(s.status)}</div>
      <h3>${esc(s.headline)}</h3>
      <p>${esc(s.dek)}</p>
    </div>
  </article>`;

const first = pictured.length + 1;
const half = Math.ceil(day.brief.length / 2);
const item = (b, n) => `<li>${num(n, b.region, 'ln')}<b style="color:${colourOf(b.region)}">${esc(b.place)}</b> <span class="tx">${esc(b.text)}</span>${b.status === 'CLAIMED' ? ' <i class="cl">CLAIM</i>' : b.status === 'REPORTED' ? ' <i class="rp">REPORTED</i>' : ''}</li>`;
const list = (items, start) => `<ol>${items.map((b, k) => item(b, start + k)).join('')}</ol>`;

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1024px;height:1024px;background:#f7f2e8;color:#1d1b19;font-family:'Noto Sans',sans-serif;overflow:hidden}
.page{padding:6px 14px 0;height:1024px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;background:#1d1b19;color:#fff;font-size:11px;font-weight:800;letter-spacing:.04em;padding:3px 8px}
.top .r{color:#ffd34d}
h1{font-family:'Noto Serif',serif;font-weight:900;font-size:48px;line-height:1.12;text-align:center;letter-spacing:-.01em;padding:0 0 1px}
.deck{text-align:center;font-family:'Noto Serif',serif;font-style:italic;color:#b3261e;font-size:14.5px;line-height:1.25;padding-bottom:4px}
.regions{display:flex;gap:3px}
.regions span{flex:1 1 auto;text-align:center;color:#fff;font-size:9.6px;font-weight:800;padding:2px 3px;white-space:nowrap;border-radius:2px}
.fields{font-size:9.4px;color:#5a544c;padding:2px 0 2px;white-space:nowrap;overflow:hidden}
.fields b{color:#1d1b19;margin-right:4px}
.nums{display:grid;grid-template-columns:repeat(5,1fr);border-top:2px solid #1d1b19;border-bottom:1px solid #1d1b19;padding:2px 0}
.nums div{display:flex;align-items:center;gap:6px;padding:0 6px;border-left:1px solid #cdbfa6}
.nums div:first-child{border-left:0}
.nums b{font-family:'Noto Serif',serif;font-size:27px;line-height:1.05;color:#b3261e;white-space:nowrap}
.nums span{font-size:10.8px;line-height:1.15;color:#3d3833}
.leads{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:4px 0 3px}
article{background:#fffdf8;border:1px solid #cdbfa6;border-radius:4px;overflow:hidden;display:flex;flex-direction:column}
.pic{position:relative;line-height:0;border-bottom:1px solid #cdbfa6}
.pic svg{width:100%;display:block}
.lead .pic svg{height:70px}
.mid .pic svg{height:38px}
.no{position:absolute;top:4px;left:4px;color:#fff;font:800 12px 'Noto Sans';line-height:20px;min-width:20px;text-align:center;border-radius:10px;border:1.5px solid #fff}
.tag{position:absolute;left:0;bottom:0;background:#1d1b19e0;color:#fff;font:800 10.5px 'Noto Sans';line-height:16px;padding:0 6px;letter-spacing:.03em}
.body{padding:4px 7px 5px}
.row{display:flex;justify-content:space-between;align-items:center;gap:4px}
.kick{font-size:9.6px;font-weight:800;letter-spacing:.04em;white-space:nowrap;overflow:hidden}
.chip{font-size:8px;font-weight:800;letter-spacing:.03em;border:1.3px solid;border-radius:2px;padding:0 3px;line-height:12px;white-space:nowrap;background:#fff}
.lead h2{font-family:'Noto Serif',serif;font-weight:800;font-size:21.5px;line-height:1.08;margin-top:2px}
.lead p{font-size:11.6px;line-height:1.25;color:#3d3833;margin-top:3px}
.why{font-size:10.4px;line-height:1.25;margin-top:3px;color:#1d1b19}
.why b{color:#b3261e;font-size:9px;letter-spacing:.04em;margin-right:2px}
.src{color:#6b645a;font-weight:700}
.mids{display:grid;grid-template-columns:repeat(5,1fr);gap:5px 7px;padding-bottom:4px}
.mid .kick{font-size:8.8px;letter-spacing:.02em}
.mid h3{font-family:'Noto Serif',serif;font-weight:800;font-size:15px;line-height:1.07;margin-top:1px}
.mid p{font-size:10.2px;line-height:1.2;color:#3d3833;margin-top:2px}
.bottom{display:grid;grid-template-columns:300px minmax(0,1fr);gap:12px;flex:1;min-height:0;border-top:2px solid #1d1b19;padding-top:4px}
.sec{font-size:10.6px;font-weight:800;letter-spacing:.05em;color:#1d1b19;margin-bottom:3px;white-space:nowrap}
.sec i{font-style:normal;color:#6b645a;font-weight:700;letter-spacing:0}
.map svg{width:100%;display:block;border:1px solid #cdbfa6}
.tl{display:grid;grid-template-columns:1fr 1fr;gap:0 8px;margin-top:2px;font-size:10.2px;line-height:1.4;white-space:nowrap}
.tl b{color:#b3261e;margin-right:4px}
.cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 12px}
ol{list-style:none}
li{font-size:10.8px;line-height:13.8px;white-space:nowrap;overflow:hidden;display:flex;align-items:center;gap:3px}
li b{font-weight:800;flex:none}
li .tx{overflow:hidden}
.ln{flex:none;color:#fff;font-size:8.4px;font-weight:800;width:18px;height:13px;line-height:13px;text-align:center;border-radius:7px}
.cl,.rp{flex:none;font-style:normal;font-size:7.6px;font-weight:800;border:1.2px solid #b3261e;color:#b3261e;padding:0 2px;line-height:10px;border-radius:2px}
.rp{border-color:#6a5a2a;color:#6a5a2a}
.check{margin-top:4px;border:1.8px solid #b3261e;background:#fbf1e8;border-radius:3px;padding:3px 7px;font-size:10.2px;line-height:1.32}
.check .t{background:#b3261e;color:#fff;font-weight:800;font-size:9.6px;padding:0 5px;margin-right:5px;letter-spacing:.04em}
.check .o{white-space:nowrap}
.foot{display:flex;justify-content:space-between;gap:10px;font-size:9.2px;color:#5a544c;padding:3px 0 4px;white-space:nowrap}
.foot .k span{margin-right:7px}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="page">
  <div class="top"><span>THE WORLD IN ONE DAY</span><span class="r">${total} STORIES · ${regionsUsed.length} REGIONS · ${byField.length} FIELDS · ALL FROM ${dayName.toUpperCase()}</span></div>
  <h1>${esc(dayName)}</h1>
  <div class="deck">${esc(day.deck)}</div>
  <div class="regions">${regionsUsed.map((r) => `<span style="background:${colourOf(r)}">${esc(day.regions[r][0]).toUpperCase()} ${byRegion.get(r)}</span>`).join('')}</div>
  <div class="fields"><b>${byField.length} FIELDS</b>${bigFields.map(([f, n]) => `${esc(f)} ${n}`).join(' · ')} · and ${oneFields.length} more with one story each</div>
  <section class="nums">${day.numbers.map((x) => `<div><b>${esc(x.n)}</b><span>${esc(x.t)}</span></div>`).join('')}</section>
  <section class="leads">${day.leads.map(lead).join('')}</section>
  <section class="mids">${day.stories.map(panel).join('')}</section>
  <section class="bottom">
    <div class="map">
      <div class="sec">WHERE IT HAPPENED <i>· pins 1–${pictured.length}, dots ${first}–${total}</i></div>
      ${dayMap(pictured, day.brief, colourOf)}
      <div class="sec" style="margin-top:4px">THE DAY IN UTC <i>· Wednesday 25 November</i></div>
      <div class="tl">${day.timeline.map((t) => `<div><b>${t.utc}</b>${esc(t.t)}</div>`).join('')}</div>
    </div>
    <div>
      <div class="sec">ALSO ON ${esc(dayName.toUpperCase())} <i>· stories ${first}–${total}, coloured by region</i></div>
      <div class="cols">${list(day.brief.slice(0, half), first)}${list(day.brief.slice(half), first + half)}</div>
    </div>
  </section>
  <div class="check"><span class="t">DATE CHECK</span><b>Every story above happened or was first reported on ${esc(dayName)}.</b> Left out as earlier news: ${day.left_out.map((o) => `<span class="o">${esc(o)}</span>`).join(' · ')}.</div>
  <div class="foot"><span class="k">${Object.values(STATUS).map(([c, t]) => `<span><b style="color:${c}">${t}</b> ${{ OFFICIAL: 'from the authority', CONFIRMED: '2+ outlets', REPORTED: 'one outlet', CLAIM: 'one side says' }[t]}</span>`).join('')}</span><span>Sources: ${esc(day.sources)} · all drawings original</span></div>
</div></body></html>`;

mkdirSync(join(root, 'out'), { recursive: true });
const outHtml = join(root, 'out', 'page.html');
writeFileSync(outHtml, html);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto('file://' + outHtml);
await page.waitForTimeout(300);
// Every text box must show all of its text: nothing cut by overflow, nothing past the page.
const check = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('h1,h2,h3,p,li,li .tx,.why,.kick,.fields,.top span,.check,.foot,.sec,.tl div,.nums span,article,.bottom,.regions span,.tag')) {
    const hidden = getComputedStyle(el).overflow !== 'visible';
    if ((hidden && el.scrollHeight > el.clientHeight + 2) || el.scrollWidth > el.clientWidth + 1) bad.push((el.className || el.tagName) + ': ' + el.textContent.trim().slice(0, 50));
    const r = el.getBoundingClientRect();
    if (r.right > 1024 || r.bottom > 1024) bad.push('off page: ' + el.textContent.trim().slice(0, 40));
  }
  const foot = document.querySelector('.foot').getBoundingClientRect().bottom;
  const room = document.querySelector('.bottom').clientHeight - Math.max(...[...document.querySelectorAll('.bottom > div')].map((d) => d.scrollHeight));
  const sizes = Object.fromEntries(['.top', 'h1', '.deck', '.regions', '.fields', '.nums', '.leads', '.mids', '.bottom', '.check', '.foot'].map((s) => [s, Math.round(document.querySelector(s).getBoundingClientRect().height)]));
  sizes.map = Math.round(document.querySelector('.map').scrollHeight);
  return { footBottom: Math.round(foot), bottomRoom: room, sizes, bad };
});
let buf = await page.screenshot({ type: 'png' });
if (buf.length > 1_000_000) {
  let q = 92;
  do { buf = await page.screenshot({ type: 'jpeg', quality: q }); q -= 3; } while (buf.length > 1_000_000 && q > 60);
}
await browser.close();
console.log(JSON.stringify({ stories: total, regions: regionsUsed.length, fields: byField.length, bytes: buf.length, ...check }));
if (check.bad.length || check.bottomRoom < 0) { console.error('layout problems: not writing entry.png'); process.exit(1); }
writeFileSync(join(root, 'entry.png'), buf);
