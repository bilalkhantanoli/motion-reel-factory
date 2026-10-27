import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { brand as defaultBrand, type Brand } from "./brand";
import { BrandProvider, useBrand } from "./brand-context";
import { SafeZones, Karaoke, Character, type CharacterExpression } from "./components";
import { SAFE, SAFE_BOX } from "./layout";
import wordsData from "../public/words.json";
import loudnessData from "../public/loudness.json";

export type TechlyReelProps = {
  brand?: Brand;
  debugSafeZones?: boolean;
};

export const TechlyAIReel: React.FC<TechlyReelProps> = ({ brand = defaultBrand, debugSafeZones = false }) => (
  <BrandProvider brand={brand}>
    <TechlyReelContent debugSafeZones={debugSafeZones} />
  </BrandProvider>
);

const TechlyReelContent: React.FC<{ debugSafeZones: boolean }> = ({ debugSafeZones }) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Real per-frame mouth openness driven by audio loudness
  const loudness = loudnessData as number[];
  const mouthOpen = loudness[frame] ?? 0;

  // Scene timing transitions
  // Scene 1: Hook (0.0s - 8.5s)
  // Scene 2: Data & Training (8.5s - 17.4s)
  // Scene 3: Neural Networks (17.4s - 26.8s)
  // Scene 4: Tokens & Transformer (26.8s - 35.7s)
  // Scene 5: Big Revelation (35.7s - 49.3s)
  // Scene 6: Outro & CTA (49.3s - 60.0s)

  let mascotExpression: CharacterExpression = "thinking";
  if (t >= 8.5 && t < 17.4) mascotExpression = "surprised";
  else if (t >= 17.4 && t < 26.8) mascotExpression = "happy";
  else if (t >= 26.8 && t < 35.7) mascotExpression = "excited";
  else if (t >= 35.7 && t < 49.3) mascotExpression = "thinking";
  else if (t >= 49.3) mascotExpression = "wink";

  const keywords = [
    "artificial",
    "intelligence",
    "data",
    "patterns",
    "neural",
    "networks",
    "training",
    "tokens",
    "transformer",
    "predictions",
    "math",
    "ai",
    "techly",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: b.colors.bg, overflow: "hidden" }}>
      {/* Real Audible Voiceover Audio */}
      <Audio src={staticFile("vo.mp3")} />

      {/* Cyber Ambient Radial Glows */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: 100,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${b.colors.accent}1A 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 200,
          right: -100,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${b.colors.accent2}20 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Pill */}
      <div
        style={{
          position: "absolute",
          left: SAFE_BOX.x,
          top: SAFE.top + 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 24px",
          borderRadius: 999,
          backgroundColor: "#10162BEE",
          border: `1.5px solid ${b.colors.accent}55`,
          boxShadow: `0 0 20px ${b.colors.accent}20`,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: b.colors.accent,
            boxShadow: `0 0 12px ${b.colors.accent}`,
          }}
        />
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: 800,
            fontFamily: b.fontFamily,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {b.headerTitle || "TECHLY | AI EXPLAINED"}
        </span>
      </div>

      {/* Watermark in top right */}
      <div
        style={{
          position: "absolute",
          right: 140,
          top: SAFE.top + 16,
          fontSize: 22,
          fontWeight: 700,
          color: `${b.colors.accent}88`,
          fontFamily: b.fontFamily,
          letterSpacing: 1.5,
          zIndex: 50,
        }}
      >
        @techly
      </div>

      {/* ========================================================
          SCENE 1: THE HOOK (0s - 8.5s)
          Glowing AI Brain, Synapse Pulses, Human Brain vs Chip
      ======================================================== */}
      {t < 8.5 && <Scene1Hook frame={frame} fps={fps} brand={b} />}

      {/* ========================================================
          SCENE 2: AI LEARNS FROM DATA (8.5s - 17.4s)
          Data pipelines, floating 3D Cards (Text, Images, Code), Vectors
      ======================================================== */}
      {t >= 8.5 && t < 17.4 && <Scene2DataTraining frame={frame - Math.round(8.5 * fps)} fps={fps} brand={b} />}

      {/* ========================================================
          SCENE 3: NEURAL NETWORKS (17.4s - 26.8s)
          Multi-layer neural network diagram, weights, loss curve
      ======================================================== */}
      {t >= 17.4 && t < 26.8 && <Scene3NeuralNetworks frame={frame - Math.round(17.4 * fps)} fps={fps} brand={b} />}

      {/* ========================================================
          SCENE 4: TOKENS & TRANSFORMER (26.8s - 35.7s)
          Token blocks, attention lines, probability prediction bars
      ======================================================== */}
      {t >= 26.8 && t < 35.7 && <Scene4TokensTransformers frame={frame - Math.round(26.8 * fps)} fps={fps} brand={b} />}

      {/* ========================================================
          SCENE 5: THE BIG REVELATION (35.7s - 49.3s)
          Human vs AI split-screen, Math formula, Hallucination warning
      ======================================================== */}
      {t >= 35.7 && t < 49.3 && <Scene5BigRevelation frame={frame - Math.round(35.7 * fps)} fps={fps} brand={b} />}

      {/* ========================================================
          SCENE 6: OUTRO & CTA (49.3s - 60.0s)
          Morphing Techly logo, neon rings, follow CTA card
      ======================================================== */}
      {t >= 49.3 && <Scene6OutroCTA frame={frame - Math.round(49.3 * fps)} fps={fps} brand={b} />}

      {/* ========================================================
          PRESENTER CHARACTER (MASCOT)
          Kept neatly in bottom left within SAFE_BOX
      ======================================================== */}
      {t < 49.3 && (
        <div
          style={{
            position: "absolute",
            left: SAFE_BOX.x + 20,
            bottom: SAFE.bottom + 140,
            zIndex: 40,
          }}
        >
          <Character
            size={240}
            expression={mascotExpression}
            open={mouthOpen}
            primaryColor={b.character.primaryColor || b.colors.accent}
            faceColor={b.character.faceColor || "#080B16"}
            antennaColor={b.character.antennaColor || b.colors.accent2}
          />
        </div>
      )}

      {/* ========================================================
          KARAOKE CAPTIONS
          Placed inside safe box above bottom IG overlay
      ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: SAFE_BOX.x,
          width: SAFE_BOX.width,
          bottom: SAFE.bottom + 15,
          zIndex: 60,
        }}
      >
        <Karaoke
          words={wordsData}
          perChunk={4}
          keywords={keywords}
          spokenColor="#FFFFFF"
          upcomingColor="#FFFFFF55"
          keywordColor={b.colors.accent}
          background="#10162BEE"
          fontFamily={b.fontFamily}
          fontSize={42}
          style={{ width: "100%" }}
        />
      </div>

      {/* Instagram Safe Zones Overlay (for layout verification) */}
      {debugSafeZones ? <SafeZones /> : null}
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 1: THE HOOK (0s - 8.5s)
   ========================================================================= */
