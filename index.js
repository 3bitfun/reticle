const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

function resize() {
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// Built-in shapes (16 total)
const SHAPES = {
  classic: ({ gap, length, spread }) => {
    const g = gap + spread;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - length },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + length },
      { type: 'line', x1: -g, y1: 0, x2: -g - length, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
    ];
  },
  crossDot: ({ gap, length, spread, thickness }) => {
    const g = gap + spread;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - length },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + length },
      { type: 'line', x1: -g, y1: 0, x2: -g - length, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
      { type: 'circle', cx: 0, cy: 0, r: thickness },
    ];
  },
  tShape: ({ gap, length, spread }) => {
    const g = gap + spread;
    return [
      { type: 'line', x1: -g, y1: 0, x2: -g - length, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + length },
    ];
  },
  dotOnly: ({ thickness }) => [{ type: 'circle', cx: 0, cy: 0, r: thickness }],
  circle: ({ gap, spread, thickness }) => [
    { type: 'circle', cx: 0, cy: 0, r: gap + spread + thickness * 2 },
  ],
  brackets: ({ gap, length, spread }) => {
    const g = gap + spread, s = length * 0.5;
    return [
      { type: 'line', x1: -g, y1: -g, x2: -g - s, y2: -g },
      { type: 'line', x1: -g, y1: -g, x2: -g, y2: -g - s },
      { type: 'line', x1: g, y1: -g, x2: g + s, y2: -g },
      { type: 'line', x1: g, y1: -g, x2: g, y2: -g - s },
      { type: 'line', x1: -g, y1: g, x2: -g - s, y2: g },
      { type: 'line', x1: -g, y1: g, x2: -g, y2: g + s },
      { type: 'line', x1: g, y1: g, x2: g + s, y2: g },
      { type: 'line', x1: g, y1: g, x2: g, y2: g + s },
    ];
  },
  chevron: ({ gap, length, spread }) => {
    const g = gap + spread, s = length * 0.7;
    return [
      { type: 'line', x1: -g, y1: -g, x2: -g - s, y2: 0 },
      { type: 'line', x1: -g, y1: g, x2: -g - s, y2: 0 },
      { type: 'line', x1: g, y1: -g, x2: g + s, y2: 0 },
      { type: 'line', x1: g, y1: g, x2: g + s, y2: 0 },
    ];
  },
  triDot: ({ gap, length, spread, thickness }) => [
    { type: 'line', x1: 0, y1: -gap - spread, x2: 0, y2: -gap - spread - length },
    { type: 'line', x1: -gap - spread, y1: 0, x2: -gap - spread - length, y2: 0 },
    { type: 'line', x1: gap + spread, y1: 0, x2: gap + spread + length, y2: 0 },
    { type: 'circle', cx: 0, cy: 0, r: thickness },
  ],
  diamond: ({ gap, length, spread }) => {
    const g = gap + spread + length * 0.5;
    return [
      { type: 'line', x1: 0, y1: -g, x2: g, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: 0, y2: g },
      { type: 'line', x1: 0, y1: g, x2: -g, y2: 0 },
      { type: 'line', x1: -g, y1: 0, x2: 0, y2: -g },
    ];
  },
  square: ({ gap, length, spread }) => {
    const g = gap + spread + length * 0.5;
    return [
      { type: 'line', x1: -g, y1: -g, x2: g, y2: -g },
      { type: 'line', x1: g, y1: -g, x2: g, y2: g },
      { type: 'line', x1: g, y1: g, x2: -g, y2: g },
      { type: 'line', x1: -g, y1: g, x2: -g, y2: -g },
    ];
  },
  heartbeat: ({ gap, length, spread, thickness }) => {
    const g = gap + spread;
    const s = length * 0.6;
    return [
      { type: 'line', x1: -g - s * 2, y1: 0, x2: -g - s, y2: 0 },
      { type: 'line', x1: -g - s, y1: 0, x2: -g - s * 0.5, y2: -s * 0.6 },
      { type: 'line', x1: -g - s * 0.5, y1: -s * 0.6, x2: -g, y2: s * 0.5 },
      { type: 'line', x1: -g, y1: s * 0.5, x2: -g + s * 0.5, y2: 0 },
      { type: 'line', x1: -g + s * 0.5, y1: 0, x2: g - s * 0.5, y2: 0 },
      { type: 'line', x1: g - s * 0.5, y1: 0, x2: g, y2: -s * 0.6 },
      { type: 'line', x1: g, y1: -s * 0.6, x2: g + s * 0.5, y2: s * 0.5 },
      { type: 'line', x1: g + s * 0.5, y1: s * 0.5, x2: g + s, y2: 0 },
      { type: 'line', x1: g + s, y1: 0, x2: g + s * 2, y2: 0 },
      { type: 'circle', cx: 0, cy: 0, r: thickness },
    ];
  },
  hashmark: ({ gap, length, spread }) => {
    const g = gap + spread, s = length * 0.6;
    return [
      { type: 'line', x1: -g - length, y1: 0, x2: g + length, y2: 0 },
      { type: 'line', x1: -g - s, y1: -s, x2: -g - s, y2: s },
      { type: 'line', x1: g + s, y1: -s, x2: g + s, y2: s },
      { type: 'line', x1: 0, y1: -g - length, x2: 0, y2: g + length },
      { type: 'line', x1: -s, y1: -g - s, x2: s, y2: -g - s },
      { type: 'line', x1: -s, y1: g + s, x2: s, y2: g + s },
    ];
  },
  triangle: ({ gap, length, spread }) => {
    const g = gap + spread + length * 0.6;
    const h = g * 0.85;
    return [
      { type: 'line', x1: 0, y1: -h, x2: g, y2: h * 0.5 },
      { type: 'line', x1: g, y1: h * 0.5, x2: -g, y2: h * 0.5 },
      { type: 'line', x1: -g, y1: h * 0.5, x2: 0, y2: -h },
    ];
  },
  xShape: ({ gap, length, spread }) => {
    const g = (gap + spread) * 0.7 + length * 0.35;
    return [
      { type: 'line', x1: -g, y1: -g, x2: g, y2: g },
      { type: 'line', x1: g, y1: -g, x2: -g, y2: g },
    ];
  },
  arrow: ({ gap, length, spread }) => {
    const g = gap + spread, s = length * 0.8;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - length },
      { type: 'line', x1: 0, y1: -g - length, x2: -s * 0.5, y2: -g - length + s * 0.5 },
      { type: 'line', x1: 0, y1: -g - length, x2: s * 0.5, y2: -g - length + s * 0.5 },
      { type: 'line', x1: -g - length, y1: 0, x2: -g, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
    ];
  },
  splitCross: ({ gap, length, spread, thickness }) => {
    const g = gap + spread, s = length;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - s },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + s },
      { type: 'line', x1: -g, y1: 0, x2: -g - s, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + s, y2: 0 },
      { type: 'circle', cx: 0, cy: 0, r: thickness * 0.8 },
    ];
  },
};

