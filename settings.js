// ============================================================
// SHAPES (16 total — must match index.js)
// ============================================================
const SHAPES = {
  classic: ({ gap, length }) => {
    const g = gap;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - length },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + length },
      { type: 'line', x1: -g, y1: 0, x2: -g - length, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
    ];
  },
  crossDot: ({ gap, length, thickness }) => {
    const g = gap;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - length },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + length },
      { type: 'line', x1: -g, y1: 0, x2: -g - length, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
      { type: 'circle', cx: 0, cy: 0, r: thickness },
    ];
  },
  tShape: ({ gap, length }) => {
    const g = gap;
    return [
      { type: 'line', x1: -g, y1: 0, x2: -g - length, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + length },
    ];
  },
  dotOnly: ({ thickness }) => [{ type: 'circle', cx: 0, cy: 0, r: thickness }],
  circle: ({ gap, thickness }) => [{ type: 'circle', cx: 0, cy: 0, r: gap + thickness * 2 }],
  brackets: ({ gap, length }) => {
    const g = gap, s = length * 0.5;
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
  chevron: ({ gap, length }) => {
    const g = gap, s = length * 0.7;
    return [
      { type: 'line', x1: -g, y1: -g, x2: -g - s, y2: 0 },
      { type: 'line', x1: -g, y1: g, x2: -g - s, y2: 0 },
      { type: 'line', x1: g, y1: -g, x2: g + s, y2: 0 },
      { type: 'line', x1: g, y1: g, x2: g + s, y2: 0 },
    ];
  },
  triDot: ({ gap, length, thickness }) => [
    { type: 'line', x1: 0, y1: -gap, x2: 0, y2: -gap - length },
    { type: 'line', x1: -gap, y1: 0, x2: -gap - length, y2: 0 },
    { type: 'line', x1: gap, y1: 0, x2: gap + length, y2: 0 },
    { type: 'circle', cx: 0, cy: 0, r: thickness },
  ],
  diamond: ({ gap, length }) => {
    const g = gap + length * 0.5;
    return [
      { type: 'line', x1: 0, y1: -g, x2: g, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: 0, y2: g },
      { type: 'line', x1: 0, y1: g, x2: -g, y2: 0 },
      { type: 'line', x1: -g, y1: 0, x2: 0, y2: -g },
    ];
  },
  square: ({ gap, length }) => {
    const g = gap + length * 0.5;
    return [
      { type: 'line', x1: -g, y1: -g, x2: g, y2: -g },
      { type: 'line', x1: g, y1: -g, x2: g, y2: g },
      { type: 'line', x1: g, y1: g, x2: -g, y2: g },
      { type: 'line', x1: -g, y1: g, x2: -g, y2: -g },
    ];
  },
  heartbeat: ({ gap, length, thickness }) => {
    const g = gap;
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
  hashmark: ({ gap, length }) => {
    const g = gap, s = length * 0.6;
    return [
      { type: 'line', x1: -g - length, y1: 0, x2: g + length, y2: 0 },
      { type: 'line', x1: -g - s, y1: -s, x2: -g - s, y2: s },
      { type: 'line', x1: g + s, y1: -s, x2: g + s, y2: s },
      { type: 'line', x1: 0, y1: -g - length, x2: 0, y2: g + length },
      { type: 'line', x1: -s, y1: -g - s, x2: s, y2: -g - s },
      { type: 'line', x1: -s, y1: g + s, x2: s, y2: g + s },
    ];
  },
  triangle: ({ gap, length }) => {
    const g = gap + length * 0.6;
    const h = g * 0.85;
    return [
      { type: 'line', x1: 0, y1: -h, x2: g, y2: h * 0.5 },
      { type: 'line', x1: g, y1: h * 0.5, x2: -g, y2: h * 0.5 },
      { type: 'line', x1: -g, y1: h * 0.5, x2: 0, y2: -h },
    ];
  },
  xShape: ({ gap, length }) => {
    const g = gap * 0.7 + length * 0.35;
    return [
      { type: 'line', x1: -g, y1: -g, x2: g, y2: g },
      { type: 'line', x1: g, y1: -g, x2: -g, y2: g },
    ];
  },
  arrow: ({ gap, length }) => {
    const g = gap, s = length * 0.8;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - length },
      { type: 'line', x1: 0, y1: -g - length, x2: -s * 0.5, y2: -g - length + s * 0.5 },
      { type: 'line', x1: 0, y1: -g - length, x2: s * 0.5, y2: -g - length + s * 0.5 },
      { type: 'line', x1: -g - length, y1: 0, x2: -g, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + length, y2: 0 },
    ];
  },
  splitCross: ({ gap, length, thickness }) => {
    const g = gap, s = length;
    return [
      { type: 'line', x1: 0, y1: -g, x2: 0, y2: -g - s },
      { type: 'line', x1: 0, y1: g, x2: 0, y2: g + s },
      { type: 'line', x1: -g, y1: 0, x2: -g - s, y2: 0 },
      { type: 'line', x1: g, y1: 0, x2: g + s, y2: 0 },
      { type: 'circle', cx: 0, cy: 0, r: thickness * 0.8 },
    ];
  },
};

const SHAPE_ORDER = [
  'classic', 'crossDot', 'tShape', 'dotOnly',
  'circle', 'brackets', 'chevron', 'triDot',
  'diamond', 'square', 'heartbeat', 'hashmark',
  'triangle', 'xShape', 'arrow', 'splitCross',
];

// ============================================================
// ELEMENT REFS
// ============================================================
const els = {
  color:          document.getElementById('color'),
  dotColor:       document.getElementById('dotColor'),
  outlineColor:   document.getElementById('outlineColor'),
  outlineOpacity: document.getElementById('outlineOpacity'),
  thickness:      document.getElementById('thickness'),
  gap:            document.getElementById('gap'),
  length:         document.getElementById('length'),
  outline:        document.getElementById('outline'),
};
const valEls = {
  outlineOpacity: document.getElementById('outlineOpacityVal'),
  thickness:      document.getElementById('thicknessVal'),
  gap:            document.getElementById('gapVal'),
  length:         document.getElementById('lengthVal'),
};
const presetEls = {
  select: document.getElementById('presetSelect'),
  name:   document.getElementById('presetName'),
  load:   document.getElementById('presetLoad'),
  save:   document.getElementById('presetSave'),
  del:    document.getElementById('presetDelete'),
  exp:    document.getElementById('presetExport'),
  imp:    document.getElementById('presetImport'),
};
const shapeGrid = document.getElementById('shapeGrid');
const shapeCaption = document.getElementById('shapeCaption');
const themeToggle = document.getElementById('themeToggle');
const toastEl = document.getElementById('toast');
const toastTextEl = document.getElementById('toastText');

