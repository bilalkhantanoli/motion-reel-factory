---
name: reels
description: Autonomous 1080x1920 vertical reel generator for Google Antigravity (AGY). Produces complete Remotion scenes with custom 2D SVG character, word-synced popups, safe zones, and karaoke captions.
---

# Antigravity Dynamic Reel Factory Skill

Use this skill whenever the user says "make a reel about [topic]", "create a new reel", "render this scene", or asks to customize character, brand, captions, or timings.

## 1. Architecture Overview

- **Brand Configuration**: All brand identity (`handle`, `name`, `colors`, `font`, `character`) is configured in [`brand.config.json`](file:///Users/4star/Desktop/reel/brand.config.json). No brand values are hardcoded in code.
- **Dynamic Specification**: The active reel is defined entirely in [`public/reel-data.json`](file:///Users/4star/Desktop/reel/public/reel-data.json).
- **Universal Scene Engine**: [`src/DynamicReel.tsx`](file:///Users/4star/Desktop/reel/src/DynamicReel.tsx) dynamically parses the spec and renders the scene, character expressions, titles, cards, big numbers, stickers, and captions.
- **Single Root Composition**: [`src/Root.tsx`](file:///Users/4star/Desktop/reel/src/Root.tsx) exposes the universal composition `<Composition id="Reel" component={DynamicReel} />`.
- **Canvas Resolution**: 1080x1920 (9:16 vertical), 30fps (`src/layout.ts`).
- **Presenter Character**: `src/components/Character.tsx` drawn in pure vector SVG. Supports `expression`, mouth `open` (0 to 1, driven by loudness), blinking, and idle bob.
- **Instagram Safe Zones**: Kept strictly inside `SAFE_BOX` (`src/layout.ts`):
  - Top safe margin: 220px (Reels header)
  - Bottom safe margin: 380px (captions/audio/profile)
  - Right margin: 120px (action buttons)

## 2. Standard Workflow for Making Any Reel

When the user gives a prompt to create a reel on a topic:

### Step 1: Run the Generator Script or Create `public/reel-data.json`
```bash
python3 scripts/create_reel.py --topic "[Your Topic Here]"
```
This automatically:
1. Synthesizes natural, fluent English voiceover to `public/vo.mp3`.
2. Calculates exact word-level timestamps to `public/words.json`.
3. Computes per-frame RMS audio loudness to `public/loudness.json`.
4. Outputs the dynamic visual storyboard to `public/reel-data.json`.

### Step 2: Test Still Layout
```bash
npm run still:zones
```
Inspect `out/zones.png` to confirm zero overlap with Instagram UI.

### Step 3: Render Final Video
```bash
npm run render
```
The output will be rendered to `out/reel.mp4`.
