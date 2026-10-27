// Canvas + Instagram-safe zones for a 9:16 reel.
// The numbers below are APPROXIMATE. Instagram's overlay changes with the app
// version, phone size and caption length, so keep a little extra margin.

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

export const SAFE = {
  // Top bar: "Reels" title, camera icon, progress. Keep key content below this.
  top: 220,
  // Bottom: username, caption, audio name, comment box. The biggest no-go area.
  bottom: 380,
  // Right column: like / comment / share / save / audio buttons.
  right: 120,
  // Left: nothing sits here, but a margin keeps text off the screen edge.
  left: 60,
};

// The rectangle where text, numbers and faces are safe to place.
export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  width: WIDTH - SAFE.left - SAFE.right,
  height: HEIGHT - SAFE.top - SAFE.bottom,
};
