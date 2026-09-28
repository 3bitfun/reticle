const { desktopCapturer, BrowserWindow, screen } = require('electron');
const { EventEmitter } = require('events');
const path = require('path');
const { GAME_PRESETS } = require('./ammo-presets');

class OcrService extends EventEmitter {
  constructor() {
    super();
    this.win = null;
    this.winReady = null;
    this.config = { ...GAME_PRESETS.custom, scanInterval: 500 };
    this.running = false;
    this.scanning = false;
    this.scanTimer = null;
    this.seq = 0;
    this.pending = null;
    this.lastValue = null;
    this.lastConfidence = 0;
    this.lastRaw = [];
    this.lastProcessedImage = null;
    this.lastError = null;
    this.consecutiveFails = 0;
  }

  async ensureWindow() {
    if (this.win && !this.win.isDestroyed()) return this.win;
    if (this.winReady) return this.winReady;

    this.winReady = new Promise((resolve, reject) => {
      this.win = new BrowserWindow({
        width: 500,
        height: 400,
        show: false,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          backgroundThrottling: false,
          webSecurity: false,
        },
      });

      this.win.webContents.on('ipc-message', (_e, channel, payload) => {
        if (channel === 'ocr-result') {
          if (this.pending && payload.seq === this.pending.seq) {
            const resolveFn = this.pending.resolve;
            this.pending = null;
            resolveFn(payload);
          }
        }
      });

      this.win.webContents.on('did-finish-load', () => resolve(this.win));
      this.win.webContents.on('did-fail-load', (_e, code, desc) => {
        reject(new Error(`OCR window failed to load: ${desc} (${code})`));
      });

      this.win.loadFile('ocr.html');
    });

    return this.winReady;
  }

  async captureScreen() {
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.size;
    const scale = display.scaleFactor || 1;

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.round(width * scale),
        height: Math.round(height * scale),
      },
    });

    if (!sources || !sources.length) return null;
    return sources[0].thumbnail.toDataURL();
  }

  async scanOnce() {
    if (this.scanning) return null;
    this.scanning = true;

    try {
      const dataUrl = await this.captureScreen();
      if (!dataUrl) {
        this.scanning = false;
        return null;
      }

      const win = await this.ensureWindow();
      const seq = ++this.seq;

      const result = await new Promise((resolve) => {
        this.pending = { seq, resolve };
        win.webContents.send('ocr-scan', {
          seq,
          image: dataUrl,
          config: this.config,
        });

        setTimeout(() => {
          if (this.pending && this.pending.seq === seq) {
            this.pending = null;
            resolve(null);
          }
        }, 8000);
      });

      this.scanning = false;

      if (!result || result.error) {
        this.lastError = result ? result.error : 'timeout';
        this.consecutiveFails++;
        this.emit('no-value', { raw: [], error: this.lastError });
        return null;
      }

      this.lastRaw = result.numbers || [];
      this.lastProcessedImage = result.processedImage || null;
      this.lastError = null;

      const picked = this.pickBest(this.lastRaw);
      if (picked) {
        this.consecutiveFails = 0;
        this.lastValue = picked.value;
        this.lastConfidence = picked.confidence;
        this.emit('value', {
          value: picked.value,
          confidence: picked.confidence,
          raw: this.lastRaw,
          processedImage: this.lastProcessedImage,
        });
        return picked;
      }

      this.consecutiveFails++;
      this.emit('no-value', { raw: this.lastRaw });
      return null;
    } catch (err) {
      this.scanning = false;
      this.lastError = String(err && err.message ? err.message : err);
      this.consecutiveFails++;
      this.emit('error', err);
      return null;
    }
  }

  pickBest(numbers) {
    if (!numbers || !numbers.length) return null;

    const max = this.config.maxAmmo || 999;
    const minH = this.config.minDigitHeight || 14;

    const candidates = [];
    for (const n of numbers) {
      const digits = String(n.text).replace(/[^0-9]/g, '');
      if (!digits) continue;
      if (digits.length > 4) continue;
      if ((n.confidence || 0) < 40) continue;
      const val = parseInt(digits, 10);
      if (!Number.isFinite(val)) continue;
      if (val > max) continue;
      if ((n.height || 0) < minH) continue;
      candidates.push({ ...n, value: val });
    }

    if (!candidates.length) return null;

    candidates.sort((a, b) => {
      const scoreA = (a.confidence || 0) * (a.height || 0) * (a.width || 0);
      const scoreB = (b.confidence || 0) * (b.height || 0) * (b.width || 0);
      return scoreB - scoreA;
    });

    const top = candidates[0];
    return {
      value: top.value,
      confidence: Math.round(top.confidence || 0),
    };
  }

  setConfig(patch) {
    this.config = { ...this.config, ...patch };
  }

  getConfig() {
    return { ...this.config };
  }

  getState() {
    return {
      value: this.lastValue,
      confidence: this.lastConfidence,
      raw: this.lastRaw,
      processedImage: this.lastProcessedImage,
      error: this.lastError,
      running: this.running,
    };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    this.scanOnce().finally(() => {
      if (this.running) {
        const interval = this.config.scanInterval || 500;
        this.scanTimer = setTimeout(() => this._loop(), interval);
      }
    });
  }

  stop() {
    this.running = false;
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
  }

  destroy() {
    this.stop();
    if (this.win && !this.win.isDestroyed()) {
      this.win.destroy();
    }
    this.win = null;
    this.winReady = null;
  }
}

module.exports = new OcrService();