# Reticle

**A customizable, dynamic crosshair overlay for Windows, macOS, and Linux.**

Reticle sits on top of any windowed or borderless-fullscreen game, drawing a crosshair you fully control — shape, color, size, reactivity, ammo count, and more. Built with Electron, tuned for FPS players who want precise control over their aim point.

---

## ✨ Features

### 🎯 Crosshair Designer
- **16 built-in shapes** — classic cross, T-shape, brackets, chevron, diamond, heartbeat, and more
- **Pixel art editor** — draw your own crosshair on a grid with brush sizes and symmetry modes
- **Per-element colors** — separate colors for bars, the center dot, and the outline pass
- **Full control** — thickness, gap, length, outline opacity, and master outline toggle
- **Live preview** — see the crosshair rendered in real time as you edit

### 🎮 Reactive Crosshair (Dynamic)
- **Expands on fire** — grows when you left-click
- **Expands on movement** — grows when you press WASD
- **Adjustable sensitivity** — from buttery smooth to snappy snap-back
- **Combine modes** — stack fire + move, or take the larger of the two
- **Per-preset config** — different games, different feels

### 🔫 Ammo Counter (OCR-based)
- **Reads numbers off the screen** — no memory injection, no process hooks
- **Tuned for popular games** — Valorant, CS2, Overwatch 2, Warzone, Apex, Battlefield 6, TF2, Destiny 2
- **Custom tuning mode** — full control over scan region, threshold, and OCR parameters
- **Live debug view** — see exactly what the OCR sees with a processed image preview
- **Manual override** — type a value if OCR can't read your game

### 📋 Presets
- **Save, load, delete** with one click
- **Import/export** as `.reticle.json` files to share with friends
- **Quick presets** on the Home tab — click to load
- **Hotkey cycling** — `Alt+←` / `Alt+→` to swap presets mid-game
- **Copy reactive settings** from one preset to any other (or all at once)

### 🎨 Appearance & UX
- **Light and dark theme** — persisted to disk
- **Custom title bar** with theme toggle and window controls
- **Glassmorphic UI** with neon accents and smooth animations
- **Per-preset persistence** — every setting travels with its preset

### ⌨️ Hotkeys (fully customizable)
- Toggle crosshair visibility
- Open/close settings
- Cycle through presets
- Rebind any action from the Hotkeys tab

### 🖥️ Overlay System
- **Transparent, always-on-top window** across all monitors
- **Click-through** — never interferes with your game
- **Auto-detects primary display**
- **Tray icon** with quick actions and quit

---

## 📦 Installation

### Requirements
- **Node.js 18+**
- **Windows 10/11**, **macOS 12+**, or **Linux (X11)** — Wayland support is limited
- **Native build tools** for `uiohook-napi`:
  - **Windows**: Visual Studio Build Tools with "Desktop development with C++"
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `build-essential`, `libx11-dev`, `libxtst-dev`, `libxinerama-dev`

### Setup

```bash
git clone <your-repo-url>
cd reticle
npm install
npm start
```

The first launch will download the Tesseract.js WASM binary (~15 MB) for OCR. Requires an internet connection on first run.

### Packaging (later)

```bash
npm run build
```

Produces installers for the current platform via `electron-builder`.

---

## 🚀 Quick Start

1. **Launch the app** — the settings window and crosshair overlay open automatically
2. **Pick a shape** from the Shape tab, or draw one in the Pixel tab
3. **Fine-tune the look** in Appearance — color, thickness, gap, length
4. **Configure behavior** in Behavior — enable reactive, adjust fire/move spread
5. **Enable the ammo counter** in Ammo — pick your game from the dropdown
6. **Save a preset** — name it after the game you're playing
7. **Press `Alt+X`** — crosshair toggles on/off at any time

---

## 🎮 Hotkeys

| Action | Default |
|---|---|
| Toggle crosshair | `Alt+X` |
| Open/close settings | `Alt+S` |
| Next preset | `Alt+→` |
| Previous preset | `Alt+←` |