const Scene1Hook: React.FC<{ frame: number; fps: number; brand: Brand }> = ({ frame, fps, brand }) => {
  const popTitle = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const pulseScale = 1 + Math.sin(frame / 6) * 0.04;

  return (
    <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 75, width: SAFE_BOX.width }}>
      {/* Kinetic Question Heading */}
      <div
        style={{
          transform: `scale(${popTitle})`,
          transformOrigin: "center top",
          marginBottom: 30,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 800, color: brand.colors.accent, letterSpacing: 2 }}>
          QUESTION OF THE DAY
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.15,
            marginTop: 8,
            textShadow: `0 0 30px ${brand.colors.accent}66`,
          }}
        >
          HOW DOES <span style={{ color: brand.colors.accent }}>AI</span> ACTUALLY WORK?
        </div>
      </div>

      {/* Glowing AI Brain & Microchip Infographic Card */}
      <div
        style={{
          backgroundColor: "#10162BDD",
          borderRadius: brand.radius,
          border: `2px solid ${brand.colors.accent}44`,
          padding: 30,
          boxShadow: `0 15px 40px rgba(0,0,0,0.5)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Animated Cyber Brain SVG */}
        <div style={{ transform: `scale(${pulseScale})`, marginBottom: 20 }}>
          <svg width="260" height="200" viewBox="0 0 260 200">
            <defs>
              <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={brand.colors.accent} />
                <stop offset="100%" stopColor={brand.colors.accent2} />
              </linearGradient>
            </defs>
            {/* Left Hemisphere (Human Biological style nodes) */}
            <path
              d="M 125 30 C 80 20 40 50 40 100 C 40 140 70 170 125 175"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            {/* Right Hemisphere (Cyber Circuit Chip style nodes) */}
            <path
              d="M 135 30 C 180 20 220 50 220 100 C 220 140 190 170 135 175"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="5"
            />
            {/* Central glowing processor */}
            <rect x="110" y="80" width="40" height="40" rx="10" fill="#00E5FF" opacity="0.2" />
            <rect x="115" y="85" width="30" height="30" rx="8" fill="#00E5FF" />
            {/* Synapse connections & nodes */}
            <circle cx="60" cy="70" r="7" fill="#8B5CF6" />
            <circle cx="50" cy="115" r="7" fill="#8B5CF6" />
            <circle cx="85" cy="145" r="7" fill="#8B5CF6" />
            <line x1="60" y1="70" x2="115" y2="100" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="115" x2="115" y2="100" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
            <line x1="85" y1="145" x2="115" y2="100" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />

            <circle cx="200" cy="70" r="7" fill="#00E5FF" />
            <circle cx="210" cy="115" r="7" fill="#00E5FF" />
            <circle cx="175" cy="145" r="7" fill="#00E5FF" />
            <line x1="200" y1="70" x2="145" y2="100" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
            <line x1="210" y1="115" x2="145" y2="100" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
            <line x1="175" y1="145" x2="145" y2="100" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        {/* Contrast Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            backgroundColor: "#080B16",
            padding: "16px 28px",
            borderRadius: 18,
            border: `1px solid #FFFFFF22`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#8B5CF6", fontWeight: 700 }}>Human Brain</div>
            <div style={{ fontSize: 18, color: "#AAAAAA" }}>Conscious thought</div>
          </div>
          <div style={{ fontSize: 30, color: "#FFFFFF", fontWeight: 900 }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#00E5FF", fontWeight: 700 }}>AI Neural Chip</div>
            <div style={{ fontSize: 18, color: "#AAAAAA" }}>Math & Patterns</div>
          </div>
        </div>

        {/* Not Exactly Punchline */}
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Is it really thinking? <span style={{ color: "#FF5252" }}>Not exactly!</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 2: AI LEARNS FROM DATA (8.5s - 17.4s)
   ========================================================================= */
const Scene2DataTraining: React.FC<{ frame: number; fps: number; brand: Brand }> = ({ frame, fps, brand }) => {
  const pop1 = spring({ frame: frame - 4, fps });
  const pop2 = spring({ frame: frame - 18, fps });
  const pop3 = spring({ frame: frame - 32, fps });

  // Floating data packet flow
  const dataOffset = (frame * 6) % 180;

  return (
    <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 75, width: SAFE_BOX.width }}>
      {/* Title */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: brand.colors.accent, letterSpacing: 2 }}>
          PHASE 1 · TRAINING
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15 }}>
          AI Learns From <span style={{ color: brand.colors.accent }}>Massive Data</span>
        </div>
      </div>

      {/* 3 Floating Data Modality Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {/* TEXT CARD */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#10162BEE",
            borderRadius: 20,
            padding: "24px 16px",
            border: `2px solid ${brand.colors.accent}`,
            textAlign: "center",
            transform: `scale(${pop1})`,
            boxShadow: `0 8px 24px ${brand.colors.accent}25`,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: brand.colors.accent }}>TEXT</div>
          <div style={{ fontSize: 18, color: "#AAAAAA", marginTop: 4 }}>Books & Web</div>
        </div>

        {/* IMAGES CARD */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#10162BEE",
            borderRadius: 20,
            padding: "24px 16px",
            border: `2px solid ${brand.colors.accent2}`,
            textAlign: "center",
            transform: `scale(${pop2})`,
            boxShadow: `0 8px 24px ${brand.colors.accent2}25`,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: brand.colors.accent2 }}>IMAGES</div>
          <div style={{ fontSize: 18, color: "#AAAAAA", marginTop: 4 }}>Vision Pixels</div>
        </div>

        {/* CODE CARD */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#10162BEE",
            borderRadius: 20,
            padding: "24px 16px",
            border: `2px solid ${brand.colors.accent3 || "#3B82F6"}`,
            textAlign: "center",
            transform: `scale(${pop3})`,
            boxShadow: `0 8px 24px #3B82F625`,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>💻</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: brand.colors.accent3 || "#3B82F6" }}>CODE</div>
          <div style={{ fontSize: 18, color: "#AAAAAA", marginTop: 4 }}>Algorithms</div>
        </div>
      </div>

      {/* Data Pipeline Pipeline Animation */}
      <div
        style={{
          backgroundColor: "#10162BDD",
          borderRadius: brand.radius,
          border: `1.5px solid #FFFFFF20`,
          padding: 26,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>Data ➔ Numerical Vectors</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: brand.colors.accent,
              backgroundColor: `${brand.colors.accent}20`,
              padding: "4px 14px",
              borderRadius: 999,
            }}
          >
            TRAINING 94%
          </span>
        </div>

        {/* Pipeline graphic SVG */}
        <svg width="100%" height="80" viewBox="0 0 800 80">
          <line x1="20" y1="40" x2="780" y2="40" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
          <line
            x1="20"
            y1="40"
            x2="780"
            y2="40"
            stroke={brand.colors.accent}
            strokeWidth="8"
            strokeDasharray="40 20"
            strokeDashoffset={-frame * 5}
            strokeLinecap="round"
          />
          {/* Moving data packets */}
          <circle cx={100 + dataOffset * 3.5} cy="40" r="14" fill="#00E5FF" filter="drop-shadow(0 0 8px #00E5FF)" />
          <circle cx={40 + dataOffset * 3.5} cy="40" r="12" fill="#8B5CF6" />
        </svg>

        <div style={{ fontSize: 26, color: "#E2E8F0", marginTop: 12, lineHeight: 1.35, fontWeight: 600 }}>
          Raw data is converted into billions of numbers to learn patterns and relationships.
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 3: NEURAL NETWORKS (17.4s - 26.8s)
   ========================================================================= */