const pixelEls = {
  canvas:   document.getElementById('pixelCanvas'),
  size:     document.getElementById('pixelSize'),
  brush:    document.getElementById('brushSize'),
  brushVal: document.getElementById('brushVal'),
  symmetry: document.getElementById('symmetryGroup'),
  scale:    document.getElementById('pixelScale'),
  scaleVal: document.getElementById('pixelScaleVal'),
  clear:    document.getElementById('pixelClear'),
  invert:   document.getElementById('pixelInvert'),
  apply:    document.getElementById('pixelApply'),
};

const hotkeysList = document.getElementById('hotkeysList');
const hotkeysReset = document.getElementById('hotkeysReset');

const homeEls = {
  presetName:   document.getElementById('homePresetName'),
  toggle:       document.getElementById('homeToggle'),
  toggleLabel:  document.getElementById('homeToggleLabel'),
  nextPreset:   document.getElementById('homeNextPreset'),
  quickPresets: document.getElementById('homeQuickPresets'),
  presetCount:  document.getElementById('homePresetCount'),
  shapeName:    document.getElementById('homeShapeName'),
  mode:         document.getElementById('homeMode'),
  colorSwatch:  document.getElementById('homeColorSwatch'),
  colorHex:     document.getElementById('homeColorHex'),
  outline:      document.getElementById('homeOutline'),
  thickness:    document.getElementById('homeThickness'),
  gap:          document.getElementById('homeGap'),
  hotkeys:      document.getElementById('homeHotkeys'),
  canvas:       document.getElementById('homePreviewCanvas'),
};

// Reactive
const reactiveEls = {
  enabled:       document.getElementById('reactiveEnabled'),
  detailCard:    document.getElementById('reactiveDetailCard'),
  fireSpread:    document.getElementById('fireSpread'),
  fireSpreadVal: document.getElementById('fireSpreadVal'),
  moveSpread:    document.getElementById('moveSpread'),
  moveSpreadVal: document.getElementById('moveSpreadVal'),
  sensitivity:   document.getElementById('sensitivity'),
  sensitivityVal:document.getElementById('sensitivityVal'),
  combineGroup:  document.getElementById('combineGroup'),
  copyTarget:    document.getElementById('reactiveCopyTarget'),
  copyOne:       document.getElementById('reactiveCopyOne'),
  copyAll:       document.getElementById('reactiveCopyAll'),
  reset:         document.getElementById('reactiveReset'),
  presetLabel:   document.getElementById('reactivePresetLabel'),
};

// Ammo
const ammoEls = {
  enabled:       document.getElementById('ammoEnabled'),
  game:          document.getElementById('ammoGame'),
  gameLabel:     document.getElementById('ammoGameLabel'),
  gameDesc:      document.getElementById('ammoGameDesc'),
  useCustom:     document.getElementById('ammoUseCustom'),
  customSection: document.getElementById('ammoCustomSection'),
  region:        document.getElementById('ammoRegion'),
  bg:            document.getElementById('ammoBg'),
  threshold:     document.getElementById('ammoThreshold'),
  thresholdVal:  document.getElementById('ammoThresholdVal'),
  minHeight:     document.getElementById('ammoMinHeight'),
  minHeightVal:  document.getElementById('ammoMinHeightVal'),
  interval:      document.getElementById('ammoInterval'),
  intervalVal:   document.getElementById('ammoIntervalVal'),
  slash:         document.getElementById('ammoSlash'),
  testBtn:       document.getElementById('ammoTestBtn'),
  debugBtn:      document.getElementById('ammoDebugBtn'),
  debugPreview:  document.getElementById('ammoDebugPreview'),
  debugTime:     document.getElementById('ammoDebugTime'),
  detected:      document.getElementById('ammoDetected'),
  confidence:    document.getElementById('ammoConfidence'),
  rawReads:      document.getElementById('ammoRawReads'),
  override:      document.getElementById('ammoOverride'),
  overrideSet:   document.getElementById('ammoOverrideSet'),
  overrideClear: document.getElementById('ammoOverrideClear'),
  color:         document.getElementById('ammoColor'),
  position:      document.getElementById('ammoPosition'),
  showMax:       document.getElementById('ammoShowMax'),
  max:           document.getElementById('ammoMax'),
  maxVal:        document.getElementById('ammoMaxVal'),
  size:          document.getElementById('ammoSize'),
  sizeVal:       document.getElementById('ammoSizeVal'),
  offsetX:       document.getElementById('ammoOffsetX'),
  offsetXVal:    document.getElementById('ammoOffsetXVal'),
  offsetY:       document.getElementById('ammoOffsetY'),
  offsetYVal:    document.getElementById('ammoOffsetYVal'),
  status:        document.getElementById('ammoStatus'),
};

// ============================================================
// LOCAL STATE
// ============================================================
let currentShape = 'classic';
let activePreset = null;
let currentTheme = 'dark';
let usePixelMode = false;
let pixelScaleValue = 2;
let activeInput = null;
let crosshairVisible = true;

const REACTIVE_DEFAULTS = {
  enabled: true,
  fireSpread: 20,
  moveSpread: 10,
  sensitivity: 0.25,
  combine: 'add',
};

let reactiveState = { ...REACTIVE_DEFAULTS };
let reactiveCombine = 'add';

let ammoPresets = {};
let ammoState = {};

// ============================================================
// TOAST
// ============================================================
let toastTimer = null;
function toast(msg) {
  if (!toastEl) return;
  if (toastTextEl) toastTextEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
}

