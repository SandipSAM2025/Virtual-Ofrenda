# 🌼 Gran Altar de Recuerdos (Virtual Ofrenda)

> **Ghost in the Machine Challenge Entry**  
> An offline-first, privacy-respecting memorial altar celebrating Día de los Muertos and honoring digital pioneers, built entirely on open-source foundations.

---

## 📖 Overview

**Gran Altar de Recuerdos** bridges traditional Mexican folk heritage with modern open-source computing. It provides an interactive 3-tiered virtual altar (*ofrenda*) where users can record tributes, light digital votive candles, place traditional offerings, and compose commemorative eulogies.

The application operates **100% locally in the browser**. No personal memories, photos, or text ever leave the user's device, upholding the core ethos of local AI and data sovereignty.

---

## ⚡ Why Open Innovation Matters for This Project

This project addresses the prompt's core question: **Where does an open-based approach work better than a closed one?**

1. **Absolute Data Privacy for Cherished Memories:**  
   Family photos, eulogies, and deeply personal remembrances should never be fed into closed corporate cloud servers or used to train third-party commercial models. Everything is processed and stored strictly on the client machine via `localStorage` and local open-weight inference.
2. **Lights-Out / Offline Independence:**  
   The application works with the Wi-Fi completely disabled. By relying on native browser APIs (Canvas, Web Audio API, Web Workers) and local open-weight models via **Ollama**, the ofrenda never breaks when an internet connection drops or a proprietary API deprecates its endpoints.
3. **Zero Token Costs & Zero Lock-In:**  
   Memorializing loved ones should not carry a recurring API meter. Open-weight inference runs at zero cost indefinitely.
4. **Resurrecting Tech Pioneers ("Ghost in the Machine"):**  
   Open-source software stands on the shoulders of giants. The altar comes pre-seeded with tributes to legends like Dennis Ritchie and Ada Lovelace, connecting historical reverence with contemporary open-source development.

---

## ✨ Features

- **Sacred 3-Tier Altar Architecture:**
  - **Tier 1 (El Reino de las Almas):** Memorial portrait cards, lifespans, custom tags, interactive individual votive candles, and keepsake cards.
  - **Tier 2 (El Banquete y la Memoria):** Earthly sustenance shelf featuring interactive drag-and-drop / tap-to-place offerings (Pan de Muerto, Calaveras, Mezcal, Marigolds, Monarchs, and Floppy Disks).
  - **Tier 3 (Los Cuatro Elementos):** Representation of earth, water, wind (copal smoke), and fire (interactive votive candle bank).
- **Dual Physics Particle Canvas:**
  - Multi-layered 3D Cempasúchil (marigold) petal drift with dynamic oscillation.
  - Procedural swirling Copal incense smoke emitter system rising from the base tier.
- **Dynamic Altar Illumination Engine:**
  - Radial ambient backdrop lighting that intensifies and shifts warmth in real time based on how many candles on the altar are lit.
- **Asset-Free Web Audio Engine:**
  - Synthesizes a calming 108 Hz harmonic root drone with LFO vibrato, pink-noise candle flame crackles, and resonant pentatonic bell chimes directly in the browser—no external MP3/audio requests required.
- **Dual AI Verse Engine (Local LLM + Fallback):**
  - Connects to an **Ollama** instance (`llama3.2:1b`, `mistral`, `qwen2.5`) running at `localhost:11434` to generate personalized *Calaveritas Literarias*, solemn eulogies, or cyberpunk *Ghost in the Machine* tech odes.
  - Includes a zero-dependency procedural poetry fallback if Ollama is not active.
- **Client-Side Photo Compression:**
  - Downscales and compresses user-uploaded images via offscreen HTML5 Canvas prior to base64 encoding to prevent browser `localStorage` overflow.
- **Printable Keepsake & Portability:**
  - Dedicated parchment card preview with native CSS `@media print` styling for printing physical cards or exporting to PDF.
  - One-click JSON backup and restore functionality.

---

## 🗂️ Project Structure

```text
virtual-ofrenda/
├── index.html        # Main semantic markup, modal structures, and UI controls
├── style.css         # Styling, altar grid layout, animations, and print media rules
├── app.js            # Particle canvas, Web Audio synth, Ollama API client, and DOM state
└── README.md         # Project documentation and submission overview
```

---

## 🚀 Quick Start

### Option 1: Standalone Browser Use (Zero Installation)
1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/virtual-ofrenda.git
   cd virtual-ofrenda
   ```
2. Double-click `index.html` or open it in any modern browser (Chrome, Firefox, Safari, Edge).
3. The visual atmosphere, sound engine, and procedural verse generator will work immediately.

---

### Option 2: Enabling Local Open-Weight AI (Ollama)

To enable live local LLM generation for tributes and *calaveritas*:

1. **Install Ollama** (if not already installed):
   - **macOS / Linux:** `curl -fsSL https://ollama.com/install.sh | sh`
   - **Windows:** Download from [ollama.com](https://ollama.com).

2. **Pull a lightweight model:**
   ```bash
   ollama pull llama3.2:1b
   ```

3. **Start Ollama with CORS enabled for browser access:**
   - **macOS / Linux:**
     ```bash
     OLLAMA_ORIGINS="*" ollama serve
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:OLLAMA_ORIGINS="*"
     ollama serve
     ```

4. Open `index.html`. When adding a soul, click any of the AI generator buttons (*Calaverita Literaria*, *Ghost in Machine Ode*, or *Solemn Eulogy*). The web app will query `http://localhost:11434` directly on your laptop.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure & Semantics** | Vanilla HTML5 (`<canvas>`, semantic tags, file APIs) |
| **Styling & Effects** | Vanilla CSS3 (Custom properties, CSS Grid, `@keyframes`, `@media print`) |
| **Logic & State** | Vanilla ECMAScript (ES6+, `localStorage`, `FileReader`) |
| **Audio Synthesis** | Native Web Audio API (`OscillatorNode`, `BiquadFilterNode`, `AudioBuffer`) |
| **Local Inference Core** | [Ollama](https://ollama.com) running open-weight models (`llama3.2:1b`, `qwen2.5`, `mistral`) |

---

## 🔒 Privacy & Offline Guarantee

- **No Tracking:** No analytics, external trackers, or telemetry scripts.
- **No Third-Party CDNs for Critical Assets:** All fonts degrade gracefully to system serif/sans-serif fonts if opened without an internet connection.
- **No Remote Servers:** All uploaded photos and memorial records are stored in browser-scoped storage on your hard drive.

---

## 📜 License

This project is open-source and released under the [MIT License](LICENSE).
