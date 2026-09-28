// PixelEditor — a reusable canvas grid editor
class PixelEditor {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = opts.size || 32;
    this.grid = new Uint8Array(this.size * this.size);
    this.brushSize = 1;
    this.symmetry = 'quad'; // 'none' | 'h' | 'v' | 'quad'
    this.mode = 'draw'; // 'draw' | 'erase'
    this.onChange = opts.onChange || (() => {});
    this.hover = null;
    this.cellSize = 0;

    this._bindEvents();
    this._resizeCanvas();
    this.render();
  }

  setSize(newSize) {
    // Preserve center content when resizing
    const old = this.grid;
    const oldSize = this.size;
    const next = new Uint8Array(newSize * newSize);
    const offset = Math.floor((newSize - oldSize) / 2);
    for (let y = 0; y < oldSize; y++) {
      for (let x = 0; x < oldSize; x++) {
        const nx = x + offset;
        const ny = y + offset;
        if (nx >= 0 && nx < newSize && ny >= 0 && ny < newSize) {
          next[ny * newSize + nx] = old[y * oldSize + x];
        }
      }
    }
    this.grid = next;
    this.size = newSize;
    this._resizeCanvas();
    this.render();
    this.onChange(this);
  }

  clear() {
    this.grid.fill(0);
    this.render();
    this.onChange(this);
  }

  invert() {
    for (let i = 0; i < this.grid.length; i++) this.grid[i] = this.grid[i] ? 0 : 1;
    this.render();
    this.onChange(this);
  }

  setSymmetry(sym) {
    this.symmetry = sym;
  }

  setBrush(n) {
    this.brushSize = n;
  }

  setMode(mode) {
    this.mode = mode;
  }

  load(gridArr, size) {
    if (size && size !== this.size) {
      this.size = size;
      this._resizeCanvas();
    }
    this.grid = new Uint8Array(gridArr);
    this.render();
    this.onChange(this);
  }

  serialize() {
    return { size: this.size, grid: Array.from(this.grid) };
  }

  isEmpty() {
    for (let i = 0; i < this.grid.length; i++) if (this.grid[i]) return false;
    return true;
  }

  _resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    // Fallback if not laid out yet
    const w = rect.width || 320;
    const h = rect.height || 320;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cellSize = w / this.size;
  }

  _bindEvents() {
    const c = this.canvas;

    const cellFromEvent = (e) => {
      const rect = c.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.cellSize);
      const y = Math.floor((e.clientY - rect.top) / this.cellSize);
      if (x < 0 || y < 0 || x >= this.size || y >= this.size) return null;
      return { x, y };
    };

    let painting = false;
    let paintValue = 1;

    c.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const cell = cellFromEvent(e);
      if (!cell) return;
      painting = true;
      paintValue = e.button === 2 || e.shiftKey ? 0 : 1;
      this._paint(cell.x, cell.y, paintValue);
    });

    c.addEventListener('mousemove', (e) => {
      const cell = cellFromEvent(e);
      this.hover = cell;
      if (painting && cell) this._paint(cell.x, cell.y, paintValue);
      this.render();
    });

    c.addEventListener('mouseleave', () => {
      this.hover = null;
      painting = false;
      this.render();
    });

    window.addEventListener('mouseup', () => { painting = false; });
    c.addEventListener('contextmenu', (e) => e.preventDefault());

    // Touch support
    c.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = c.getBoundingClientRect();
      const x = Math.floor((t.clientX - rect.left) / this.cellSize);
      const y = Math.floor((t.clientY - rect.top) / this.cellSize);
      painting = true;
      paintValue = 1;
      this._paint(x, y, 1);
    }, { passive: false });

    c.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!painting) return;
      const t = e.touches[0];
      const rect = c.getBoundingClientRect();
      const x = Math.floor((t.clientX - rect.left) / this.cellSize);
      const y = Math.floor((t.clientY - rect.top) / this.cellSize);
      this._paint(x, y, paintValue);
    }, { passive: false });

    c.addEventListener('touchend', () => { painting = false; });

    window.addEventListener('resize', () => {
      this._resizeCanvas();
      this.render();
    });
  }

  _paint(cx, cy, value) {
    const b = this.brushSize;
    const half = Math.floor(b / 2);
    const size = this.size;

    const set = (x, y) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      this.grid[y * size + x] = value;
    };

    for (let dy = -half; dy < b - half; dy++) {
      for (let dx = -half; dx < b - half; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        set(x, y);

        // Symmetry
        if (this.symmetry === 'h' || this.symmetry === 'quad') {
          set(size - 1 - x, y);
        }
        if (this.symmetry === 'v' || this.symmetry === 'quad') {
          set(x, size - 1 - y);
        }
        if (this.symmetry === 'quad') {
          set(size - 1 - x, size - 1 - y);
        }
      }
    }
    this.render();
    this.onChange(this);
  }

  render() {
    const ctx = this.ctx;
    const size = this.size;
    const cell = this.cellSize;
    const w = size * cell;

    // Background
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = this._css('--pixel-bg', '#0f1115');
    ctx.fillRect(0, 0, w, w);

    // Grid lines (subtle)
    ctx.strokeStyle = this._css('--pixel-grid', 'rgba(255,255,255,0.05)');
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= size; i++) {
      ctx.moveTo(i * cell + 0.5, 0);
      ctx.lineTo(i * cell + 0.5, w);
      ctx.moveTo(0, i * cell + 0.5);
      ctx.lineTo(w, i * cell + 0.5);
    }
    ctx.stroke();

    // Center lines (brighter)
    ctx.strokeStyle = this._css('--pixel-center', 'rgba(255,255,255,0.18)');
    ctx.beginPath();
    ctx.moveTo(w / 2 + 0.5, 0);
    ctx.lineTo(w / 2 + 0.5, w);
    ctx.moveTo(0, w / 2 + 0.5);
    ctx.lineTo(w, w / 2 + 0.5);
    ctx.stroke();

    // Filled pixels
    ctx.fillStyle = this._css('--pixel-on', '#00ff88');
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (this.grid[y * size + x]) {
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }

    // Hover highlight
    if (this.hover) {
      const b = this.brushSize;
      const half = Math.floor(b / 2);
      const hx = (this.hover.x - half) * cell;
      const hy = (this.hover.y - half) * cell;
      ctx.strokeStyle = this._css('--pixel-hover', 'rgba(255,255,255,0.7)');
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hx + 0.75, hy + 0.75, b * cell - 1.5, b * cell - 1.5);
    }
  }

  _css(varName, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return v || fallback;
  }
}

window.PixelEditor = PixelEditor;