// ============================================================
// TABS
// ============================================================
document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');

    if (btn.dataset.tab === 'pixel' && pixelEditor) {
      requestAnimationFrame(() => {
        pixelEditor._resizeCanvas();
        pixelEditor.render();
      });
    }

    if (btn.dataset.tab === 'home') {
      requestAnimationFrame(() => {
        resizeHomeCanvas();
        renderHomePreview();
      });
    }
  });
});

// ============================================================
// STATE HELPERS
// ============================================================
function currentState() {
  return {
    shape:          currentShape,
    color:          els.color.value,
    dotColor:       els.dotColor.value,
    outlineColor:   els.outlineColor.value,
    outlineOpacity: Number(els.outlineOpacity.value),
    thickness:      Number(els.thickness.value),
    gap:            Number(els.gap.value),
    length:         Number(els.length.value),
    outline:        els.outline.checked,
    visible:        crosshairVisible,
    customParts: usePixelMode ? buildPixelParts() : null,
    pixelGrid: usePixelMode
      ? { size: pixelEditor.size, grid: Array.from(pixelEditor.grid), scale: pixelScaleValue }
      : null,
    reactive: buildReactivePayload(),
  };
}

function applyStateToUI(state) {
  if (state.shape !== undefined) currentShape = state.shape;
  if (state.visible !== undefined) crosshairVisible = state.visible;

  const setIfIdle = (el, val) => {
    if (el && activeInput !== el) el.value = val;
  };

  if (state.color          !== undefined) setIfIdle(els.color, state.color);
  if (state.dotColor       !== undefined) setIfIdle(els.dotColor, state.dotColor);
  if (state.outlineColor   !== undefined) setIfIdle(els.outlineColor, state.outlineColor);
  if (state.outlineOpacity !== undefined) setIfIdle(els.outlineOpacity, state.outlineOpacity);
  if (state.thickness      !== undefined) setIfIdle(els.thickness, state.thickness);
  if (state.gap            !== undefined) setIfIdle(els.gap, state.gap);
  if (state.length         !== undefined) setIfIdle(els.length, state.length);
  if (state.outline        !== undefined && activeInput !== els.outline) {
    els.outline.checked = state.outline;
  }

  if (state.pixelGrid && Array.isArray(state.pixelGrid.grid)) {
    pixelEditor.load(state.pixelGrid.grid, state.pixelGrid.size);
    if (state.pixelGrid.scale) {
      pixelScaleValue = state.pixelGrid.scale;
      pixelEls.scale.value = pixelScaleValue;
      pixelEls.scaleVal.textContent = `${pixelScaleValue}px`;
    }
    usePixelMode = true;
  } else if (Array.isArray(state.customParts) && state.customParts.length > 0) {
    usePixelMode = true;
  } else if (state.customParts === null) {
    usePixelMode = false;
  }

  if (state.reactive) applyReactiveToUI(state.reactive);
  if (state.ammo) applyAmmoToUI(state.ammo);

  if (reactiveEls.presetLabel) {
    reactiveEls.presetLabel.textContent = activePreset || 'Unsaved';
  }

  updateValueLabels();
  updateAllSliderFills();
  updateShapeHighlight();
  renderHomeStatus(state);
  renderHomePreview();
}

function updateValueLabels() {
  if (valEls.outlineOpacity) {
    valEls.outlineOpacity.textContent = `${Math.round(els.outlineOpacity.value * 100)}%`;
  }
  if (valEls.thickness) valEls.thickness.textContent = `${els.thickness.value}px`;
  if (valEls.gap)       valEls.gap.textContent       = `${els.gap.value}px`;
  if (valEls.length)    valEls.length.textContent    = `${els.length.value}px`;

  if (reactiveEls.fireSpreadVal) {
    reactiveEls.fireSpreadVal.textContent = `${reactiveEls.fireSpread.value} px`;
    reactiveEls.moveSpreadVal.textContent = `${reactiveEls.moveSpread.value} px`;
    reactiveEls.sensitivityVal.textContent = `${reactiveEls.sensitivity.value}%`;
  }

  if (ammoEls.thresholdVal) {
    ammoEls.thresholdVal.textContent = ammoEls.threshold.value;
    ammoEls.minHeightVal.textContent = `${ammoEls.minHeight.value} px`;
    ammoEls.intervalVal.textContent  = `${ammoEls.interval.value} ms`;
    ammoEls.maxVal.textContent       = ammoEls.max.value;
    ammoEls.sizeVal.textContent      = `${ammoEls.size.value} px`;
    ammoEls.offsetXVal.textContent   = `${ammoEls.offsetX.value} px`;
    ammoEls.offsetYVal.textContent   = `${ammoEls.offsetY.value} px`;
  }
}

function updateShapeHighlight() {
  if (!shapeGrid) return;
  [...shapeGrid.children].forEach((btn) => {
    btn.classList.toggle('active', !usePixelMode && btn.dataset.shape === currentShape);
  });
}

