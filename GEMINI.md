# Antigravity Reel Factory Guidelines

## Project Rules
- **Canvas Resolution**: 1080x1920 (9:16 vertical), 30fps.
- **Instagram Safe Zones**: Keep all titles, cards, stickers, numbers, and faces strictly within `SAFE_BOX` (`src/layout.ts`).
  - Top safe margin: 220px (Reels header)
  - Bottom safe margin: 380px (captions/audio/profile)
  - Right margin: 120px (action buttons)
- **Character**: Use `src/components/Character.tsx` drawn in pure SVG. Animate mouth openness using `mouthAtFrame(frame)` from `src/timing.ts`.
- **Styling**: Always consume colors and fonts from `src/brand.ts` via `useBrand()`. Never hardcode raw hex colors or inline font definitions inside individual components.
- **Pacing**: Introduce a new visual transition or pop-in every 2 to 3 seconds to maintain high audience retention.
- **Verification**: Always inspect rendered stills (`npx remotion still ...`) with `debugSafeZones: true` before declaring scene layout complete.