All hotkeys are rebindable from the **Hotkeys** tab. Click a shortcut box, press the new key combo, and it takes effect immediately.

---

## 🔫 Ammo Counter Setup

The ammo counter uses **OCR (optical character recognition)** to read numbers off your screen. It captures the bottom portion of your display every 500ms, processes the image, and displays the detected number next to your crosshair.

### Supported games (out of the box)

| Game | Region | Notes |
|---|---|---|
| **Valorant** | Bottom-right | Excellent accuracy |
| **CS2** | Bottom-right | Handles `N / N` format |
| **Overwatch 2** | Bottom-right | Clean single number |
| **Call of Duty / Warzone** | Bottom-right | `N / N` or single |
| **Apex Legends** | Bottom-right | Stylized font, harder |
| **Battlefield 6** | Bottom-right | Two separate numbers |
| **Team Fortress 2** | Bottom-right | Classic format |
| **Destiny 2** | Bottom-right | Multiple ammo types |

### For other games or custom setups

1. Go to the **Ammo** tab
2. Toggle **Use custom tuning**
3. Adjust:
   - **Scan region** — where on screen to look
   - **Background** — dark or light (inverts threshold)
   - **Threshold** — the most important knob; tune it live with **Test read**
   - **Min digit height** — filters out small text like timers
   - **Scan interval** — 200–2000ms, lower is faster but uses more CPU
4. Use the **Live debug** section to see the processed image and detected value
5. If OCR never reads correctly, use the **Override** field to display a static value

### Ammo counter limitations

- **Fullscreen exclusive** games may not capture — use **borderless windowed mode**
- **macOS** requires **Screen Recording** permission in System Settings
- **Linux Wayland** is unreliable — use an X11 session
- **Dynamic-positioned ammo** (Apex, some BRs) may require custom tuning per weapon
- **Stylized fonts** read less reliably than clean sans-serif

---

## 🗂️ Project Structure

```
reticle/
├── main.js                 # Electron main process
├── preload.js              # Secure IPC bridge
├── index.html              # Overlay renderer
├── index.js                # Crosshair drawing + ammo rendering
├── index.css               # Overlay styles
├── settings.html           # Settings window UI
├── settings.js             # Settings logic + all tab wiring
├── settings.css            # Settings styles (themes, layout)
├── pixel-editor.js         # Reusable pixel grid editor component
├── input.js                # Global input tracking (uiohook)
├── ocr.js                  # Screen capture + OCR pipeline
├── ocr.html                # Hidden window for Tesseract
├── ammo-presets.js         # Per-game OCR tuning presets
├── presets.js              # Preset file I/O
├── tray.js                 # System tray icon + menu
└── assets/
    └── icon.png            # Tray icon (32x32 or 256x256)
```

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Main Process (Node)                  │
│                                                       │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │  input.js  │  │  ocr.js    │  │  presets.js  │   │
│  │  (uiohook) │  │(tesseract) │  │  (file I/O)  │   │
│  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘   │
│        │               │                │           │
│        └───────┬───────┴────────┬───────┘           │
│                ▼                ▼                    │
│         ┌──────────────┐   ┌──────────┐             │
│         │  currentState│◄─►│   IPC    │             │
│         └──────────────┘   └────┬─────┘             │
└─────────────────────────────────┼───────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
      │   Overlay    │    │   Settings   │    │  OCR Window  │
      │  (index.js)  │    │(settings.js) │    │  (ocr.html)  │
      └──────────────┘    └──────────────┘    └──────────────┘
