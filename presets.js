const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const PRESETS_DIR = path.join(app.getPath('userData'), 'presets');

function ensureDir() {
  if (!fs.existsSync(PRESETS_DIR)) fs.mkdirSync(PRESETS_DIR, { recursive: true });
}

function listPresets() {
  ensureDir();
  return fs.readdirSync(PRESETS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const name = path.basename(f, '.json');
      try {
        const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, f), 'utf8'));
        return { name, ...data };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function savePreset(name, state) {
  ensureDir();
  const safe = name.replace(/[^a-zA-Z0-9 _-]/g, '').trim();
  if (!safe) throw new Error('Invalid preset name');
  const file = path.join(PRESETS_DIR, `${safe}.json`);
  fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf8');
  return safe;
}

function deletePreset(name) {
  ensureDir();
  const file = path.join(PRESETS_DIR, `${name}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

function readPresetFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writePresetFile(filePath, state) {
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
}

module.exports = {
  listPresets,
  savePreset,
  deletePreset,
  readPresetFile,
  writePresetFile,
  PRESETS_DIR,
};