const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Overlay listeners
  onCrosshairUpdate: (cb) => ipcRenderer.on('crosshair-update', (_, s) => cb(s)),
  onToggle: (cb) => ipcRenderer.on('toggle-crosshair', () => cb()),

  // Settings outbound
  sendUpdate: (patch) => ipcRenderer.send('crosshair-update', patch),

  // Reactive
  getReactive: () => ipcRenderer.invoke('reactive-get'),
  setReactive: (patch) => ipcRenderer.invoke('reactive-set', patch),
  copyReactive: (opts) => ipcRenderer.invoke('reactive-copy', opts),

  // Settings inbound
  onStateChanged: (cb) => ipcRenderer.on('state-changed', (_, s) => cb(s)),
  onPresetList: (cb) => ipcRenderer.on('preset-list', (_, p) => cb(p)),
  onThemeChanged: (cb) => ipcRenderer.on('theme-changed', (_, t) => cb(t)),
  onHotkeysChanged: (cb) => ipcRenderer.on('hotkeys-changed', (_, h) => cb(h)),
  onAmmoValue: (cb) => ipcRenderer.on('ammo-value', (_, v) => cb(v)),

  // Presets
  listPresets: () => ipcRenderer.invoke('preset-list'),
  savePreset: (name, state) => ipcRenderer.invoke('preset-save', { name, state }),
  loadPreset: (name) => ipcRenderer.invoke('preset-load', name),
  deletePreset: (name) => ipcRenderer.invoke('preset-delete', name),

  // Import / Export
  exportPreset: (name) => ipcRenderer.invoke('preset-export', name),
  importPreset: () => ipcRenderer.invoke('preset-import'),

  // Theme
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),

  // Hotkeys
  getHotkeys: () => ipcRenderer.invoke('hotkeys-get'),
  setHotkeys: (hk) => ipcRenderer.invoke('hotkeys-set', hk),

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // Ammo
  getAmmoPresets: () => ipcRenderer.invoke('ammo-presets-get'),
  getAmmoConfig: () => ipcRenderer.invoke('ammo-config-get'),
  setAmmoConfig: (patch) => ipcRenderer.invoke('ammo-config-set', patch),
  setAmmoOverride: (value) => ipcRenderer.invoke('ammo-override-set', value),
  testAmmoScan: () => ipcRenderer.invoke('ammo-test-scan'),
  getAmmoState: () => ipcRenderer.invoke('ammo-state-get'),
});