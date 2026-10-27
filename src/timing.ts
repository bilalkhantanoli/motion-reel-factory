// Make things appear exactly when a word is spoken.
// words.json = [{ "word": "five", "start": 0.12, "end": 0.40 }, ...] (seconds),
// the format Whisper gives you with word timestamps turned on.
import demoWords from "../public/demo.words.json";
import demoLoudness from "../public/loudness.json";
import { FPS } from "./layout";

export type Word = { word: string; start: number; end: number };

// Using your own voiceover? Put words.json in public/ and change the import above to
// "../public/words.json". Empty array = no words, everything falls back to seconds.
export const WORDS: Word[] = demoWords;
export const LOUDNESS: number[] = demoLoudness;

/** seconds -> frame */
export const sec = (s: number, fps = FPS) => Math.round(s * fps);

/**
 * Frame where word number `n` starts (0 = first word).
 * If there is no such word (no words.json yet), uses `fallbackSec` instead.
 */
export const atWord = (n: number, fallbackSec = 0, words: Word[] = WORDS, fps = FPS) => {
  const w = words[n];
  return w ? sec(w.start, fps) : sec(fallbackSec, fps);
};

/** Frame where the first word matching `text` starts, e.g. atText("tips"). */
export const atText = (text: string, fallbackSec = 0, words: Word[] = WORDS, fps = FPS) => {
  const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const i = words.findIndex((w) => clean(w.word) === clean(text));
  return i >= 0 ? atWord(i, fallbackSec, words, fps) : sec(fallbackSec, fps);
};

/** Video length: last word + a short tail, or `fallbackSec` if there are no words. */
export const durationFromWords = (tailSec = 0.8, fallbackSec = 6, words: Word[] = WORDS, fps = FPS) =>
  words.length ? sec(words[words.length - 1].end + tailSec, fps) : sec(fallbackSec, fps);

/** Mouth openness (0 to 1) for the character based on audio loudness */
export const mouthAtFrame = (frame: number, loudness: number[] = LOUDNESS): number => {
  return loudness[frame] ?? 0;
};
