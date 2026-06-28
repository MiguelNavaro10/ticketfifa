const CX = 400, CY = 240;
const NUM_SIDES = 10;
const ANGLE_PER_SIDE = 360 / NUM_SIDES;

export const RINGS = {
  100: { rxOuter: 175, ryOuter: 68, rxInner: 105, ryInner: 38 },
  200: { rxOuter: 265, ryOuter: 113, rxInner: 195, ryInner: 78 },
  300: { rxOuter: 355, ryOuter: 158, rxInner: 285, ryInner: 118 },
};

function ellipsePoint(rx, ry, deg) {
  const rad = deg * Math.PI / 180;
  return { x: CX + rx * Math.sin(rad), y: CY - ry * Math.cos(rad) };
}

function getSideEndpoints(sideIndex, rx, ry) {
  const a1 = sideIndex * ANGLE_PER_SIDE;
  const a2 = ((sideIndex + 1) % NUM_SIDES) * ANGLE_PER_SIDE;
  return {
    p1: ellipsePoint(rx, ry, a1),
    p2: ellipsePoint(rx, ry, a2),
    a1, a2,
  };
}

function lerp(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function sectionPath(s, ring) {
  const outer = getSideEndpoints(s.sideIndex, ring.rxOuter, ring.ryOuter);
  const inner = getSideEndpoints(s.sideIndex, ring.rxInner, ring.ryInner);
  const o1 = lerp(outer.p1, outer.p2, s.sectionT);
  const o2 = lerp(outer.p1, outer.p2, s.sectionT + s.sectionSpan);
  const i1 = lerp(inner.p1, inner.p2, s.sectionT);
  const i2 = lerp(inner.p1, inner.p2, s.sectionT + s.sectionSpan);
  return `M ${o1.x},${o1.y} L ${o2.x},${o2.y} L ${i2.x},${i2.y} L ${i1.x},${i1.y} Z`;
}

export function sectionCenter(s, ring) {
  const midT = s.sectionT + s.sectionSpan / 2;
  const midRx = (ring.rxInner + ring.rxOuter) / 2;
  const midRy = (ring.ryInner + ring.ryOuter) / 2;
  const outer = getSideEndpoints(s.sideIndex, midRx, midRy);
  const p = lerp(outer.p1, outer.p2, midT);
  return { x: p.x, y: p.y, angle: (s.sideIndex + midT) * ANGLE_PER_SIDE };
}

export function sectionLines(s, ring) {
  const lines = [];
  for (let l = 1; l <= 3; l++) {
    const frac = l / 4;
    const rx = ring.rxInner + (ring.rxOuter - ring.rxInner) * frac;
    const ry = ring.ryInner + (ring.ryOuter - ring.ryInner) * frac;
    const side = getSideEndpoints(s.sideIndex, rx, ry);
    const p1 = lerp(side.p1, side.p2, s.sectionT);
    const p2 = lerp(side.p1, side.p2, s.sectionT + s.sectionSpan);
    lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  }
  return lines;
}

export function getRingPolygon(rx, ry) {
  const pts = [];
  for (let side = 0; side < NUM_SIDES; side++) {
    const { p1 } = getSideEndpoints(side, rx, ry);
    pts.push(`${p1.x},${p1.y}`);
  }
  return pts.join(' ');
}

const MERCEDES_BENZ_SECTIONS_DATA = [
  ...[101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,119,120,121,122,123,124,125,126,127,128,129,130,131,132,134,135,136,137,138,139,140].map(id => ({ id: String(id), tier: 100, price: 1200 })),
  ...[201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247].map(id => ({ id: String(id), tier: 200, price: 1000 })),
  ...[301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,326,328,330,332,333,334,335,336,337,338,339,340,341,342,344,345,348,349,350].map(id => ({ id: String(id), tier: 300, price: 850 })),
];

const BADGE_SECTIONS = new Set(["121","101","116","220","247","330","313","344"]);

function distributeOnDecagon(tierSections, tier) {
  const result = [];
  const total = tierSections.length;
  const base = Math.floor(total / NUM_SIDES);
  const extra = total % NUM_SIDES;
  let idx = 0;
  for (let side = 0; side < NUM_SIDES; side++) {
    const count = base + (side < extra ? 1 : 0);
    const span = 1 / count;
    for (let i = 0; i < count && idx < total; i++) {
      const s = tierSections[idx];
      result.push({
        id: s.id,
        tier: s.tier,
        price: s.price,
        sideIndex: side,
        sectionT: i * span,
        sectionSpan: span,
        isAvailable: true,
        showBadge: BADGE_SECTIONS.has(s.id),
      });
      idx++;
    }
  }
  return result;
}

function buildSectionConfig() {
  const result = [];
  for (const tier of [100, 200, 300]) {
    const tierSections = MERCEDES_BENZ_SECTIONS_DATA.filter(s => s.tier === tier);
    result.push(...distributeOnDecagon(tierSections, tier));
  }
  for (const s of result) {
    const ring = RINGS[s.tier];
    s.path = sectionPath(s, ring);
    const c = sectionCenter(s, ring);
    s.cx = c.x;
    s.cy = c.y;
    s.badgeAngle = c.angle;
    s.lines = sectionLines(s, ring);
  }
  return result;
}

const CONFIG = buildSectionConfig();

export function generateInitialSections() {
  return CONFIG.map(s => ({
    ...s,
    capacidad_total: 100,
    asientos_disponibles: Math.floor(Math.random() * 5) + 1,
    esta_activa: s.isAvailable,
    category: `Category ${s.tier}`,
    icono_destacado: s.showBadge ? 'fire' : 'none',
    precio_base: s.price,
  }));
}

export function apply8020(sections) {
  const pool = [...sections];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const twentyPct = Math.max(1, Math.floor(pool.length * 0.2));
  const soldOutIds = new Set(pool.slice(0, twentyPct).map(s => s.id));
  return sections.map(s => {
    if (soldOutIds.has(s.id)) {
      return { ...s, esta_activa: false, asientos_disponibles: 0 };
    }
    const qty = Math.floor(Math.random() * 4) + 1;
    return { ...s, esta_activa: true, asientos_disponibles: qty };
  });
}
