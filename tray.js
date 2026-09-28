const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

function createTray({ onToggleCrosshair, onOpenSettings, onNextPreset, onQuit }) {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  let image;
  try {
    image = nativeImage.createFromPath(iconPath);
    if (image.isEmpty()) throw new Error('empty');
  } catch {
    image = nativeImage.createEmpty();
  }

  tray = new Tray(image);
  tray.setToolTip('Reticle');

  const menu = Menu.buildFromTemplate([
    { label: 'Toggle Crosshair', click: onToggleCrosshair },
    { label: 'Next Preset', click: onNextPreset },
    { type: 'separator' },
    { label: 'Settings…', click: onOpenSettings },
    { type: 'separator' },
    { label: 'Quit Reticle', click: onQuit },
  ]);

  tray.setContextMenu(menu);
  tray.on('click', onOpenSettings);

  return tray;
}

function destroyTray() {
  if (tray) { tray.destroy(); tray = null; }
}

module.exports = { createTray, destroyTray };