const state = {
  visible: true,
  shape: 'classic',
  color: '#00ff88',
  dotColor: '#00ff88',
  outlineColor: '#000000',
  outlineOpacity: 0.75,
  thickness: 2,
  gap: 6,
  length: 12,
  outline: true,
  spread: 0,
  targetSpread: 0,
  sensitivity: 0.25,
  customParts: null,
  ammo: null,
};

function drawGroup(list, cx, cy, lineWidth, style) {
  if (!list.length) return;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = style;
  ctx.fillStyle = style;

  ctx.beginPath();
  let hasLines = false;
  for (const p of list) {
    if (p.type === 'line') {
      ctx.moveTo(cx + p.x1, cy + p.y1);
      ctx.lineTo(cx + p.x2, cy + p.y2);
      hasLines = true;
    }
  }
  if (hasLines) ctx.stroke();

  for (const p of list) {
    if (p.type === 'circle') {
      ctx.beginPath();
      ctx.arc(cx + p.cx, cy + p.cy, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'rect') {
      ctx.fillRect(cx + p.x, cy + p.y, p.w, p.h);
    }
  }
}

function getParts() {
  if (Array.isArray(state.customParts) && state.customParts.length > 0) {
    return state.customParts;
  }
  const fn = SHAPES[state.shape] || SHAPES.classic;
  return fn(state);
}

function drawAmmo(cx, cy) {
  const a = state.ammo;
  if (!a || !a.enabled) return;

  const value = (a.override != null) ? a.override : a.current;
  if (value == null) return;

  const text = a.showMax ? `${value}/${a.max}` : `${value}`;
  const size = a.size || 16;

  ctx.font = `700 ${size}px "JetBrains Mono", "Consolas", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Position relative to crosshair center
  const directions = {
    right: { dx: a.offsetX + 20, dy: a.offsetY, align: 'left' },
    left:  { dx: -(a.offsetX + 20), dy: a.offsetY, align: 'right' },
    above: { dx: a.offsetX, dy: -(a.offsetY + 30), align: 'center' },
    below: { dx: a.offsetX, dy: a.offsetY + 30, align: 'center' },
  };
  const dir = directions[a.position] || directions.right;

  const x = cx + dir.dx;
  const y = cy + dir.dy;
  ctx.textAlign = dir.align;

  // Outline for readability
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.strokeText(text, x, y);

  ctx.fillStyle = a.color || '#00ff88';
  ctx.fillText(text, x, y);
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  if (state.visible) {
    const sens = Math.max(0.02, Math.min(1, state.sensitivity ?? 0.25));
    state.spread += (state.targetSpread - state.spread) * sens;

    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    const parts = getParts();

    if (state.outline) {
      const prevAlpha = ctx.globalAlpha;
      ctx.globalAlpha = state.outlineOpacity;
      drawGroup(parts.filter((p) => p.type === 'line'), cx, cy, state.thickness + 2, state.outlineColor);
      drawGroup(parts.filter((p) => p.type !== 'line'), cx, cy, state.thickness + 2, state.outlineColor);
      ctx.globalAlpha = prevAlpha;
    }

    drawGroup(parts.filter((p) => p.type === 'line'), cx, cy, state.thickness, state.color);
    drawGroup(parts.filter((p) => p.type !== 'line'), cx, cy, state.thickness, state.dotColor);

    drawAmmo(cx, cy);
  }

  requestAnimationFrame(draw);
}

draw();

window.api.onCrosshairUpdate((patch) => Object.assign(state, patch));