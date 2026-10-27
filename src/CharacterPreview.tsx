import React from "react";
import { AbsoluteFill } from "remotion";
import { Character, type CharacterExpression } from "./components/Character";
import { brand } from "./brand";
import { FONTS } from "./fonts";

export const CharacterPreview: React.FC = () => {
  const expressions: CharacterExpression[] = ["happy", "thinking", "surprised", "wink", "excited"];
  const fontFamily = FONTS[brand.font];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        fontFamily,
      }}
    >
      <h1 style={{ color: brand.colors.text, fontSize: 56, marginBottom: 40 }}>
        Character Expressions Preview
      </h1>

      {/* Row of expressions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 30,
          marginBottom: 60,
        }}
      >
        {expressions.map((exp) => (
          <div
            key={exp}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: brand.colors.surface,
              padding: "24px 30px",
              borderRadius: brand.radius,
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <Character
              expression={exp}
              size={220}
              blink={false}
              primaryColor={brand.character.primaryColor}
              faceColor={brand.character.faceColor}
              antennaColor={brand.character.antennaColor}
            />
            <span
              style={{
                marginTop: 16,
                fontSize: 28,
                fontWeight: 700,
                color: brand.colors.text,
                textTransform: "capitalize",
              }}
            >
              {exp}
            </span>
          </div>
        ))}
      </div>

      {/* Mouth openness strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          backgroundColor: brand.colors.surface,
          padding: "20px 40px",
          borderRadius: brand.radius,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 600, color: brand.colors.text }}>
          Mouth Loudness:
        </span>
        {[0, 0.5, 1.0].map((openVal) => (
          <div key={openVal} style={{ textAlign: "center" }}>
            <Character
              expression="happy"
              open={openVal}
              size={150}
              blink={false}
              primaryColor={brand.character.primaryColor}
              faceColor={brand.character.faceColor}
              antennaColor={brand.character.antennaColor}
            />
            <span style={{ fontSize: 20, color: brand.colors.accent, fontWeight: 600 }}>
              {Math.round(openVal * 100)}%
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const AvatarStill: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: brand.colors.surface,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Character
      size={920}
      mode="crop"
      expression="happy"
      blink={false}
      primaryColor={brand.character.primaryColor}
      faceColor={brand.character.faceColor}
      antennaColor={brand.character.antennaColor}
    />
  </AbsoluteFill>
);
