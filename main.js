const { app, BrowserWindow, globalShortcut, ipcMain, screen, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const presets = require('./presets');
const input = require('./input');
const ocr = require('./ocr');
const { GAME_PRESETS } = require('./ammo-presets');
const { createTray, destroyTray } = require('./tray');

let overlay = null;
let settingsWin = null;

// ---------- Config ----------
const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');
let currentTheme = 'dark';
let customAmmoConfig = null;

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      if (cfg.theme) currentTheme = cfg.theme;
      if (cfg.customAmmo) customAmmoConfig = cfg.customAmmo;
    }
  } catch (err) {
    console.error('Failed to load config:', err);
  }
}

function saveConfig(patch) {
  let cfg = {};
  try {
    if (fs.existsSync(CONFIG_PATH)) cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {}
  cfg = { ...cfg, ...patch };
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}

// ---------- Hotkeys ----------
const DEFAULT_HOTKEYS = {
  toggle:     'Alt+X',
  settings:   'Alt+S',
  nextPreset: 'Alt+Right',
  prevPreset: 'Alt+Left',
};

let hotkeys = { ...DEFAULT_HOTKEYS };

function loadHotkeysFromConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      if (cfg.hotkeys) hotkeys = { ...DEFAULT_HOTKEYS, ...cfg.hotkeys };
    }
  } catch {}
}

function registerHotkeys() {
  globalShortcut.unregisterAll();

  const handlers = {
    toggle: () => {
      currentState.visible = !currentState.visible;
      sendToOverlay('crosshair-update', currentState);
      broadcastSettingsUpdate();
    },
    settings: () => {
      if (!settingsWin || settingsWin.isDestroyed()) return createSettings();
      settingsWin.isVisible() ? settingsWin.hide() : settingsWin.show();
    },
    nextPreset: () => cyclePreset(1),
    prevPreset: () => cyclePreset(-1),
  };

  for (const action of Object.keys(hotkeys)) {
    const accel = hotkeys[action];
    if (!accel) continue;
    try {
      globalShortcut.register(accel, handlers[action]);
    } catch (err) {
      console.error(`Failed to register hotkey ${accel}:`, err);
    }
  }
}

function updateHotkeys(newHotkeys) {
  hotkeys = { ...hotkeys, ...newHotkeys };
  saveConfig({ hotkeys });
  registerHotkeys();
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.webContents.send('hotkeys-changed', hotkeys);
  }
}

// ---------- App state ----------
const DEFAULT_REACTIVE = {
  enabled: true,
  fireSpread: 20,
  moveSpread: 10,
  sensitivity: 0.25,
  combine: 'add',
};

const DEFAULT_AMMO = {
  enabled: false,
  game: 'valorant',
  current: 30,
  max: 30,
  override: null,
  position: 'right',
  showMax: true,
  color: '#00ff88',
  size: 16,
  offsetX: 40,
  offsetY: 0,
};

let currentState = {
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
  pixelGrid: null,

  reactive: { ...DEFAULT_REACTIVE },
  ammo: { ...DEFAULT_AMMO },
};

let activePreset = null;
let presetList = [];

// ---------- Helpers ----------
function sendToOverlay(channel, payload) {
  if (overlay && !overlay.isDestroyed()) {
    overlay.webContents.send(channel, payload);
  }
}

function broadcastSettingsUpdate() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.webContents.send('state-changed', currentState);
    settingsWin.webContents.send('preset-list', { list: presetList, active: activePreset });
  }
}

function applyState(patch) {
  const prevReactive = currentState.reactive;
  currentState = { ...currentState, ...patch };

  if (patch && patch.reactive) {
    input.setReactive(currentState.reactive);
    currentState.sensitivity = currentState.reactive.sensitivity;
  }

  sendToOverlay('crosshair-update', {
    ...currentState,
    sensitivity: currentState.reactive.sensitivity,
  });

  if (patch && patch.ammo) syncOcrFromState();

  broadcastSettingsUpdate();
}

function refreshPresetList() {
  presetList = presets.listPresets().map((p) => p.name);
}

function loadPreset(name) {
  const all = presets.listPresets();
  const found = all.find((p) => p.name === name);
  if (!found) return;

  const { name: _n, ...rest } = found;

  // Merge with defaults so older presets fill in missing fields
  const merged = {
    ...rest,
    reactive: { ...DEFAULT_REACTIVE, ...(rest.reactive || {}) },
    ammo: { ...DEFAULT_AMMO, ...(rest.ammo || {}) },
    spread: 0,
    targetSpread: 0,
  };

  activePreset = name;
  currentState = { ...currentState, ...merged };
  currentState.sensitivity = currentState.reactive.sensitivity;

  input.setReactive(currentState.reactive);
  sendToOverlay('crosshair-update', {
    ...currentState,
    sensitivity: currentState.reactive.sensitivity,
  });
  syncOcrFromState();
  broadcastSettingsUpdate();
}

function cyclePreset(direction = 1) {
  if (presetList.length === 0) return;
  const idx = presetList.indexOf(activePreset);
  const next = presetList[(idx + direction + presetList.length) % presetList.length];
  loadPreset(next);
}