// ============================================================
// SHAPE GRID
// ============================================================
function makeShapeThumb(shapeFn) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'currentColor';
  ctx.fillStyle = 'currentColor';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  const parts = shapeFn({ gap: 6, length: 10, thickness: 2, spread: 0 });
  const cx = 32, cy = 32;

  ctx.beginPath();
  parts.forEach((p) => {
    if (p.type === 'line') {
      ctx.moveTo(cx + p.x1, cy + p.y1);
      ctx.lineTo(cx + p.x2, cy + p.y2);
    }
  });
  ctx.stroke();

  parts.forEach((p) => {
    if (p.type === 'circle') {
      ctx.beginPath();
      ctx.arc(cx + p.cx, cy + p.cy, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return canvas;
}

if (shapeGrid) {
  SHAPE_ORDER.forEach((name) => {
    const btn = document.createElement('button');
    btn.className = 'shape-btn';
    btn.dataset.shape = name;
    btn.title = name;
    btn.type = 'button';
    btn.appendChild(makeShapeThumb(SHAPES[name]));

    btn.addEventListener('click', () => {
      currentShape = name;
      usePixelMode = false;
      updateShapeHighlight();
      push();
    });

    btn.addEventListener('mouseenter', () => {
      if (shapeCaption) shapeCaption.textContent = name;
    });
    btn.addEventListener('mouseleave', () => {
      if (shapeCaption) shapeCaption.textContent = 'Click a shape to apply it.';
    });

    shapeGrid.appendChild(btn);
  });
  updateShapeHighlight();
}

// ============================================================
// PUSH STATE
// ============================================================
function push() {
  updateValueLabels();
  updateAllSliderFills();
  window.api.sendUpdate(currentState());
  renderHomePreview();
  renderHomeStatus();
}

Object.values(els).forEach((el) => {
  if (!el) return;
  el.addEventListener('focus', () => { activeInput = el; });
  el.addEventListener('blur',  () => { if (activeInput === el) activeInput = null; });
  el.addEventListener('input', push);
});

// ============================================================
// PIXEL EDITOR
// ============================================================
const pixelEditor = new PixelEditor(pixelEls.canvas, {
  size: 32,
  onChange: () => {
    if (usePixelMode) push();
    renderHomePreview();
  },
});

(function seedPixelGrid() {
  const size = pixelEditor.size;
  const grid = pixelEditor.grid;
  const set = (x, y) => {
    if (x >= 0 && x < size && y >= 0 && y < size) grid[y * size + x] = 1;
  };
  const c = Math.floor(size / 2);
  for (let i = 2; i < 6; i++) {
    set(c - i, c);
    set(c + i, c);
    set(c, c - i);
    set(c, c + i);
  }
  pixelEditor.render();
})();

if (pixelEls.brush) {
  pixelEls.brush.addEventListener('input', () => {
    const v = Number(pixelEls.brush.value);
    pixelEls.brushVal.textContent = v;
    pixelEditor.setBrush(v);
  });
}

if (pixelEls.size) {
  pixelEls.size.addEventListener('change', () => {
    pixelEditor.setSize(Number(pixelEls.size.value));
  });
}

if (pixelEls.symmetry) {
  pixelEls.symmetry.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      pixelEls.symmetry.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      pixelEditor.setSymmetry(btn.dataset.sym);
    });
  });
}

if (pixelEls.scale) {
  pixelEls.scale.addEventListener('input', () => {
    pixelScaleValue = Number(pixelEls.scale.value);
    pixelEls.scaleVal.textContent = `${pixelScaleValue}px`;
    if (usePixelMode) push();
    renderHomePreview();
  });
}

if (pixelEls.clear) pixelEls.clear.addEventListener('click', () => pixelEditor.clear());
if (pixelEls.invert) pixelEls.invert.addEventListener('click', () => pixelEditor.invert());

if (pixelEls.apply) {
  pixelEls.apply.addEventListener('click', () => {
    if (pixelEditor.isEmpty()) {
      usePixelMode = false;
      updateShapeHighlight();
      push();
      toast('Pixel crosshair cleared');
      return;
    }
    usePixelMode = true;
    updateShapeHighlight();
    push();
    toast('Pixel crosshair applied');
  });
}

function buildPixelParts() {
  const size = pixelEditor.size;
  const grid = pixelEditor.grid;
  const pixelSize = pixelScaleValue;
  const half = size / 2;
  const offset = -half * pixelSize + pixelSize / 2;
  const parts = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y * size + x]) {
        parts.push({
          type: 'rect',
          x: offset + x * pixelSize,
          y: offset + y * pixelSize,
          w: pixelSize,
          h: pixelSize,
        });
      }
    }
  }
  return parts;
}

// ============================================================
// PRESETS
// ============================================================
function renderPresetList({ list, active }) {
  if (!presetEls.select) return;
  presetEls.select.innerHTML = '';
  activePreset = active;

  if (list.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = '(no presets yet)';
    opt.disabled = true;
    presetEls.select.appendChild(opt);
  } else {
    list.forEach((name) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      if (name === active) opt.selected = true;
      presetEls.select.appendChild(opt);
    });
  }

  renderQuickPresets({ list, active });
  refreshReactiveCopyTargets(list, active);
  renderHomeStatus();
}

if (presetEls.save) {
  presetEls.save.addEventListener('click', async () => {
    const name = presetEls.name.value.trim();
    if (!name) { presetEls.name.focus(); return; }
    const result = await window.api.savePreset(name, currentState());
    presetEls.name.value = '';
    renderPresetList(result);
    toast(`Saved "${name}"`);
  });
}

if (presetEls.load) {
  presetEls.load.addEventListener('click', async () => {
    const name = presetEls.select.value;
    if (!name || presetEls.select.selectedOptions[0]?.disabled) return;
    const result = await window.api.loadPreset(name);
    renderPresetList(result);
    toast(`Loaded "${name}"`);
  });
}

if (presetEls.del) {
  presetEls.del.addEventListener('click', async () => {
    const name = presetEls.select.value;
    if (!name || presetEls.select.selectedOptions[0]?.disabled) return;
    const result = await window.api.deletePreset(name);
    renderPresetList(result);
    toast(`Deleted "${name}"`);
  });
}

if (presetEls.exp) {
  presetEls.exp.addEventListener('click', async () => {
    const name = presetEls.select.value;
    if (!name || presetEls.select.selectedOptions[0]?.disabled) return;
    const ok = await window.api.exportPreset(name);
    if (ok) toast(`Exported "${name}"`);
  });
}

if (presetEls.imp) {
  presetEls.imp.addEventListener('click', async () => {
    const result = await window.api.importPreset();
    if (result?.list) {
      renderPresetList(result);
      toast('Imported preset');
    }
  });
}

// ============================================================
// THEME
// ============================================================
async function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  await window.api.setTheme(theme);
  if (pixelEditor) pixelEditor.render();
  renderHomePreview();
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// ============================================================
// HOTKEYS
// ============================================================
const HOTKEY_LABELS = {
  toggle:     'Toggle crosshair',
  settings:   'Open settings',
  nextPreset: 'Next preset',
  prevPreset: 'Previous preset',
};

const DEFAULT_HOTKEYS = {
  toggle:     'Alt+X',
  settings:   'Alt+S',
  nextPreset: 'Alt+Right',
  prevPreset: 'Alt+Left',
};

