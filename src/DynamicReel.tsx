import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand as defaultBrand, type Brand } from "./brand";
import { BrandProvider, useBrand } from "./brand-context";
import { BigNumber, Card, SafeZones, Sticker, Title, Karaoke, Character, type CharacterExpression } from "./components";
import { SAFE, SAFE_BOX } from "./layout";
import reelData from "../public/reel-data.json";
import wordsData from "../public/words.json";
import loudnessData from "../public/loudness.json";

export type BigNumberItem = {
  num: number;
  heading: string;
  text: string;
  atSec?: number;
};

export type Phase = {
  id: string;
  startSec: number;
  endSec: number;
  characterExpression?: CharacterExpression;
  title: string;
  highlight?: string;
  cardHeading?: string;
  cardText?: string;
  subCardHeading?: string;
  subCardText?: string;
  subCardAtSec?: number;
  bigNumbers?: BigNumberItem[];
  sticker?: string;
  stickerRotate?: number;
  isOutro?: boolean;
};

export type ReelData = {
  topic: string;
  audioFile?: string;
  totalDurationSec: number;
  totalFrames: number;
  keywords?: string[];
  phases: Phase[];
};

export type DynamicReelProps = {
  brand?: Brand;
  data?: ReelData;
  debugSafeZones?: boolean;
};

export const DynamicReel: React.FC<DynamicReelProps> = ({
  brand = defaultBrand,
  data = reelData as ReelData,
  debugSafeZones = false,
}) => (
  <BrandProvider brand={brand}>
    <DynamicReelContent data={data} debugSafeZones={debugSafeZones} />
  </BrandProvider>
);