// ---------- Ammo/OCR bridge ----------
function resolveAmmoOcrConfig(ammo) {
  const game = ammo.game || 'custom';
  const base = GAME_PRESETS[game] || GAME_PRESETS.custom;

  if (game === 'custom' && customAmmoConfig) {
    return {
      ...base,
      ...customAmmoConfig,
      maxAmmo: ammo.max,
      scanInterval: ammo.scanInterval || 500,
    };
  }

  return {
    ...base,
    maxAmmo: ammo.max,
    scanInterval: ammo.scanInterval || 500,
  };
}

function syncOcrFromState() {
  const cfg = resolveAmmoOcrConfig(currentState.ammo);
  ocr.setConfig(cfg);

  const shouldRun =
    currentState.ammo.enabled && currentState.ammo.override == null;

  if (shouldRun && !ocr.running) ocr.start();
  if (!shouldRun && ocr.running) ocr.stop();
}

function setupOcr() {
  ocr.on('value', ({ value, confidence, processedImage }) => {
    if (currentState.ammo.override != null) return;
    currentState.ammo.current = value;
    sendToOverlay('crosshair-update', { ammo: currentState.ammo });
    if (settingsWin && !settingsWin.isDestroyed()) {
      settingsWin.webContents.send('ammo-value', {
        value,
        confidence,
        processedImage,
        error: null,
      });
    }
  });

  ocr.on('no-value', ({ raw, error }) => {
    if (settingsWin && !settingsWin.isDestroyed()) {
      settingsWin.webContents.send('ammo-value', {
        value: null,
        confidence: 0,
        raw: raw || [],
        error: error || null,
        processedImage: ocr.lastProcessedImage,
      });
    }
  });

  ocr.on('error', (err) => {
    if (settingsWin && !settingsWin.isDestroyed()) {
      settingsWin.webContents.send('ammo-value', {
        value: null,
        confidence: 0,
        raw: [],
        error: String(err && err.message ? err.message : err),
      });
    }
  });
}

// ---------- Windows ----------
function createOverlay() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  overlay = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  overlay.setIgnoreMouseEvents(true, { forward: true });
  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlay.loadFile('index.html');

  overlay.webContents.on('did-finish-load', () => {
    sendToOverlay('crosshair-update', {
      ...currentState,
      sensitivity: currentState.reactive.sensitivity,
    });
  });
}

function createSettings() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.show();
    settingsWin.focus();
    return;
  }

  settingsWin = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    resizable: true,
    frame: false,
    titleBarStyle: 'hidden',
    title: 'Reticle — Settings',
    backgroundColor: currentTheme === 'light' ? '#eef1f6' : '#05070b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  settingsWin.loadFile('settings.html');

  settingsWin.webContents.on('did-finish-load', () => {
    settingsWin.webContents.send('theme-changed', currentTheme);
    settingsWin.webContents.send('state-changed', currentState);
    settingsWin.webContents.send('preset-list', { list: presetList, active: activePreset });
    settingsWin.webContents.send('hotkeys-changed', hotkeys);
  });

  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}

// ---------- Input ----------
function setupInput() {
  input.setReactive(currentState.reactive);

  input.on('spread-change', (v) => {
    sendToOverlay('crosshair-update', { targetSpread: v });
  });

  input.start();
}

