# 🎬 Motion Reel Factory (1080x1920)

Autonomous, data-driven vertical reel factory powered by **Google Antigravity (`agy`)** and **Remotion 4**.

Give any topic in one prompt and it automatically creates:
- Natural fluent voiceover audio
- Word-level timestamps & per-frame loudness
- Pure vector SVG 2D presenter character (mouth synced to voice)
- Visual cards, big numbers, and tilted badges popping every 2-3s
- Dynamic Karaoke-style captions
- Full Instagram safe zones compliance

---

## ⚙️ 1. Brand Configuration (`brand.config.json`)

All branding is centralized in [`brand.config.json`](./brand.config.json) at the project root. Nothing is hardcoded in TypeScript.

```json
{
  "handle": "@bilalaziztanoli",
  "name": "Bilal Aziz Tanoli",
  "font": "Inter",
  "radius": 32,
  "shadow": true,
  "colors": {
    "bg": "#0D1117",
    "surface": "#161B22",
    "text": "#F0F6FC",
    "accent": "#58A6FF",
    "accent2": "#39D353"
  },
  "character": {
    "primaryColor": "#58A6FF",
    "faceColor": "#0D1117",
    "antennaColor": "#39D353",
    "size": 290
  }
}
```

---

## 🚀 2. Create a Reel for Any Topic

To create a new reel on any topic, run:

```bash
python3 scripts/create_reel.py --topic "Your Topic Name Here"
```

Then render:
```bash
# Preview still frame with safe zones:
npm run still:zones

# Render final MP4 video:
npm run render
```
The output will be rendered to `out/reel.mp4`.

---

## 📁 Clean Architecture

```
reel/
├── brand.config.json          <- Single source of truth for brand identity & character styling
├── public/
│   ├── reel-data.json         <- Dynamic storyboard spec of the active reel
│   ├── vo.mp3                 <- Generated speech audio
│   ├── words.json             <- Spoken word timestamps
│   └── loudness.json          <- Per-frame audio loudness for mouth animation
├── src/
│   ├── Root.tsx               <- Universal composition (<Composition id="Reel" />)
│   ├── DynamicReel.tsx        <- Data-driven engine rendering any reel from reel-data.json
│   ├── brand.ts               <- Loads brand.config.json
│   ├── layout.ts              <- 1080x1920 @ 30fps + Instagram safe box
│   └── components/            <- Character, Karaoke, Card, Title, BigNumber, Sticker
└── scripts/
    ├── create_reel.py         <- End-to-end automated topic -> reel generator
    ├── audio_loudness.py      <- Audio RMS energy calculator
    ├── words.py               <- Faster-whisper word extractor
    └── align.py               <- Text phonetic alignment
```
