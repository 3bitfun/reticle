const { uIOhook } = require('uiohook-napi');
const { EventEmitter } = require('events');

const MOVE_KEYS = new Set([
  30, // A
  31, // S
  32, // D
  17, // W
  42, // Left Shift
]);

const DEFAULT_REACTIVE = {
  enabled: true,
  fireSpread: 20,
  moveSpread: 10,
  sensitivity: 0.25,
  combine: 'add',
};

class InputTracker extends EventEmitter {
  constructor() {
    super();
    this.firing = false;
    this.moving = false;
    this.pressedMoveKeys = new Set();
    this.reactive = { ...DEFAULT_REACTIVE };
    this._lastSpread = 0;
  }

  setReactive(config) {
    this.reactive = { ...this.reactive, ...(config || {}) };
    this._emitSpread();
  }

  getReactive() {
    return { ...this.reactive };
  }

  _computeSpread() {
    const r = this.reactive;
    if (!r.enabled) return 0;

    const fire = this.firing ? (r.fireSpread || 0) : 0;
    const move = this.moving ? (r.moveSpread || 0) : 0;

    if (r.combine === 'max') return Math.max(fire, move);
    return fire + move;
  }

  _emitSpread() {
    const v = this._computeSpread();
    if (v !== this._lastSpread) {
      this._lastSpread = v;
      this.emit('spread-change', v);
    }
  }

  start() {
    uIOhook.on('mousedown', (e) => {
      if (e.button === 1) {
        this.firing = true;
        this._emitSpread();
        this.emit('fire-start');
      }
    });

    uIOhook.on('mouseup', (e) => {
      if (e.button === 1) {
        this.firing = false;
        this._emitSpread();
        this.emit('fire-stop');
      }
    });

    uIOhook.on('keydown', (e) => {
      if (MOVE_KEYS.has(e.keycode)) {
        this.pressedMoveKeys.add(e.keycode);
        if (!this.moving) {
          this.moving = true;
          this._emitSpread();
          this.emit('move-start');
        }
      }
    });

    uIOhook.on('keyup', (e) => {
      if (MOVE_KEYS.has(e.keycode)) {
        this.pressedMoveKeys.delete(e.keycode);
        if (this.pressedMoveKeys.size === 0 && this.moving) {
          this.moving = false;
          this._emitSpread();
          this.emit('move-stop');
        }
      }
    });

    uIOhook.start();
  }

  stop() {
    try { uIOhook.stop(); } catch {}
  }
}

module.exports = new InputTracker();
module.exports.DEFAULT_REACTIVE = DEFAULT_REACTIVE;