const Scene3NeuralNetworks: React.FC<{ frame: number; fps: number; brand: Brand }> = ({ frame, fps, brand }) => {
  const pop = spring({ frame: frame - 4, fps });
  const pulse = Math.sin(frame / 5) * 4;

  return (
    <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 75, width: SAFE_BOX.width }}>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: brand.colors.accent2, letterSpacing: 2 }}>
          DEEP LEARNING ARCHITECTURE
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15 }}>
          Inside The <span style={{ color: brand.colors.accent }}>Neural Network</span>
        </div>
      </div>

      {/* Multi-layer Neural Network SVG Visualization */}
      <div
        style={{
          backgroundColor: "#10162BEE",
          borderRadius: brand.radius,
          border: `2px solid ${brand.colors.accent2}55`,
          padding: 24,
          boxShadow: `0 15px 40px rgba(0,0,0,0.6)`,
        }}
      >
        <svg width="100%" height="240" viewBox="0 0 780 240">
          {/* Layer Headers */}
          <text x="90" y="30" fill="#00E5FF" fontSize="22" fontWeight="800" textAnchor="middle">
            INPUT
          </text>
          <text x="390" y="30" fill="#8B5CF6" fontSize="22" fontWeight="800" textAnchor="middle">
            HIDDEN LAYERS
          </text>
          <text x="690" y="30" fill="#3B82F6" fontSize="22" fontWeight="800" textAnchor="middle">
            OUTPUT
          </text>

          {/* Interconnecting Synapse Lines */}
          {[60, 110, 160, 210].map((y1, i) =>
            [50, 95, 140, 185, 230].map((y2, j) => (
              <line
                key={`l1-${i}-${j}`}
                x1="90"
                y1={y1}
                x2="310"
                y2={y2}
                stroke={i === j % 4 ? "#00E5FF" : "#334155"}
                strokeWidth={i === j % 4 ? 3 : 1}
                opacity={0.7}
              />
            ))
          )}
          {[50, 95, 140, 185, 230].map((y2, j) =>
            [50, 95, 140, 185, 230].map((y3, k) => (
              <line
                key={`l2-${j}-${k}`}
                x1="310"
                y1={y2}
                x2="470"
                y2={y3}
                stroke={j === k ? "#8B5CF6" : "#334155"}
                strokeWidth={j === k ? 3.5 : 1}
                opacity={0.8}
              />
            ))
          )}
          {[50, 95, 140, 185, 230].map((y3, k) =>
            [80, 140, 200].map((y4, m) => (
              <line
                key={`l3-${k}-${m}`}
                x1="470"
                y1={y3}
                x2="690"
                y2={y4}
                stroke={k % 3 === m ? "#3B82F6" : "#334155"}
                strokeWidth={k % 3 === m ? 3 : 1}
                opacity={0.7}
              />
            ))
          )}

          {/* Input Nodes */}
          {[60, 110, 160, 210].map((y, i) => (
            <circle key={`n1-${i}`} cx="90" cy={y} r="14" fill="#00E5FF" filter="drop-shadow(0 0 8px #00E5FF)" />
          ))}

          {/* Hidden Layer 1 Nodes */}
          {[50, 95, 140, 185, 230].map((y, i) => (
            <circle key={`n2-${i}`} cx="310" cy={y} r="14" fill="#8B5CF6" filter="drop-shadow(0 0 8px #8B5CF6)" />
          ))}

          {/* Hidden Layer 2 Nodes */}
          {[50, 95, 140, 185, 230].map((y, i) => (
            <circle key={`n3-${i}`} cx="470" cy={y} r="14" fill="#8B5CF6" filter="drop-shadow(0 0 8px #8B5CF6)" />
          ))}

          {/* Output Nodes */}
          {[80, 140, 200].map((y, i) => (
            <circle key={`n4-${i}`} cx="690" cy={y} r="16" fill="#3B82F6" filter="drop-shadow(0 0 10px #3B82F6)" />
          ))}
        </svg>

        {/* Dynamic Weight Adjustment Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
            padding: "14px 20px",
            backgroundColor: "#080B16",
            borderRadius: 16,
            border: `1px solid #8B5CF644`,
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#8B5CF6" }}>WEIGHT ADJUSTMENTS</div>
            <div style={{ fontSize: 18, color: "#AAAAAA" }}>Connections tune iteratively</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#00E5FF" }}>LOSS ERROR: 0.012</div>
            <div style={{ fontSize: 18, color: "#22C55E" }}>Accuracy rising ↗</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 4: TOKENS & TRANSFORMER (26.8s - 35.7s)
   ========================================================================= */
const Scene4TokensTransformers: React.FC<{ frame: number; fps: number; brand: Brand }> = ({ frame, fps, brand }) => {
  const popChat = spring({ frame: frame - 4, fps });

  // Tokens representation
  const tokens = [
    { word: "How", id: "1284" },
    { word: "does", id: "983" },
    { word: "AI", id: "512" },
    { word: "actually", id: "2841" },
    { word: "work?", id: "740" },
  ];

  return (
    <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 75, width: SAFE_BOX.width }}>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: brand.colors.accent, letterSpacing: 2 }}>
          TRANSFORMER ARCHITECTURE
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15 }}>
          Predicting <span style={{ color: brand.colors.accent }}>One Token</span> At A Time
        </div>
      </div>

      {/* Chat Prompt Card */}
      <div
        style={{
          backgroundColor: "#10162BEE",
          borderRadius: brand.radius,
          border: `2px solid ${brand.colors.accent}44`,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 22, color: "#AAAAAA", fontWeight: 700, marginBottom: 12 }}>
          USER INPUT SPLIT INTO TOKENS:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {tokens.map((t, idx) => (
            <div
              key={t.word}
              style={{
                backgroundColor: "#080B16",
                border: `2px solid ${idx === 2 ? brand.colors.accent : "#8B5CF6"}`,
                borderRadius: 14,
                padding: "8px 18px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>{t.word}</div>
              <div style={{ fontSize: 16, color: "#8B5CF6", fontWeight: 700 }}>ID: {t.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Token Probability Distribution Bar Chart */}
      <div
        style={{
          backgroundColor: "#10162BEE",
          borderRadius: brand.radius,
          border: `1.5px solid #FFFFFF20`,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: brand.colors.accent, marginBottom: 14 }}>
          NEXT TOKEN PROBABILITY DISTRIBUTION:
        </div>

        {/* Bar 1: Highest probability */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            <span>Token: "learns"</span>
            <span style={{ color: "#00E5FF" }}>87.4% (Selected)</span>
          </div>
          <div style={{ width: "100%", height: 16, backgroundColor: "#080B16", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ width: "87.4%", height: "100%", backgroundColor: "#00E5FF", borderRadius: 8 }} />
          </div>
        </div>

        {/* Bar 2 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            <span>Token: "thinks"</span>
            <span style={{ color: "#8B5CF6" }}>8.2%</span>
          </div>
          <div style={{ width: "100%", height: 16, backgroundColor: "#080B16", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ width: "8.2%", height: "100%", backgroundColor: "#8B5CF6", borderRadius: 8 }} />
          </div>
        </div>

        {/* Bar 3 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            <span>Token: "creates"</span>
            <span style={{ color: "#3B82F6" }}>4.4%</span>
          </div>
          <div style={{ width: "100%", height: 16, backgroundColor: "#080B16", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ width: "4.4%", height: "100%", backgroundColor: "#3B82F6", borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 5: THE BIG REVELATION (35.7s - 49.3s)
   ========================================================================= */
const Scene5BigRevelation: React.FC<{ frame: number; fps: number; brand: Brand }> = ({ frame, fps, brand }) => {
  const pop = spring({ frame: frame - 4, fps });

  return (
    <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 75, width: SAFE_BOX.width }}>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#FF5252", letterSpacing: 2 }}>
          THE BIG REVELATION
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15 }}>
          It's Not Thinking. <span style={{ color: brand.colors.accent }}>It's Math.</span>
        </div>
      </div>

      {/* Formula & Calculation Box */}
      <div
        style={{
          backgroundColor: "#10162BEE",
          borderRadius: brand.radius,
          border: `2px solid ${brand.colors.accent}66`,
          padding: 26,
          boxShadow: `0 15px 40px rgba(0,0,0,0.5)`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: brand.colors.accent,
            textAlign: "center",
            padding: "16px 20px",
            backgroundColor: "#080B16",
            borderRadius: 16,
            border: `1.5px solid ${brand.colors.accent}44`,
            letterSpacing: 1,
            marginBottom: 18,
          }}
        >
          PATTERNS + MATH = AI OUTPUT
        </div>

        <div style={{ fontSize: 26, color: "#E2E8F0", lineHeight: 1.4, fontWeight: 600 }}>
          AI models do not possess consciousness or real understanding. They calculate statistical likelihoods from
          matrices and weights.
        </div>
      </div>

      {/* Warning Box: AI CAN MAKE MISTAKES */}
      <div
        style={{
          backgroundColor: "#2B1214EE",
          borderRadius: brand.radius / 1.5,
          border: "2px solid #FF5252",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span style={{ fontSize: 40 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#FF5252" }}>AI CAN BE WRONG</div>
          <div style={{ fontSize: 20, color: "#FFA4A4", fontWeight: 600 }}>
            Because it generates probabilities, hallucinations and errors happen!
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE 6: OUTRO & CTA (49.3s - 60.0s)
   ========================================================================= */
const Scene6OutroCTA: React.FC<{ frame: number; fps: number; brand: Brand }> = ({ frame, fps, brand }) => {
  const pop = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  const pulseRing = 1 + Math.sin(frame / 6) * 0.06;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE.top + 80,
        width: SAFE_BOX.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Animated Brand Emblem & Ring */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          backgroundColor: "#10162B",
          border: `3px solid ${brand.colors.accent}`,
          boxShadow: `0 0 40px ${brand.colors.accent}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pulseRing})`,
          marginBottom: 24,
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 900, color: brand.colors.accent }}>⚡</span>
      </div>

      {/* Main Brand Title */}
      <div
        style={{
          fontSize: 76,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: 4,
          textShadow: `0 0 40px ${brand.colors.accent}77`,
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        TECHLY
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: brand.colors.accent2,
          letterSpacing: 2,
          marginBottom: 36,
        }}
      >
        COMPLEX TECH. MADE SIMPLE.
      </div>

      {/* Follow CTA Card */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#10162BEE",
          borderRadius: brand.radius,
          border: `2.5px solid ${brand.colors.accent}`,
          padding: "30px 24px",
          boxShadow: `0 20px 50px rgba(0,0,0,0.6)`,
          transform: `scale(${pop})`,
        }}
      >
        <div style={{ fontSize: 28, color: "#E2E8F0", fontWeight: 700, marginBottom: 8 }}>
          Level up your tech knowledge in 60s
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: brand.colors.accent,
            backgroundColor: "#080B16",
            padding: "16px 28px",
            borderRadius: 20,
            border: `1.5px solid ${brand.colors.accent}55`,
            display: "inline-block",
            marginTop: 12,
            boxShadow: `0 0 25px ${brand.colors.accent}33`,
          }}
        >
          FOLLOW @TECHLY
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 20,
            fontSize: 24,
            color: "#AAAAAA",
            fontWeight: 600,
          }}
        >
          <span>🔔 Tap Notify</span>
          <span>•</span>
          <span>📌 Save Video</span>
          <span>•</span>
          <span>🚀 Share</span>
        </div>
      </div>
    </div>
  );
};