```

---

## ⚙️ How It Works

### Overlay Window
The crosshair is drawn on a **transparent, always-on-top, click-through** Chromium window that covers the primary display. Chromium is instructed to ignore mouse events via `setIgnoreMouseEvents(true, { forward: true })`, so clicks pass straight through to whatever is underneath.

### Crosshair Rendering
Each shape is a function that returns an array of drawing primitives (`line`, `circle`, `rect`). These are dispatched to a canvas 2D context every animation frame. Per-element coloring is achieved by tagging each primitive with a `role` (`bar`, `dot`, `outline`).

### Reactive Spread
A native module (`uiohook-napi`) listens to global mouse and keyboard events system-wide — even when Reticle's window isn't focused. When you left-click or press WASD, it computes a target spread value based on your reactive config, and the overlay smoothly interpolates toward that value every frame.

### Ammo OCR
1. `desktopCapturer` grabs a full-screen frame every 500ms
2. The frame is cropped to the configured region (e.g., bottom-right quadrant)
3. It's grayscaled, thresholded, and upscaled 2×
4. Tesseract.js (running in a hidden renderer) OCRs the image
5. Results are filtered by confidence, digit height, and value range
6. The most likely candidate is displayed next to the crosshair

**No memory reads. No process injection.** Just screen capture — exactly what a screenshot tool does.

---

## ⚠️ Important Notes

### Anti-cheat systems
Reticle does **not** read game memory, hook graphics APIs, or inject code into any process. It captures pixels from the screen using Electron's first-party `desktopCapturer` API, which is identical to the mechanism used by OBS, Discord, and Stream Deck.

That said, **some competitive games have blanket policies against third-party overlays**. Always check your game's Terms of Service before using any overlay tool. Reticle is not affiliated with any game or anti-cheat provider.

### Fullscreen exclusive mode
The overlay requires your game to be in **Windowed** or **Borderless Windowed** mode. Fullscreen exclusive mode prevents any overlay from appearing on top, and OCR screen capture will return black frames. This is an OS-level limitation, not a bug.

### Platform support
- **Windows**: Full support
- **macOS**: Full support, but requires **Screen Recording** permission for the ammo counter
- **Linux X11**: Full support
- **Linux Wayland**: Overlay works, OCR capture is unreliable

---

## 🛠️ Development

### Running in dev mode
```bash
npm start
```

DevTools for the settings window: `Ctrl+Shift+I` (or right-click → Inspect)

### Debugging the overlay
The overlay has `focusable: false` and click-through enabled, so you can't right-click it. To debug:
1. Temporarily comment out `overlay.setIgnoreMouseEvents(true, ...)` in `main.js`
2. Restart, right-click the overlay, inspect
3. Restore the line when done

### Config file location
All app config lives in:
- **Windows**: `%APPDATA%/Reticle/`
- **macOS**: `~/Library/Application Support/Reticle/`
- **Linux**: `~/.config/Reticle/`

Contains:
- `config.json` — theme, hotkeys, custom ammo tuning
- `presets/` — one JSON file per saved preset

---

## 🗺️ Roadmap

Planned and considered features:

- [ ] **Per-game auto-switching** — detect foreground window and swap presets automatically
- [ ] **Launch on startup** — toggle in a General tab
- [ ] **On-Screen Display widgets** — FPS counter, clock, timer, custom text
- [ ] **Crosshair offset & rotation** — move off-center or rotate
- [ ] **Preset thumbnails** — render mini crosshairs in the Quick Presets grid
- [ ] **Duplicate / rename preset** buttons
- [ ] **Shape cycle hotkeys**
- [ ] **Auto-updater** via `electron-updater`
- [ ] **Cloud preset sync** (optional)
- [ ] **Plugin system** for user scripts

---

## 🤝 Contributing

Contributions are welcome. If you're adding a feature, please:

1. Keep the code style consistent with the rest of the project
2. Test on at least one platform before submitting
3. Update the README if you're adding user-facing features

For bug reports, include:
- Your OS and version
- Steps to reproduce
- Screenshot or console output if applicable

---

## 📜 License

MIT License — see LICENSE file for details.

---

## 🙏 Credits

Built with:
- [Electron](https://electronjs.org/) — application framework
- [Tesseract.js](https://tesseract.projectnaptha.com/) — OCR engine
- [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) — global input hooks
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) & [Inter](https://fonts.google.com/specimen/Inter) — typography

Inspired by the crosshair customization community and the tools that came before — Crosshair X, Crosshair V2, and the many small overlay apps that showed what was possible.

---

**Made for people who care about their crosshair.**