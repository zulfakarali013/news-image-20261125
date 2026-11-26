// "Where it happened" map for the 25 November 2026 image: coarse continent outlines in an
// equirectangular projection (accurate to a few degrees, plenty at this size). The thirteen
// picture stories get numbered pins, pushed apart where they crowd; every other story gets a
// small dot in its region's colour, so the map shows how the whole day spread.

const LAND = [
  [[-168, 66], [-140, 70], [-110, 72], [-85, 70], [-62, 60], [-56, 52], [-66, 45], [-76, 38], [-81, 31], [-80, 25], [-90, 29], [-97, 26], [-97, 20], [-87, 21], [-83, 10], [-78, 8], [-86, 13], [-105, 20], [-112, 29], [-118, 34], [-124, 41], [-124, 48], [-133, 56], [-150, 60], [-165, 60]],
  [[-55, 82], [-30, 83], [-20, 75], [-40, 64], [-50, 62], [-58, 74]],
  [[-80, 8], [-60, 10], [-50, 2], [-35, -6], [-39, -16], [-48, -26], [-58, -38], [-66, -46], [-72, -54], [-75, -45], [-72, -30], [-70, -18], [-81, -6]],
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [6, 54], [8, 57], [5, 61], [12, 66], [22, 70], [30, 70], [40, 66], [40, 48], [30, 46], [28, 41], [23, 37], [19, 41], [12, 44], [15, 38], [9, 44], [3, 42], [-1, 37]],
  [[-6, 50], [2, 51], [-1, 54], [-3, 59], [-6, 57]],
  [[-17, 21], [-10, 31], [-1, 36], [11, 37], [20, 31], [32, 31], [35, 28], [43, 12], [51, 11], [40, -3], [40, -15], [35, -24], [27, -34], [19, -35], [12, -18], [13, -6], [9, 4], [-8, 4], [-17, 14]],
  [[40, 66], [60, 70], [80, 73], [105, 78], [140, 72], [170, 70], [180, 66], [165, 60], [155, 58], [140, 54], [135, 44], [128, 38], [121, 31], [122, 25], [110, 21], [106, 10], [100, 14], [101, 3], [98, 8], [92, 22], [80, 15], [78, 8], [72, 20], [66, 25], [57, 26], [52, 17], [44, 12], [36, 28], [35, 36], [27, 40], [40, 42], [48, 40], [52, 46], [40, 48]],
  [[130, 31], [140, 35], [142, 40], [145, 44], [141, 45], [139, 38], [131, 34]],
  [[95, 5], [106, -6], [116, -8], [125, -9], [141, -9], [140, -3], [125, 1], [118, 5], [109, 2], [104, -2]],
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [131, -31], [116, -35], [114, -28]],
  [[172, -34], [178, -38], [174, -42], [168, -46], [171, -42]],
];

export function dayMap(pinned, dots, colourOf, { w = 330, h = 138, lonMin = -130, lonMax = 165, latMax = 66, latMin = -42 } = {}) {
  const x = (lon) => ((lon - lonMin) / (lonMax - lonMin)) * w;
  const y = (lat) => ((latMax - lat) / (latMax - latMin)) * h;
  const pt = (p) => [x(p.lon), y(p.lat)];
  const land = LAND.map((poly) => `<polygon points="${poly.map(([lo, la]) => `${x(lo).toFixed(1)},${y(la).toFixed(1)}`).join(' ')}" fill="#d6cbb0" stroke="#b3a585" stroke-width=".8"/>`).join('');
  const small = dots.map((p) => { const [cx, cy] = pt(p); return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.6" fill="${colourOf(p.region)}" stroke="#fff" stroke-width=".7"/>`; }).join('');
  // Spread the numbered pins so none hides another.
  const pos = pinned.map(pt);
  const R = 7.5;
  for (let it = 0; it < 80; it++) for (let i = 0; i < pos.length; i++) for (let j = 0; j < i; j++) {
    const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1], d = Math.hypot(dx, dy) || 0.01;
    if (d < 2 * R + 1) { const k = (2 * R + 1 - d) / 2 / d; pos[i][0] += dx * k + (d < 0.1 ? 1 : 0); pos[i][1] += dy * k; pos[j][0] -= dx * k; pos[j][1] -= dy * k; }
  }
  const pins = pinned.map((p, i) => {
    const [ax, ay] = pt(p); const [cx, cy] = pos[i];
    return `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${cy.toFixed(1)}" stroke="#333" stroke-width=".8"/>` +
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${R}" fill="${colourOf(p.region)}" stroke="#fff" stroke-width="1.3"/>` +
      `<text x="${cx.toFixed(1)}" y="${(cy + 3.3).toFixed(1)}" font-family="Noto Sans" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">${i + 1}</text>`;
  }).join('');
  const eq = `<line x1="0" y1="${y(0).toFixed(1)}" x2="${w}" y2="${y(0).toFixed(1)}" stroke="#b9cbdb" stroke-width="1"/>`;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#e3ecf3"/>${eq}${land}${small}${pins}</svg>`;
}
