// Drawn pictures for the 25 November 2026 news image. Each story names an "art" kind; each
// kind is a flat SVG scene on a 300x130 canvas. Plain shapes only: no photographs and no
// faces, so no picture pretends to be a photo of the event. Every scene leaves its top-left
// corner clear for the story number and its bottom-left for the tag strip.

const C = {
  ink: '#1d1b19', red: '#b3261e', navy: '#1f3a5f', sand: '#eadcc0', sky: '#cfe0ef',
  night: '#14233b', sea: '#3d6f99', grass: '#5d8a3e', gold: '#d9a514', orange: '#ef8a22',
  grey: '#8d8a84', white: '#ffffff', cream: '#fbf6ec',
};

const svg = (bg, body) =>
  `<svg viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="130" fill="${bg}"/>${body}</svg>`;

const text = (x, y, s, size, fill, weight = 800, anchor = 'middle') =>
  `<text x="${x}" y="${y}" font-family="Noto Sans" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;

const flame = (x, y, s) =>
  `<path d="M${x} ${y} q${-14 * s} ${-24 * s} ${2 * s} ${-48 * s} q${3 * s} ${18 * s} ${13 * s} ${20 * s} q${4 * s} ${-15 * s} ${15 * s} ${-26 * s} q${9 * s} ${32 * s} ${-5 * s} ${54 * s} z" fill="${C.orange}"/>` +
  `<path d="M${x + 6 * s} ${y} q${-7 * s} ${-13 * s} ${2 * s} ${-26 * s} q${4 * s} ${11 * s} ${11 * s} ${11 * s} q${4 * s} ${9 * s} ${-2 * s} ${15 * s} z" fill="#ffd34d"/>`;

const smoke = (x, y, r) =>
  `<g fill="#5b5753" opacity=".75"><circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x + r * 1.1}" cy="${y - r * 0.7}" r="${r * 1.2}"/><circle cx="${x + r * 2.4}" cy="${y - r * 1.2}" r="${r}"/></g>`;

// One cargo ship stacked with containers, two of them labelled, and a tariff stamp.
function containers() {
  const boxes = [];
  const cols = ['#c0392b', '#2e6da4', '#e2a21b', '#3d8b4f', '#7d4e9e', '#c0392b', '#2e6da4'];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
    boxes.push(`<rect x="${70 + c * 22}" y="${54 - r * 13}" width="21" height="12" fill="${cols[(c + r * 2) % 7]}" stroke="#0003"/>`);
  }
  return svg(C.sky,
    `<rect y="92" width="300" height="38" fill="${C.sea}"/>` +
    `<path d="M50 70 L250 70 L236 98 L64 98 Z" fill="${C.ink}"/><rect x="54" y="70" width="192" height="5" fill="${C.red}"/>` +
    boxes.join('') +
    `<rect x="214" y="30" width="26" height="40" fill="#e8e4dc" stroke="${C.ink}"/>` +
    `<rect x="71" y="29" width="42" height="12" fill="${C.white}"/>${text(92, 38.5, 'EU', 9, C.ink)}` +
    `<rect x="137" y="29" width="42" height="12" fill="${C.white}"/>${text(158, 38.5, 'CHINA', 9, C.ink)}` +
    `<g transform="rotate(-12 262 52)"><circle cx="262" cy="52" r="25" fill="none" stroke="${C.red}" stroke-width="4"/>${text(262, 47, 'UP TO', 8.5, C.red)}${text(262, 63, '35%', 16, C.red)}</g>`);
}

// A falling price chart over a dark trading screen, with three tickers.
function chartdown() {
  const pts = [[10, 34], [40, 38], [62, 32], [88, 50], [112, 46], [132, 66], [150, 62], [166, 90], [176, 86], [178, 104]];
  const tick = (y, name, val) => `<rect x="184" y="${y}" width="108" height="18" rx="3" fill="#0e1828" stroke="#33465f"/>${text(192, y + 13, name, 9.5, '#c9d4e3', 800, 'start')}${text(286, y + 13.5, val, 12, '#ff5a4f', 800, 'end')}`;
  return svg(C.night,
    [30, 60, 90].map((y) => `<line x1="0" y1="${y}" x2="300" y2="${y}" stroke="#2a3b55"/>`).join('') +
    `<polygon points="${pts.map((p) => p.join(',')).join(' ')} 215,130 20,130" fill="#b3261e33"/>` +
    `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#ff5a4f" stroke-width="4"/>` +
    `<rect x="28" y="62" width="36" height="34" rx="4" fill="#26364f" stroke="#8aa0bd"/>${text(46, 84, 'AI', 13, '#ff8f86')}` +
    tick(26, 'KOSPI', '−6.2%') + tick(46, 'SK HYNIX', '−11%') + tick(66, 'SAMSUNG', '−9.9%') + tick(86, 'NIKKEI', '−2.8%'));
}