// ---------- App lifecycle ----------
app.whenReady().then(() => {
  loadConfig();
  loadHotkeysFromConfig();
  refreshPresetList();

  input.setReactive(currentState.reactive);

  createOverlay();
  createSettings();
  setupInput();
  setupOcr();
  syncOcrFromState();

  createTray({
    onToggleCrosshair: () => {
      currentState.visible = !currentState.visible;
      sendToOverlay('crosshair-update', currentState);
      broadcastSettingsUpdate();
    },
    onOpenSettings: createSettings,
    onNextPreset: () => cyclePreset(1),
    onQuit: () => app.quit(),
  });

  registerHotkeys();

  // ---------- IPC: state updates from settings ----------
  ipcMain.on('crosshair-update', (_e, patch) => {
    currentState = { ...currentState, ...patch };
    sendToOverlay('crosshair-update', currentState);
    if (patch && patch.ammo) syncOcrFromState();
  });

  // ---------- IPC: presets ----------
  ipcMain.handle('preset-list', () => {
    refreshPresetList();
    return { list: presetList, active: activePreset, theme: currentTheme };
  });

  ipcMain.handle('preset-save', (_e, { name, state }) => {
    const saved = presets.savePreset(name, state);
    refreshPresetList();
    activePreset = saved;
    broadcastSettingsUpdate();
    return { list: presetList, active: activePreset };
  });

  ipcMain.handle('preset-load', (_e, name) => {
    loadPreset(name);
    return { list: presetList, active: activePreset };
  });

  ipcMain.handle('preset-delete', (_e, name) => {
    presets.deletePreset(name);
    if (activePreset === name) activePreset = null;
    refreshPresetList();
    broadcastSettingsUpdate();
    return { list: presetList, active: activePreset };
  });

  ipcMain.handle('preset-export', async (_e, name) => {
    const all = presets.listPresets();
    const found = all.find((p) => p.name === name);
    if (!found) return false;

    const result = await dialog.showSaveDialog(settingsWin, {
      title: 'Export preset',
      defaultPath: `${name}.reticle.json`,
      filters: [{ name: 'Reticle Preset', extensions: ['json'] }],
    });
    if (result.canceled || !result.filePath) return false;

    const { name: _n, ...data } = found;
    try {
      presets.writePresetFile(result.filePath, data);
      return true;
    } catch (err) {
      console.error('Export failed:', err);
      return false;
    }
  });

  ipcMain.handle('preset-import', async () => {
    const result = await dialog.showOpenDialog(settingsWin, {
      title: 'Import preset',
      properties: ['openFile'],
      filters: [{ name: 'Reticle Preset', extensions: ['json'] }],
    });
    if (result.canceled || result.filePaths.length === 0) return null;

    try {
      const data = presets.readPresetFile(result.filePaths[0]);
      const name = path
        .basename(result.filePaths[0], '.json')
        .replace(/\.reticle$/, '');
      presets.savePreset(name, data);
      refreshPresetList();
      broadcastSettingsUpdate();
      return { list: presetList, active: activePreset };
    } catch (err) {
      console.error('Import failed:', err);
      return null;
    }
  });

  // ---------- IPC: theme ----------
  ipcMain.handle('set-theme', (_e, theme) => {
    currentTheme = theme;
    saveConfig({ theme });
    if (settingsWin && !settingsWin.isDestroyed()) {
      settingsWin.webContents.send('theme-changed', theme);
    }
    return true;
  });

  // ---------- IPC: hotkeys ----------
  ipcMain.handle('hotkeys-get', () => hotkeys);
  ipcMain.handle('hotkeys-set', (_e, newHotkeys) => {
    updateHotkeys(newHotkeys);
    return hotkeys;
  });

  // ---------- IPC: window controls ----------
  ipcMain.on('window-minimize', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win) win.minimize();
  });
  ipcMain.on('window-close', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win) win.close();
  });

  // ---------- IPC: reactive ----------
  ipcMain.handle('reactive-get', () => currentState.reactive);

  ipcMain.handle('reactive-set', (_e, patch) => {
    currentState.reactive = { ...currentState.reactive, ...(patch || {}) };
    currentState.sensitivity = currentState.reactive.sensitivity;
    input.setReactive(currentState.reactive);
    sendToOverlay('crosshair-update', {
      sensitivity: currentState.reactive.sensitivity,
    });
    broadcastSettingsUpdate();
    return currentState.reactive;
  });

  ipcMain.handle('reactive-copy', (_e, { target, all }) => {
    const config = { ...currentState.reactive };

    if (all) {
      const allPresets = presets.listPresets();
      let count = 0;
      for (const p of allPresets) {
        if (p.name === activePreset) continue;
        const full = presets.listPresets().find((x) => x.name === p.name);
        if (!full) continue;
        const { name: _n, ...data } = full;
        presets.savePreset(p.name, { ...data, reactive: config });
        count++;
      }
      refreshPresetList();
      return { count };
    }

    if (!target) return { count: 0 };
    const full = presets.listPresets().find((x) => x.name === target);
    if (!full) return { count: 0 };
    const { name: _n, ...data } = full;
    presets.savePreset(target, { ...data, reactive: config });
    refreshPresetList();
    return { count: 1 };
  });

  // ---------- IPC: ammo ----------
  ipcMain.handle('ammo-presets-get', () => GAME_PRESETS);

  ipcMain.handle('ammo-config-get', () => ({
    ammo: currentState.ammo,
    custom: customAmmoConfig,
    ocrState: ocr.getState(),
  }));

  ipcMain.handle('ammo-config-set', (_e, patch) => {
    if (!patch) return currentState.ammo;

    if (patch.game === 'custom' && patch.custom) {
      customAmmoConfig = { ...patch.custom };
      saveConfig({ customAmmo: customAmmoConfig });
    }

    const ammoPatch = { ...patch };
    delete ammoPatch.custom;
    Object.assign(currentState.ammo, ammoPatch);

    syncOcrFromState();
    sendToOverlay('crosshair-update', { ammo: currentState.ammo });
    broadcastSettingsUpdate();
    return currentState.ammo;
  });

  ipcMain.handle('ammo-override-set', (_e, value) => {
    currentState.ammo.override =
      value === null || value === undefined ? null : Number(value);
    if (currentState.ammo.override != null) {
      currentState.ammo.current = currentState.ammo.override;
    }
    syncOcrFromState();
    sendToOverlay('crosshair-update', { ammo: currentState.ammo });
    broadcastSettingsUpdate();
    return currentState.ammo;
  });

  ipcMain.handle('ammo-test-scan', async () => {
    return await ocr.scanOnce();
  });

  ipcMain.handle('ammo-state-get', () => ocr.getState());
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  input.stop();
  ocr.destroy();
  destroyTray();
});

app.on('window-all-closed', (e) => {
  if (e && e.preventDefault) e.preventDefault();
});