let hotkeysState = { ...DEFAULT_HOTKEYS };
let capturingAction = null;

function renderHotkeys() {
  if (hotkeysList) {
    hotkeysList.innerHTML = '';

    for (const action of Object.keys(HOTKEY_LABELS)) {
      const row = document.createElement('div');
      row.className = 'hotkey-row';

      const label = document.createElement('span');
      label.className = 'hotkey-label';
      label.textContent = HOTKEY_LABELS[action];

      const key = document.createElement('button');
      key.className = 'hotkey-key';
      key.type = 'button';
      key.dataset.action = action;
      key.textContent = capturingAction === action
        ? 'Press keys…'
        : (hotkeysState[action] || '—');
      if (capturingAction === action) key.classList.add('capturing');

      key.addEventListener('click', () => {
        capturingAction = action;
        renderHotkeys();
        const btn = hotkeysList.querySelector(`[data-action="${action}"]`);
        if (btn) btn.focus();
      });

      row.appendChild(label);
      row.appendChild(key);
      hotkeysList.appendChild(row);
    }
  }

  renderHomeHotkeys();
}

function accelFromEvent(e) {
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return null;

  const parts = [];
  if (e.ctrlKey)  parts.push('Ctrl');
  if (e.altKey)   parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  if (e.metaKey)  parts.push('Cmd');

  let key = e.key;
  if (key === ' ') key = 'Space';
  else if (key === 'ArrowUp')    key = 'Up';
  else if (key === 'ArrowDown')  key = 'Down';
  else if (key === 'ArrowLeft')  key = 'Left';
  else if (key === 'ArrowRight') key = 'Right';
  else if (key.length === 1)     key = key.toUpperCase();

  parts.push(key);
  return parts.join('+');
}

window.addEventListener('keydown', async (e) => {
  if (!capturingAction) return;
  e.preventDefault();
  e.stopPropagation();

  if (e.key === 'Escape') {
    capturingAction = null;
    renderHotkeys();
    return;
  }

  const accel = accelFromEvent(e);
  if (!accel) return;

  const action = capturingAction;
  const next = { ...hotkeysState, [action]: accel };

  const conflicts = Object.entries(next).filter(
    ([k, v]) => k !== action && v === accel
  );

  if (conflicts.length > 0) {
    const btn = hotkeysList.querySelector(`[data-action="${action}"]`);
    if (btn) {
      btn.classList.add('conflict');
      btn.textContent = 'Conflict!';
      setTimeout(() => { capturingAction = null; renderHotkeys(); }, 900);
    }
    return;
  }

  hotkeysState = await window.api.setHotkeys(next);
  capturingAction = null;
  renderHotkeys();
  toast(`Bound "${HOTKEY_LABELS[action]}" to ${accel}`);
});

if (hotkeysReset) {
  hotkeysReset.addEventListener('click', async () => {
    hotkeysState = await window.api.setHotkeys({ ...DEFAULT_HOTKEYS });
    capturingAction = null;
    renderHotkeys();
    toast('Hotkeys reset');
  });
}

window.api.onHotkeysChanged((hk) => {
  hotkeysState = hk;
  renderHotkeys();
});

// ============================================================
// REACTIVE (BEHAVIOR TAB)
// ============================================================
function buildReactivePayload() {
  if (!reactiveEls.enabled) return { ...REACTIVE_DEFAULTS };
  return {
    enabled: reactiveEls.enabled.checked,
    fireSpread: Number(reactiveEls.fireSpread.value),
    moveSpread: Number(reactiveEls.moveSpread.value),
    sensitivity: Number(reactiveEls.sensitivity.value) / 100,
    combine: reactiveCombine,
  };
}

function updateReactiveDetailVisibility() {
  if (!reactiveEls.detailCard) return;
  reactiveEls.detailCard.setAttribute(
    'data-disabled',
    String(!reactiveEls.enabled.checked)
  );
}

function applyReactiveToUI(r) {
  if (!r || !reactiveEls.enabled) return;
  reactiveState = { ...REACTIVE_DEFAULTS, ...r };

  reactiveEls.enabled.checked = reactiveState.enabled !== false;
  reactiveEls.fireSpread.value = reactiveState.fireSpread ?? 20;
  reactiveEls.moveSpread.value = reactiveState.moveSpread ?? 10;
  reactiveEls.sensitivity.value = Math.round(
    (reactiveState.sensitivity ?? 0.25) * 100
  );
  reactiveCombine = reactiveState.combine === 'max' ? 'max' : 'add';

  reactiveEls.combineGroup.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', b.dataset.combine === reactiveCombine);
  });

  updateValueLabels();
  updateAllSliderFills();
  updateReactiveDetailVisibility();
}

function pushReactive() {
  const payload = buildReactivePayload();
  reactiveState = { ...reactiveState, ...payload };
  window.api.setReactive(payload);
  renderHomePreview();
}

if (reactiveEls.enabled) {
  const inputs = [
    reactiveEls.enabled,
    reactiveEls.fireSpread,
    reactiveEls.moveSpread,
    reactiveEls.sensitivity,
  ];

  for (const el of inputs) {
    el.addEventListener('input', () => {
      updateValueLabels();
      updateAllSliderFills();
      if (el === reactiveEls.enabled) updateReactiveDetailVisibility();
      pushReactive();
    });
  }

  reactiveEls.combineGroup.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      reactiveEls.combineGroup.querySelectorAll('button')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      reactiveCombine = btn.dataset.combine;
      pushReactive();
    });
  });

  reactiveEls.reset.addEventListener('click', () => {
    applyReactiveToUI({ ...REACTIVE_DEFAULTS });
    pushReactive();
    toast('Reactive reset to defaults');
  });

  reactiveEls.copyOne.addEventListener('click', async () => {
    const target = reactiveEls.copyTarget.value;
    if (!target) {
      toast('Select a preset first');
      return;
    }
    const result = await window.api.copyReactive({ target, all: false });
    if (result && result.count > 0) {
      toast(`Copied to "${target}"`);
    } else {
      toast('Preset not found');
    }
  });

  reactiveEls.copyAll.addEventListener('click', async () => {
    const confirmed = confirm(
      'Copy reactive settings to ALL presets? This will overwrite their current reactive config.'
    );
    if (!confirmed) return;
    const result = await window.api.copyReactive({ all: true });
    const n = (result && result.count) || 0;
    toast(`Copied to ${n} preset${n === 1 ? '' : 's'}`);
  });

  updateReactiveDetailVisibility();
}