// The station in orbit with a capsule docking, flags of the two crews' countries as patches.
function station() {
  const stars = [[20, 20], [60, 12], [110, 28], [150, 10], [240, 18], [280, 34], [200, 40], [30, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('');
  return svg(C.night,
    stars + `<path d="M0 130 Q150 88 300 130 Z" fill="#2c6fb0"/><path d="M0 130 Q150 98 300 130 Z" fill="#3f8a4a" opacity=".55"/>` +
    `<rect x="120" y="44" width="70" height="16" rx="7" fill="#d9dde3" stroke="#8b939e"/>` +
    `<rect x="150" y="22" width="12" height="62" rx="5" fill="#d9dde3" stroke="#8b939e"/>` +
    `<rect x="66" y="40" width="50" height="24" fill="#2d4d86" stroke="#9fb5d9"/><rect x="195" y="40" width="55" height="24" fill="#2d4d86" stroke="#9fb5d9"/>` +
    [72, 84, 96, 207, 219, 231].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="64" stroke="#9fb5d9"/>`).join('') +
    `<path d="M156 98 l-8 -12 h16 z" fill="#c9ced6"/><rect x="149" y="98" width="14" height="14" rx="3" fill="#c9ced6" stroke="#8b939e"/>` +
    `<rect x="20" y="30" width="30" height="20" fill="#01411c"/><rect x="20" y="30" width="8" height="20" fill="#fff"/><circle cx="40" cy="40" r="5.5" fill="#fff"/><circle cx="42" cy="38.5" r="5" fill="#01411c"/>` +
    `<rect x="20" y="56" width="30" height="20" fill="#de2910"/><circle cx="27" cy="62" r="2.6" fill="#ffde00"/>` +
    text(254, 36, 'TIANGONG', 10, '#fff') + text(205, 94, 'SHENZHOU-24', 9, '#fff'));
}

// A tanker burning on a ring-road flyover.
function fire() {
  return svg('#f3d3a8',
    `<rect y="96" width="300" height="34" fill="#6b5b4b"/><rect y="84" width="300" height="12" fill="#3f3a35"/>` +
    [20, 70, 120, 170, 220, 270].map((x) => `<rect x="${x}" y="89" width="22" height="2.5" fill="#fff"/>`).join('') +
    smoke(120, 26, 16) + smoke(170, 18, 13) +
    `<rect x="96" y="58" width="112" height="26" rx="12" fill="#cfd3d8" stroke="${C.ink}"/><rect x="208" y="62" width="34" height="22" rx="3" fill="#b3261e"/>` +
    flame(112, 82, 0.9) + flame(150, 84, 1.1) + flame(186, 82, 0.8) +
    `<rect x="250" y="70" width="34" height="14" rx="4" fill="#4a4a4a"/><rect x="30" y="70" width="34" height="14" rx="4" fill="#4a4a4a"/>`);
}

// A tanker at sea with a mine and a fireball; a red route line across a strait.
function mines() {
  return svg(C.sky,
    `<rect y="70" width="300" height="60" fill="${C.sea}"/><path d="M0 70 Q60 52 120 66 L120 70 Z M190 70 Q250 50 300 60 L300 70 Z" fill="#c8b48c"/>` +
    `<path d="M60 74 L220 74 L206 96 L72 96 Z" fill="#2b2b2b"/><rect x="186" y="60" width="18" height="14" fill="#e8e4dc"/>` +
    smoke(120, 40, 12) + flame(118, 74, 0.9) +
    `<circle cx="250" cy="104" r="11" fill="#30302e"/>` + [0, 60, 120, 180, 240, 300].map((a) => { const r = (a * Math.PI) / 180; return `<line x1="${250 + 11 * Math.cos(r)}" y1="${104 + 11 * Math.sin(r)}" x2="${250 + 17 * Math.cos(r)}" y2="${104 + 17 * Math.sin(r)}" stroke="#30302e" stroke-width="3"/>`; }).join('') +
    `<path d="M10 116 Q100 104 160 112 T290 108" fill="none" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 4"/>`);
}

// A refinery skyline with a flare and a drone silhouette.
function refinery() {
  return svg('#efe2c6',
    `<rect y="100" width="300" height="30" fill="#c9b48a"/>` +
    `<rect x="40" y="50" width="16" height="50" fill="#7d7a74"/><rect x="66" y="36" width="12" height="64" fill="#8d8a84"/>` +
    `<ellipse cx="128" cy="86" rx="30" ry="14" fill="#a9a59d"/><rect x="98" y="86" width="60" height="14" fill="#a9a59d"/>` +
    `<rect x="176" y="62" width="40" height="38" fill="#9a968e"/><rect x="226" y="44" width="10" height="56" fill="#7d7a74"/>` +
    flame(72, 36, 0.5) + smoke(220, 30, 10) +
    `<path d="M250 34 l18 6 l-18 6 l4 -6 z" fill="${C.ink}"/><line x1="236" y1="40" x2="250" y2="40" stroke="${C.ink}" stroke-width="2"/>`);
}

// An energy bill with old and new annual figures.
function bill() {
  return svg('#e9eef6',
    `<rect x="70" y="10" width="160" height="112" rx="4" fill="#fff" stroke="#9aa6b6"/>` +
    text(150, 36, 'ENERGY BILL · TYPICAL YEAR', 9, C.navy) +
    `<line x1="84" y1="42" x2="216" y2="42" stroke="#d3d9e2"/>` +
    text(150, 60, '£1,723', 15, '#8b8f96') + `<line x1="118" y1="55" x2="182" y2="55" stroke="#8b8f96" stroke-width="2"/>` +
    text(150, 88, '£2,166', 26, C.red) + text(150, 102, 'FROM 1 JANUARY 2027', 8.5, C.ink) +
    `<path d="M32 96 L32 50 L22 50 L40 28 L58 50 L48 50 L48 96 Z" fill="${C.red}"/><path d="M252 96 L252 50 L242 50 L260 28 L278 50 L268 50 L268 96 Z" fill="${C.red}"/>`);
}

// A grounded parade balloon under storm clouds and slanting rain.
function balloon() {
  return svg('#b9c3cf',
    `<g fill="#6f7884"><circle cx="70" cy="22" r="22"/><circle cx="110" cy="16" r="26"/><circle cx="160" cy="22" r="22"/><circle cx="220" cy="18" r="26"/><circle cx="262" cy="24" r="20"/></g>` +
    Array.from({ length: 22 }, (_, i) => `<line x1="${8 + i * 14}" y1="44" x2="${i * 14}" y2="62" stroke="#ffffffaa" stroke-width="1.5"/>`).join('') +
    `<rect y="104" width="300" height="26" fill="#55606c"/>` +
    `<ellipse cx="150" cy="96" rx="58" ry="14" fill="#e5532d"/><ellipse cx="128" cy="90" rx="16" ry="9" fill="#f2764f"/>` +
    `<path d="M210 60 l16 -18 l-6 16 h12 l-18 22 l6 -18 z" fill="#ffd34d"/>` +
    text(250, 100, 'THU → SAT', 10, '#fff'));
}

// A controlled blast: a smoke column rising behind a fence.
function blast() {
  return svg('#dfe6d6',
    `<rect y="100" width="300" height="30" fill="#8aa06a"/>` +
    `<g fill="#9b958c"><circle cx="150" cy="60" r="26"/><circle cx="126" cy="74" r="20"/><circle cx="176" cy="74" r="22"/><circle cx="150" cy="30" r="20"/><circle cx="168" cy="20" r="16"/></g>` +
    `<path d="M120 100 Q150 70 180 100 Z" fill="${C.orange}"/>` +
    Array.from({ length: 21 }, (_, i) => `<line x1="${i * 15}" y1="96" x2="${i * 15}" y2="112" stroke="#555" stroke-width="2"/>`).join('') +
    `<line x1="0" y1="100" x2="300" y2="100" stroke="#555"/><line x1="0" y1="108" x2="300" y2="108" stroke="#555"/>`);
}

// A supermarket front ringed by police vehicles with blue lights.
function store() {
  return svg('#f2e7d2',
    `<rect y="104" width="300" height="26" fill="#8b8378"/>` +
    `<rect x="70" y="34" width="160" height="70" fill="#f6f1e6" stroke="${C.ink}"/><rect x="70" y="34" width="160" height="18" fill="#e3b31b"/>` +
    text(150, 47, 'SUPERMARKET', 10, C.ink) +
    [84, 124, 164, 196].map((x) => `<rect x="${x}" y="60" width="26" height="24" fill="#bcd3e6" stroke="#556"/>`).join('') +
    `<rect x="136" y="84" width="28" height="20" fill="#556"/>` +
    [[20, 92], [244, 92]].map(([x, y]) => `<rect x="${x}" y="${y}" width="40" height="16" rx="3" fill="#2d3a4a"/><rect x="${x + 14}" y="${y - 5}" width="12" height="5" fill="#3a7bd5"/>`).join(''));
}

// Two flags of the treaty partners over a signed document.
function treaty() {
  const au = (x, y) => `<rect x="${x}" y="${y}" width="64" height="40" fill="#00247d"/>${text(x + 44, y + 27, '★', 14, '#fff')}<rect x="${x}" y="${y}" width="30" height="18" fill="#00247d" stroke="#fff"/><line x1="${x}" y1="${y + 9}" x2="${x + 30}" y2="${y + 9}" stroke="#cf142b" stroke-width="3"/><line x1="${x + 15}" y1="${y}" x2="${x + 15}" y2="${y + 18}" stroke="#cf142b" stroke-width="3"/>`;
  const sb = (x, y) => `<rect x="${x}" y="${y}" width="64" height="40" fill="#0051ba"/><polygon points="${x},${y + 40} ${x + 64},${y + 40} ${x + 64},${y}" fill="#215b33"/><line x1="${x}" y1="${y + 40}" x2="${x + 64}" y2="${y}" stroke="#fcd116" stroke-width="5"/>`;
  return svg('#e8eef3',
    au(56, 26) + sb(180, 26) +
    `<rect x="96" y="66" width="108" height="56" fill="#fff" stroke="#9aa6b6"/>` +
    [78, 86, 94].map((y) => `<line x1="106" y1="${y}" x2="194" y2="${y}" stroke="#c8ced8"/>`).join('') +
    `<path d="M110 110 q10 -10 20 0 t20 0" fill="none" stroke="${C.navy}" stroke-width="2"/><path d="M156 110 q8 -9 16 0 t16 0" fill="none" stroke="${C.navy}" stroke-width="2"/>`);
}

// Fighter jets parked on an apron, two of them burning.
function jets() {
  const jet = (x, y, s) => `<path d="M${x} ${y} l${30 * s} ${-4 * s} l${10 * s} ${-14 * s} l${4 * s} 0 l${-4 * s} ${14 * s} l${18 * s} ${-2 * s} l${4 * s} ${-8 * s} l${3 * s} 0 l${-1 * s} ${10 * s} l${-1 * s} ${10 * s} l${-3 * s} 0 l${-4 * s} ${-8 * s} l${-18 * s} ${-2 * s} l${4 * s} ${14 * s} l${-4 * s} 0 l${-10 * s} ${-14 * s} z" fill="#5d6670"/>`;
  return svg('#c9ced2',
    `<rect y="70" width="300" height="60" fill="#8f9396"/>` +
    jet(30, 100, 1) + jet(120, 108, 1) + jet(210, 98, 1) +
    flame(150, 104, 0.6) + flame(236, 94, 0.55) + smoke(150, 50, 10) + smoke(232, 44, 9));
}

// A football pitch at night with a scoreboard.
function football() {
  return svg('#1d3b23',
    Array.from({ length: 6 }, (_, i) => `<rect x="${i * 50}" y="66" width="25" height="64" fill="#24492b"/>`).join('') +
    `<rect x="10" y="68" width="280" height="36" fill="none" stroke="#e8f0e8" stroke-width="2"/><line x1="150" y1="68" x2="150" y2="104" stroke="#e8f0e8" stroke-width="2"/><circle cx="150" cy="86" r="12" fill="none" stroke="#e8f0e8" stroke-width="2"/>` +
    `<rect x="70" y="26" width="160" height="38" rx="4" fill="#0e1520" stroke="#42506a"/>` +
    text(150, 42, 'PSG 2–2 ROMA', 11.5, '#ffd34d') + text(150, 58, 'SPORTING 2–2 MAN UTD', 10, '#ffd34d') +
    `<circle cx="214" cy="94" r="7" fill="#fff" stroke="${C.ink}"/>`);
}

const SCENES = { containers, chartdown, station, fire, mines, refinery, bill, balloon, blast, store, treaty, jets, football };

export function art(kind) {
  const draw = SCENES[kind];
  if (!draw) throw new Error(`no drawing for art kind "${kind}"`);
  return draw();
}