const DynamicReelContent: React.FC<{ data: ReelData; debugSafeZones: boolean }> = ({ data, debugSafeZones }) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Mouth openness driven by real per-frame loudness (0 to 1)
  const loudness = loudnessData as number[];
  const mouthOpen = loudness[frame] ?? 0;

  // Find active phase from data
  const activePhase =
    data.phases.find((p) => t >= p.startSec && t < p.endSec) ||
    data.phases[data.phases.length - 1];

  const characterExpression: CharacterExpression = activePhase?.characterExpression || "thinking";
  const phaseStartFrame = Math.round((activePhase?.startSec ?? 0) * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: b.colors.bg }}>
      {/* Real Audio Track */}
      {data.audioFile && <Audio src={staticFile(data.audioFile)} />}

      {/* Top Brand Pill Header */}
      <div
        style={{
          position: "absolute",
          left: SAFE_BOX.x,
          top: SAFE.top + 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 24px",
          borderRadius: 999,
          backgroundColor: `${b.colors.surface}EE`,
          border: `1.5px solid ${b.colors.accent}44`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: b.colors.accent2,
            boxShadow: `0 0 10px ${b.colors.accent2}`,
          }}
        />
        <span
          style={{
            color: b.colors.accent,
            fontSize: 26,
            fontWeight: 800,
            fontFamily: b.fontFamily,
            letterSpacing: 1,
            textTransform: "lowercase",
          }}
        >
          {b.handle}
        </span>
      </div>

      {/* Title */}
      {activePhase && (
        <div
          key={`title-${activePhase.id}`}
          style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 70, width: SAFE_BOX.width }}
        >
          <Title
            text={activePhase.title}
            highlight={activePhase.highlight}
            at={phaseStartFrame + 3}
          />
        </div>
      )}

      {/* Main Content Card / Big Numbers / Outro */}
      {activePhase && (
        <div
          key={`card-${activePhase.id}`}
          style={{ position: "absolute", left: SAFE_BOX.x, top: 560, width: SAFE_BOX.width }}
        >
          <Card at={phaseStartFrame + 6}>
            {/* 1. Big Numbers Layout */}
            {activePhase.bigNumbers && activePhase.bigNumbers.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {activePhase.bigNumbers.map((bn, idx) => {
                  const bnAtSec = bn.atSec ?? activePhase.startSec + idx * 4.0;
                  if (t < bnAtSec) return null;
                  return (
                    <BigNumber
                      key={bn.num}
                      to={bn.num}
                      at={Math.round(bnAtSec * fps)}
                      label={
                        <>
                          <strong style={{ fontSize: 38, color: idx === 0 ? b.colors.accent : b.colors.accent2 }}>
                            {bn.heading}
                          </strong>
                          <br />
                          {bn.text}
                        </>
                      }
                    />
                  );
                })}
              </div>
            )}

            {/* 2. Text / Step Card Layout */}
            {activePhase.cardHeading && !activePhase.isOutro && (
              <>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: b.colors.accent, textTransform: "uppercase" }}>
                    {activePhase.cardHeading}
                  </div>
                  {activePhase.cardText && (
                    <div style={{ fontSize: 35, color: b.colors.text, marginTop: 10, lineHeight: 1.35, fontWeight: 600 }}>
                      {activePhase.cardText}
                    </div>
                  )}
                </div>

                {activePhase.subCardHeading && t >= (activePhase.subCardAtSec ?? activePhase.startSec + 3) && (
                  <div style={{ borderTop: `2px solid ${b.colors.text}18`, paddingTop: 24, marginTop: 24 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: b.colors.accent2, textTransform: "uppercase" }}>
                      {activePhase.subCardHeading}
                    </div>
                    {activePhase.subCardText && (
                      <div style={{ fontSize: 35, color: b.colors.text, marginTop: 8, lineHeight: 1.35, fontWeight: 600 }}>
                        {activePhase.subCardText}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 3. Outro CTA Card Layout */}
            {activePhase.isOutro && (
              <div>
                <div style={{ fontSize: 44, fontWeight: 800, color: b.colors.accent, marginBottom: 14 }}>
                  {activePhase.cardHeading || "Keep Learning!"}
                </div>
                <div style={{ fontSize: 34, color: b.colors.text, lineHeight: 1.35, fontWeight: 600 }}>
                  {activePhase.cardText}
                </div>
                <div
                  style={{
                    marginTop: 26,
                    padding: "20px 24px",
                    backgroundColor: `${b.colors.accent}20`,
                    border: `2px solid ${b.colors.accent}`,
                    borderRadius: b.radius / 1.5,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 24, color: b.colors.text, opacity: 0.85, fontWeight: 600 }}>
                    Follow for more daily tech breakdowns
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: b.colors.accent, marginTop: 4 }}>
                    {b.handle}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Floating Sticker */}
      {activePhase?.sticker && (
        <Sticker
          key={`sticker-${activePhase.id}`}
          text={activePhase.sticker}
          at={phaseStartFrame + 12}
          rotate={activePhase.stickerRotate ?? 5}
          style={{ position: "absolute", left: 560, top: 515 }}
        />
      )}

      {/* Presenter Character */}
      <div style={{ position: "absolute", left: SAFE_BOX.x + 30, top: 1090 }}>
        <Character
          size={b.character.size ?? 290}
          expression={characterExpression}
          open={mouthOpen}
          primaryColor={b.character.primaryColor ?? b.colors.accent}
          faceColor={b.character.faceColor ?? b.colors.bg}
          antennaColor={b.character.antennaColor ?? b.colors.accent2}
        />
      </div>

      {/* Karaoke Captions */}
      <div
        style={{
          position: "absolute",
          left: SAFE_BOX.x,
          width: SAFE_BOX.width,
          bottom: SAFE.bottom + 20,
        }}
      >
        <Karaoke
          words={wordsData}
          perChunk={4}
          keywords={data.keywords || []}
          spokenColor={b.colors.text}
          upcomingColor={`${b.colors.text}44`}
          keywordColor={b.colors.accent2}
          background={b.colors.surface}
          fontFamily={b.fontFamily}
          fontSize={44}
          style={{ width: "100%" }}
        />
      </div>

      {/* Safe Zones visualizer */}
      {debugSafeZones ? <SafeZones /> : null}
    </AbsoluteFill>
  );
};