function refreshReactiveCopyTargets(list, active) {
  if (!reactiveEls.copyTarget) return;
  const prev = reactiveEls.copyTarget.value;
  reactiveEls.copyTarget.innerHTML = '';

  if (!list.length) {
    const opt = document.createElement('option');
    opt.textContent = '(no presets)';
    opt.disabled = true;
    reactiveEls.copyTarget.appendChild(opt);
    reactiveEls.copyOne.disabled = true;
    reactiveEls.copyAll.disabled = true;
    return;
  }

  for (const name of list) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name + (name === active ? ' (current)' : '');
    reactiveEls.copyTarget.appendChild(opt);
  }

  if (prev && list.includes(prev)) {
    reactiveEls.copyTarget.value = prev;
  } else {
    const firstOther = list.find((n) => n !== active);
    if (firstOther) reactiveEls.copyTarget.value = firstOther;
  }

  reactiveEls.copyOne.disabled = false;
  reactiveEls.copyAll.disabled = false;
}

// ============================================================
// AMMO TAB
// ============================================================
function buildAmmoPayload() {
  const useCustom = ammoEls.useCustom.checked;
  return {
    enabled: ammoEls.enabled.checked,
    game: useCustom ? 'custom' : ammoEls.game.value,
    position: ammoEls.position.value,
    showMax: ammoEls.showMax.checked,
    color: ammoEls.color.value,
    size: Number(ammoEls.size.value),
    offsetX: Number(ammoEls.offsetX.value),
    offsetY: Number(ammoEls.offsetY.value),
    max: Number(ammoEls.max.value),
    custom: useCustom ? {
      region: ammoEls.region.value,
      thresholdMode: ammoEls.bg.value,
      thresholdValue: Number(ammoEls.threshold.value),
      minDigitHeight: Number(ammoEls.minHeight.value),
      expectSlash: ammoEls.slash.checked,
      digitsOnly: true,
    } : null,
    scanInterval: useCustom ? Number(ammoEls.interval.value) : 500,
  };
}

function pushAmmo() {
  const payload = buildAmmoPayload();
  ammoState = { ...ammoState, ...payload };
  window.api.setAmmoConfig(payload);
}

function updateAmmoCustomVisibility() {
  const useCustom = ammoEls.useCustom.checked;
  ammoEls.customSection.setAttribute('data-disabled', String(!useCustom));
  ammoEls.game.disabled = useCustom;
}

function updateAmmoStatus() {
  const running = ammoEls.enabled.checked;
  ammoEls.status.textContent = running ? 'Scanning' : 'Idle';
  ammoEls.status.setAttribute('data-state', running ? 'running' : 'idle');
}

function applyAmmoToUI(ammo) {
  if (!ammo) return;
  ammoState = { ...ammo };

  ammoEls.enabled.checked = !!ammo.enabled;
  ammoEls.game.value = ammo.game || 'valorant';
  ammoEls.position.value = ammo.position || 'right';
  ammoEls.showMax.checked = ammo.showMax !== false;
  ammoEls.color.value = ammo.color || '#00ff88';
  ammoEls.max.value = ammo.max || 30;
  ammoEls.size.value = ammo.size || 16;
  ammoEls.offsetX.value = ammo.offsetX != null ? ammo.offsetX : 40;
  ammoEls.offsetY.value = ammo.offsetY != null ? ammo.offsetY : 0;

  const useCustom = ammo.game === 'custom';
  ammoEls.useCustom.checked = useCustom;
  updateAmmoCustomVisibility();

  if (useCustom && ammo.custom) {
    ammoEls.region.value = ammo.custom.region || 'bottom-right';
    ammoEls.bg.value = ammo.custom.thresholdMode || 'dark-bg';
    ammoEls.threshold.value = ammo.custom.thresholdValue || 150;
    ammoEls.minHeight.value = ammo.custom.minDigitHeight || 18;
    ammoEls.slash.checked = !!ammo.custom.expectSlash;
  }

  if (ammo.override != null) {
    ammoEls.override.value = String(ammo.override);
  }

  updateValueLabels();
  updateAllSliderFills();
  updateAmmoStatus();
}

if (ammoEls.enabled) {
  const inputs = [
    ammoEls.enabled, ammoEls.game, ammoEls.useCustom,
    ammoEls.region, ammoEls.bg, ammoEls.threshold, ammoEls.minHeight,
    ammoEls.interval, ammoEls.slash, ammoEls.color, ammoEls.position,
    ammoEls.showMax, ammoEls.max, ammoEls.size, ammoEls.offsetX, ammoEls.offsetY,
  ];
  for (const el of inputs) {
    el.addEventListener('input', () => {
      updateValueLabels();
      updateAllSliderFills();
      if (el === ammoEls.useCustom) updateAmmoCustomVisibility();
      if (el === ammoEls.enabled) updateAmmoStatus();
      pushAmmo();
    });
  }
}

if (ammoEls.testBtn) {
  ammoEls.testBtn.addEventListener('click', async () => {
    ammoEls.testBtn.disabled = true;
    ammoEls.testBtn.textContent = 'Scanning…';
    try {
      await window.api.testAmmoScan();
    } finally {
      ammoEls.testBtn.disabled = false;
      ammoEls.testBtn.textContent = 'Test read';
    }
  });
}

if (ammoEls.debugBtn) {
  ammoEls.debugBtn.addEventListener('click', async () => {
    const state = await window.api.getAmmoState();
    showAmmoDebug(state);
  });
}

