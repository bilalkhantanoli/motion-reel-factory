---
name: reels
description: Autonomous 1080x1920 vertical reel generator for Google Antigravity (AGY). Produces complete Remotion scenes with custom 2D SVG character, word-synced popups, safe zones, and karaoke captions.
---

# Antigravity Reel Factory Skill

Use this skill whenever the user says "make a reel about [topic]", "create a new reel", "render this scene", or asks to customize character, brand, captions, or timings.

## 1. Architecture Overview

- **Format**: 1080x1920 vertical video, 30 FPS (`src/layout.ts`).
- **Brand System**: Single source of truth in `src/brand.ts`. Never hardcode colors or fonts in components.
- **Presenter Character**: `src/components/Character.tsx` drawn in pure vector SVG (no raster images). Supports `expression` (`happy`, `thinking`, `surprised`, `wink`, `excited`), mouth `open` (0 to 1, driven by loudness), blinking, and idle bob.
- **Timing**: Timed to spoken words via `src/timing.ts` using `atWord(n)` and `atText("keyword")`. Fallback seconds ensure rendering even before audio is recorded.
- **Captions**: Word-by-word `<CaptionStrip>` or styled `<Karaoke>` bubble (`src/components/Karaoke.tsx`).
- **Instagram Safe Zones**: Kept strictly inside `SAFE_BOX` (`src/layout.ts`):
  - Top margin: ~220px (Instagram header / audio tag).
  - Bottom margin: ~380px (caption, username, comment box).
  - Right margin: ~120px (heart, comment, share, save buttons).

## 2. Standard Workflow for Making a Reel

When the user asks to create a reel about a topic:

### Step 1: Write Spoken Script & Captions
- Write an engaging, high-retention Hinglish or English script (30 to 50 seconds, under 60s).
- Hook in the first 2 seconds (e.g. bold question, contrasting statement, or big number).
- Save spoken text to `script.txt` and screen caption words to `captions.txt`.

### Step 2: Audio & Timings
- If user provides voice audio in `public/vo.wav`:
  1. Generate word timestamps:
     ```bash
     python3 scripts/words.py public/vo.wav --lang auto --out public/words.json
     ```
  2. Align exact script words with Whisper timing:
     ```bash
     python3 scripts/align.py --words public/words.json --captions captions.txt --audio public/vo.wav --out public/captions.words.json
     ```
  3. Calculate per-frame mouth loudness:
     ```bash
     python3 scripts/audio_loudness.py public/vo.wav -o public/loudness.json
     ```
- If no audio file is provided yet, use fallback timings from `public/demo.words.json`.

### Step 3: Compose the Scene (`src/Scene.tsx` or new scene in `src/`)
- Assemble reusable components inside `SAFE_BOX`:
  - `<Title text="..." highlight="..." at={atWord(0)} />`
  - `<Card at={...}><BigNumber to={...} /> ...</Card>`
  - `<Sticker text="..." at={...} />`
  - `<CharacterSlot at={...} size={250} open={mouthAtFrame(frame)} expression="..." />`
  - `<CaptionStrip perLine={3} />` or `<Karaoke words={captions} ... />`
- Ensure something new pops or animates every 2-3 seconds.

### Step 4: Verify Layout & Safe Zones
Run test stills:
```bash
npx remotion still Scene out/still.png --frame=90
npx remotion still Scene out/zones.png --frame=90 --props='{"debugSafeZones":true}'
```
Check that:
1. No text or icons touch the red Instagram UI overlays.
2. Character does not overlap titles or captions.
3. Colors maintain high contrast against the background.

### Step 5: Render Final MP4
```bash
npm run render
```
The output will be saved to `out/scene.mp4`.
