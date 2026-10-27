import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/** One entry of captions.words.json (seconds). */
export type Word = { word: string; start: number; end: number };

type Props = {
  /** Paste or import captions.words.json here. */
  words: Word[];
  /** Words per chunk. Clamped to 2-5. Default 4. */
  perChunk?: number;
  /** Words (case and punctuation ignored) to show in the highlight colour, e.g. ["whisper", "sync"]. */
  keywords?: string[];
  /** Word being spoken or already spoken. */
  spokenColor?: string;
  /** Words still to come. */
  upcomingColor?: string;
  /** The keyword highlight. */
  keywordColor?: string;
  /** Background of the bubble. "transparent" for none. */
  background?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  /** Keep the chunk on screen this long after its last word ends (seconds). */
  holdSec?: number;
  style?: React.CSSProperties;
};

const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/**
 * Karaoke captions: the spoken word is solid, upcoming words are grey, and keywords get a highlight colour.
 * Put it inside a <Sequence> or directly in your scene. Position it with `style` (it is a plain block).
 */
export const Karaoke: React.FC<Props> = ({
  words,
  perChunk = 4,
  keywords = [],
  spokenColor = "#111111",
  upcomingColor = "#9A9A9A",
  keywordColor = "#FF4D7E",
  background = "#FFFFFF",
  fontFamily = "system-ui, sans-serif",
  fontSize = 64,
  fontWeight = 800,
  holdSec = 0.35,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const size = Math.min(5, Math.max(2, Math.round(perChunk)));
  if (!words.length) return null;

  // Current word = the last one that has started.
  let current = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= t) current = i;
    else break;
  }
  if (current < 0) return null;

  const chunkStart = Math.floor(current / size) * size;
  const chunk = words.slice(chunkStart, chunkStart + size);
  const last = chunk[chunk.length - 1];
  if (t > last.end + holdSec && chunkStart + size >= words.length) return null; // after the final chunk

  const keys = new Set(keywords.map(clean));

  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.3em",
          background,
          borderRadius: 28,
          padding: "0.3em 0.6em",
          fontFamily,
          fontSize,
          fontWeight,
          lineHeight: 1.25,
        }}
      >
        {chunk.map((w, i) => {
          const idx = chunkStart + i;
          const spoken = idx <= current;
          const isKey = keys.has(clean(w.word));
          return (
            <span key={idx} style={{ color: isKey ? keywordColor : spoken ? spokenColor : upcomingColor }}>
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/*
Use it:

import captions from "../public/captions.words.json";
import { Karaoke } from "./karaoke/Karaoke";

<Karaoke words={captions} keywords={["sync"]} perChunk={4} style={{ position: "absolute", bottom: 480, left: 60, right: 140 }} />

Total video length from the words:  Math.ceil((captions[captions.length - 1].end + 0.8) * fps)
*/
