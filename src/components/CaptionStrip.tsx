import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../brand-context";
import { WORDS, type Word } from "../timing";

type Props = {
  words?: Word[];
  /** Words shown at once. */
  perLine?: number;
  size?: number;
};

/** Shows the words in small groups and highlights the one being spoken right now. */
export const CaptionStrip: React.FC<Props> = ({ words = WORDS, perLine = 4, size = 58 }) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!words.length) return null;

  // Current word = last word that has started.
  let current = -1;
  words.forEach((w, i) => {
    if (w.start <= t) current = i;
  });
  if (current < 0) return null;

  const groupStart = Math.floor(current / perLine) * perLine;
  const group = words.slice(groupStart, groupStart + perLine);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 14,
          background: b.colors.surface,
          borderRadius: b.radius,
          boxShadow: b.boxShadow,
          padding: "22px 30px",
          fontFamily: b.fontFamily,
          fontSize: size,
          fontWeight: 800,
        }}
      >
        {group.map((w, i) => {
          const active = groupStart + i === current;
          return (
            <span
              key={groupStart + i}
              style={{
                padding: "2px 14px",
                borderRadius: Math.max(6, b.radius / 2),
                background: active ? b.colors.accent : "transparent",
                color: active ? b.colors.bg : b.colors.text,
                opacity: groupStart + i <= current ? 1 : 0.35,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