function showAmmoDebug(state) {
  if (!state) return;

  if (state.processedImage) {
    ammoEls.debugPreview.innerHTML = `<img src="${state.processedImage}" alt="OCR preview" />`;
  } else {
    ammoEls.debugPreview.innerHTML = '<div class="ammo-debug-preview-empty">No preview yet</div>';
  }

  if (state.value != null) {
    ammoEls.detected.textContent = String(state.value);
    ammoEls.confidence.textContent = `${state.confidence || 0}%`;
  } else {
    ammoEls.detected.textContent = '—';
    ammoEls.confidence.textContent = '—';
  }

  if (state.raw && state.raw.length) {
    ammoEls.rawReads.textContent = state.raw
      .map((n) => `"${n.text}" (${Math.round(n.confidence || 0)}%)`)
      .join(', ');
  } else {
    ammoEls.rawReads.textContent = state.error ? `Error: ${state.error}` : '—';
  }

  ammoEls.debugTime.textContent = new Date().toLocaleTimeString();
}

if (ammoEls.overrideSet) {
  ammoEls.overrideSet.addEventListener('click', async () => {
    const raw = ammoEls.override.value.trim();
    if (!raw) {
      await window.api.setAmmoOverride(null);
      toast('Override cleared');
      return;
    }
    const val = Number(raw);
    if (!Number.isFinite(val) || val < 0) {
      toast('Invalid value');
      return;
    }
    await window.api.setAmmoOverride(val);
    toast(`Override set to ${val}`);
  });
}

if (ammoEls.overrideClear) {
  ammoEls.overrideClear.addEventListener('click', async () => {
    ammoEls.override.value = '';
    await window.api.setAmmoOverride(null);
    toast('Override cleared');
  });
}

window.api.onAmmoValue((payload) => {
  if (payload.value != null) {
    ammoEls.detected.textContent = String(payload.value);
    ammoEls.confidence.textContent = `${payload.confidence || 0}%`;
    ammoEls.status.textContent = 'Scanning';
    ammoEls.status.setAttribute('data-state', 'running');
  } else {
    ammoEls.detected.textContent = '—';
    ammoEls.confidence.textContent = '—';
    if (payload.error) {
      ammoEls.status.textContent = 'Error';
      ammoEls.status.setAttribute('data-state', 'error');
    }
  }

  if (payload.processedImage) {
    ammoEls.debugPreview.innerHTML = `<img src="${payload.processedImage}" alt="OCR preview" />`;
  }

  if (payload.raw && payload.raw.length) {
    ammoEls.rawReads.textContent = payload.raw
      .map((n) => `"${n.text}" (${Math.round(n.confidence || 0)}%)`)
      .join(', ');
  } else if (payload.error) {
    ammoEls.rawReads.textContent = `Error: ${payload.error}`;
  }

  ammoEls.debugTime.textContent = new Date().toLocaleTimeString();
});

// ============================================================
// HOME TAB — PREVIEW
// ============================================================
const homeCanvas = homeEls.canvas;
const homeCtx = homeCanvas ? homeCanvas.getContext('2d') : null;
const homeDpr = window.devicePixelRatio || 1;

function resizeHomeCanvas() {
  if (!homeCanvas) return;
  const rect = homeCanvas.getBoundingClientRect();
  const w = rect.width || 400;
  const h = rect.height || 300;
  homeCanvas.width = w * homeDpr;
  homeCanvas.height = h * homeDpr;
  homeCtx.setTransform(homeDpr, 0, 0, homeDpr, 0, 0);
}

window.addEventListener('resize', resizeHomeCanvas);

function homeGetParts(s) {
  if (Array.isArray(s.customParts) && s.customParts.length > 0) return s.customParts;
  const fn = SHAPES[s.shape] || SHAPES.classic;
  return fn(s);
}

function homeDrawGroup(list, cx, cy, lineWidth, style) {
  if (!list.length) return;
  homeCtx.lineWidth = lineWidth;
  homeCtx.strokeStyle = style;
  homeCtx.fillStyle = style;
  homeCtx.beginPath();
  let hasLines = false;
  for (const p of list) {
    if (p.type === 'line') {
      homeCtx.moveTo(cx + p.x1, cy + p.y1);
      homeCtx.lineTo(cx + p.x2, cy + p.y2);
      hasLines = true;
    }
  }
  if (hasLines) homeCtx.stroke();
  for (const p of list) {
    if (p.type === 'circle') {
      homeCtx.beginPath();
      homeCtx.arc(cx + p.cx, cy + p.cy, p.r, 0, Math.PI * 2);
      homeCtx.fill();
    } else if (p.type === 'rect') {
      homeCtx.fillRect(cx + p.x, cy + p.y, p.w, p.h);
    }
  }
}

function renderHomePreview() {
  if (!homeCtx || !homeCanvas) return;
  const w = homeCanvas.clientWidth;
  const h = homeCanvas.clientHeight;
  if (w === 0 || h === 0) return;

  homeCtx.clearRect(0, 0, w, h);

  const s = currentState();
  const parts = homeGetParts(s);
  const cx = w / 2;
  const cy = h / 2;

  const byRole = { bar: [], dot: [] };
  for (const p of parts) {
    const role = p.role || (p.type === 'circle' ? 'dot' : 'bar');
    (byRole[role] || byRole.bar).push(p);
  }

  if (s.outline) {
    const prevAlpha = homeCtx.globalAlpha;
    homeCtx.globalAlpha = s.outlineOpacity;
    homeDrawGroup(byRole.bar, cx, cy, s.thickness + 2, s.outlineColor);
    homeDrawGroup(byRole.dot, cx, cy, s.thickness + 2, s.outlineColor);
    homeCtx.globalAlpha = prevAlpha;
  }
  homeDrawGroup(byRole.bar, cx, cy, s.thickness, s.color);
  homeDrawGroup(byRole.dot, cx, cy, s.thickness, s.dotColor);
}

// ============================================================
// HOME TAB — STATUS / PRESETS / HOTKEYS
// ============================================================
function renderHomeStatus(state) {
  if (!homeEls.shapeName) return;
  const s = state || currentState();

  homeEls.shapeName.textContent = usePixelMode ? 'Pixel Art' : (s.shape || 'classic');
  if (homeEls.mode) homeEls.mode.textContent = usePixelMode ? 'Pixel' : 'Built-in';
  if (homeEls.colorHex) homeEls.colorHex.textContent = (s.color || '#00ff88').toUpperCase();
  if (homeEls.colorSwatch) homeEls.colorSwatch.style.background = s.color || '#00ff88';
  if (homeEls.outline) homeEls.outline.textContent = s.outline ? 'On' : 'Off';
  if (homeEls.thickness) homeEls.thickness.textContent = `${s.thickness} px`;
  if (homeEls.gap) homeEls.gap.textContent = `${s.gap} px`;
  if (homeEls.presetName) homeEls.presetName.textContent = activePreset || 'Unsaved';

  if (homeEls.toggleLabel) {
    homeEls.toggleLabel.textContent = crosshairVisible
      ? 'Hide crosshair'
      : 'Show crosshair';
  }
}

function renderQuickPresets({ list, active }) {
  if (!homeEls.quickPresets) return;
  homeEls.quickPresets.innerHTML = '';
  if (homeEls.presetCount) homeEls.presetCount.textContent = String(list.length);

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'quick-preset-empty';
    empty.textContent = 'No presets yet. Create one in the Presets tab.';
    homeEls.quickPresets.appendChild(empty);
    return;
  }

  list.slice(0, 6).forEach((name) => {
    const btn = document.createElement('button');
    btn.className = 'quick-preset';
    btn.type = 'button';
    if (name === active) btn.classList.add('active');

    const pip = document.createElement('span');
    pip.className = 'quick-preset-pip';

    const label = document.createElement('span');
    label.className = 'quick-preset-name';
    label.textContent = name;

    btn.appendChild(pip);
    btn.appendChild(label);

    btn.addEventListener('click', async () => {
      const result = await window.api.loadPreset(name);
      renderPresetList(result);
      toast(`Loaded "${name}"`);
    });

    homeEls.quickPresets.appendChild(btn);
  });
}

function renderHomeHotkeys() {
  if (!homeEls.hotkeys) return;
  homeEls.hotkeys.innerHTML = '';

  for (const action of Object.keys(HOTKEY_LABELS)) {
    const item = document.createElement('div');
    item.className = 'home-hotkey-item';

    const label = document.createElement('span');
    label.className = 'home-hotkey-label';
    label.textContent = HOTKEY_LABELS[action];

    const key = document.createElement('span');
    key.className = 'home-hotkey-key';
    key.textContent = hotkeysState[action] || '—';

    item.appendChild(label);
    item.appendChild(key);
    homeEls.hotkeys.appendChild(item);
  }
}

if (homeEls.toggle) {
  homeEls.toggle.addEventListener('click', () => {
    crosshairVisible = !crosshairVisible;
    window.api.sendUpdate({ visible: crosshairVisible });
    renderHomeStatus();
    toast(crosshairVisible ? 'Crosshair shown' : 'Crosshair hidden');
  });
}

if (homeEls.nextPreset) {
  homeEls.nextPreset.addEventListener('click', async () => {
    const { list, active } = await window.api.listPresets();
    if (!list.length) {
      toast('No presets to cycle');
      return;
    }
    const idx = list.indexOf(active);
    const next = list[(idx + 1 + list.length) % list.length];
    const result = await window.api.loadPreset(next);
    renderPresetList(result);
    toast(`Loaded "${next}"`);
  });
}

document.querySelectorAll('.home-goto').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.goto;
    const tab = document.querySelector(`.tab[data-tab="${target}"]`);
    if (tab) tab.click();
  });
});

// ============================================================
// WINDOW CONTROLS
// ============================================================
document.getElementById('btn-min')?.addEventListener('click', () => {
  window.api.minimizeWindow?.();
});

document.getElementById('btn-close')?.addEventListener('click', () => {
  window.api.closeWindow?.();
});

// ============================================================
// SLIDER FILL HELPER
// ============================================================
function updateSliderFill(input) {
  const min = parseFloat(input.min || '0');
  const max = parseFloat(input.max || '100');
  const value = parseFloat(input.value || '0');
  const pct = ((value - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateAllSliderFills() {
  document.querySelectorAll('.range').forEach(updateSliderFill);
}

document.querySelectorAll('.range').forEach((r) => {
  r.addEventListener('input', () => updateSliderFill(r));
});

// ============================================================
// MAIN → SETTINGS
// ============================================================
window.api.onStateChanged((state) => applyStateToUI(state));
window.api.onPresetList((payload) => renderPresetList(payload));
window.api.onThemeChanged((theme) => {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (pixelEditor) pixelEditor.render();
  renderHomePreview();
});

// ============================================================
// INIT
// ============================================================
(async () => {
  // Presets + theme
  const { list, active, theme } = await window.api.listPresets();
  renderPresetList({ list, active });
  if (theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Hotkeys
  hotkeysState = await window.api.getHotkeys();
  renderHotkeys();

  // Reactive
  const reactive = await window.api.getReactive();
  applyReactiveToUI(reactive);

  // Ammo
  ammoPresets = await window.api.getAmmoPresets();
  if (ammoEls.game) {
    ammoEls.game.innerHTML = '';
    for (const [key, preset] of Object.entries(ammoPresets)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = preset.label;
      ammoEls.game.appendChild(opt);
    }
  }
  const ammoResult = await window.api.getAmmoConfig();
  if (ammoResult.ammo) applyAmmoToUI(ammoResult.ammo);

  if (ammoEls.game) {
    ammoEls.game.addEventListener('change', () => {
      const p = ammoPresets[ammoEls.game.value];
      if (p) {
        ammoEls.gameDesc.textContent = p.description;
        ammoEls.gameLabel.textContent = p.label;
        ammoEls.max.value = p.maxAmmo || 30;
        updateValueLabels();
        updateAllSliderFills();
      }
    });

    const p = ammoPresets[ammoEls.game.value];
    if (p) {
      ammoEls.gameDesc.textContent = p.description;
      ammoEls.gameLabel.textContent = p.label;
    }
  }

  // Pixel editor + home preview
  requestAnimationFrame(() => {
    updateAllSliderFills();
    pixelEditor._resizeCanvas();
    pixelEditor.render();
    resizeHomeCanvas();
    renderHomePreview();
    renderHomeStatus();
    renderHomeHotkeys();
  });
})();