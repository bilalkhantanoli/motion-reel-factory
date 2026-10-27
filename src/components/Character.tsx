import React from "react";
import { useCurrentFrame } from "remotion";
import { useBrand } from "../brand-context";

export type CharacterExpression = "happy" | "thinking" | "surprised" | "wink" | "excited";

export type CharacterProps = {
  expression?: CharacterExpression;
  /** 0 (closed) to 1 (fully open). Can be driven by audio loudness per frame */
  open?: number;
  /** Force blinking, or leave undefined for automatic natural blink every 3-4s */
  blink?: boolean;
  /** Overall size in pixels */
  size?: number;
  /** "full" body or "crop" (head-and-shoulders for avatar/DP) */
  mode?: "full" | "crop";
  /** Override main colors (defaults to robot orange/cyan/yellow theme) */
  primaryColor?: string;
  faceColor?: string;
  antennaColor?: string;
  style?: React.CSSProperties;
};

/**
 * Pure SVG 2D Presenter Character (Robot)
 * No external images or generative assets. Scales crisply at any resolution.
 * Mouth moves with voice loudness (`open` 0..1), blinks, and has idle bob.
 */
export const Character: React.FC<CharacterProps> = ({
  expression = "happy",
  open,
  blink,
  size = 320,
  mode = "full",
  primaryColor = "#FF8A3D", // Signature warm orange body
  faceColor = "#1A2230",    // Dark cyan-tinted screen
  antennaColor = "#FFD13B", // Glowing yellow tip
  style,
}) => {
  const frame = useCurrentFrame();
  const brand = useBrand();

  // Natural blink cycle: blinks for 4 frames every 100 frames (~3.3 seconds at 30fps)
  const isBlinking = blink !== undefined ? blink : frame % 105 >= 101;

  // Tiny idle bobbing and slight head tilt
  const idleBob = Math.sin(frame / 12) * 5;
  const idleTilt = Math.sin(frame / 20) * 1.5;

  // Mouth openness: if not supplied, simulate subtle speech rhythm
  const mouthOpen = open !== undefined ? Math.max(0, Math.min(1, open)) : 0.15;

  // Dimensions & ViewBox
  const viewBox = mode === "crop" ? "60 20 280 280" : "0 0 400 450";

  // Eyes rendering based on expression and blinking
  const renderEyes = () => {
    if (isBlinking) {
      return (
        <g stroke="#00F0FF" strokeWidth="6" strokeLinecap="round">
          <line x1="160" y1="170" x2="185" y2="170" />
          <line x1="215" y1="170" x2="240" y2="170" />
        </g>
      );
    }

    switch (expression) {
      case "wink":
        return (
          <g>
            {/* Left eye open */}
            <circle cx="172" cy="170" r="12" fill="#00F0FF" />
            <circle cx="176" cy="166" r="4" fill="#FFFFFF" />
            {/* Right eye winking */}
            <path d="M 215 172 Q 227 162 240 172" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        );

      case "surprised":
        return (
          <g>
            <circle cx="172" cy="168" r="16" fill="#00F0FF" />
            <circle cx="176" cy="164" r="5" fill="#FFFFFF" />
            <circle cx="228" cy="168" r="16" fill="#00F0FF" />
            <circle cx="232" cy="164" r="5" fill="#FFFFFF" />
          </g>
        );

      case "thinking":
        return (
          <g>
            {/* Eyes looking up-right */}
            <circle cx="176" cy="164" r="11" fill="#00F0FF" />
            <circle cx="179" cy="161" r="3.5" fill="#FFFFFF" />
            <circle cx="232" cy="164" r="11" fill="#00F0FF" />
            <circle cx="235" cy="161" r="3.5" fill="#FFFFFF" />
            {/* Raised eyebrow */}
            <path d="M 220 148 Q 232 142 245 149" stroke="#FFD13B" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        );

      case "excited":
        return (
          <g>
            {/* Happy arch eyes */}
            <path d="M 160 173 Q 172 155 185 173" stroke="#00F0FF" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 215 173 Q 228 155 240 173" stroke="#00F0FF" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
        );

      case "happy":
      default:
        return (
          <g>
            <circle cx="172" cy="170" r="12" fill="#00F0FF" />
            <circle cx="176" cy="166" r="4" fill="#FFFFFF" />
            <circle cx="228" cy="170" r="12" fill="#00F0FF" />
            <circle cx="232" cy="166" r="4" fill="#FFFFFF" />
            {/* Cute cheeks */}
            <circle cx="152" cy="180" r="6" fill="#FF4D7E" opacity="0.6" />
            <circle cx="248" cy="180" r="6" fill="#FF4D7E" opacity="0.6" />
          </g>
        );
    }
  };

  // Mouth rendering based on openness (0 to 1)
  const renderMouth = () => {
    const mouthY = 195;
    const mouthHeight = Math.max(4, mouthOpen * 24);
    const mouthWidth = 32 + (expression === "excited" || expression === "surprised" ? 8 : 0);

    if (mouthOpen < 0.08) {
      // Closed smile or neutral line
      return (
        <path
          d={
            expression === "thinking"
              ? "M 190 200 Q 200 198 210 202"
              : expression === "surprised"
              ? "M 194 200 A 6 6 0 1 0 206 200 A 6 6 0 1 0 194 200"
              : "M 188 196 Q 200 206 212 196"
          }
          stroke="#00F0FF"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      );
    }

    // Dynamic talking mouth
    return (
      <g>
        <path
          d={`M ${200 - mouthWidth / 2} ${mouthY} Q 200 ${mouthY + mouthHeight * 1.5} ${200 + mouthWidth / 2} ${mouthY} Z`}
          fill="#FF4D7E"
          stroke="#00F0FF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Tongue / inner mouth */}
        {mouthHeight > 10 && (
          <ellipse
            cx="200"
            cy={mouthY + mouthHeight * 0.9}
            rx={mouthWidth * 0.3}
            ry={mouthHeight * 0.4}
            fill="#FFA3B8"
          />
        )}
      </g>
    );
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${idleBob}px) rotate(${idleTilt}deg)`,
        transformOrigin: "center bottom",
        ...style,
      }}
    >
      <svg
        viewBox={viewBox}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="antennaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={antennaColor} stopOpacity="1" />
            <stop offset="60%" stopColor={antennaColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={antennaColor} stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* --- BODY (Full mode only) --- */}
        {mode === "full" && (
          <g id="body" filter="url(#shadow)">
            {/* Neck */}
            <rect x="186" y="248" width="28" height="20" rx="8" fill="#333D4F" />

            {/* Torso */}
            <rect x="145" y="260" width="110" height="95" rx="24" fill={primaryColor} />

            {/* Belly chest plate */}
            <rect x="165" y="276" width="70" height="52" rx="14" fill="#FFFFFF" opacity="0.9" />

            {/* Chest meter / status lights */}
            <circle cx="185" cy="302" r="6" fill={antennaColor} />
            <circle cx="200" cy="302" r="6" fill="#00F0FF" />
            <circle cx="215" cy="302" r="6" fill="#FF4D7E" />

            {/* Stubby Left Arm */}
            <g transform="rotate(-15 130 280)">
              <rect x="112" y="270" width="34" height="24" rx="12" fill={primaryColor} />
              <circle cx="112" cy="282" r="14" fill="#FFFFFF" />
            </g>

            {/* Stubby Right Arm */}
            <g transform="rotate(15 270 280)">
              <rect x="254" y="270" width="34" height="24" rx="12" fill={primaryColor} />
              <circle cx="288" cy="282" r="14" fill="#FFFFFF" />
            </g>

            {/* Feet / Base */}
            <ellipse cx="175" cy="365" rx="20" ry="10" fill="#333D4F" />
            <ellipse cx="225" cy="365" rx="20" ry="10" fill="#333D4F" />
          </g>
        )}

        {/* --- HEAD & ANTENNA --- */}
        <g id="head" filter="url(#shadow)">
          {/* Antenna Stem */}
          <rect x="195" y="65" width="10" height="35" rx="5" fill="#6A778B" />

          {/* Antenna Glow Ball */}
          <circle cx="200" cy="60" r="22" fill="url(#antennaGlow)" opacity={0.6 + Math.sin(frame / 8) * 0.3} />
          <circle cx="200" cy="60" r="13" fill={antennaColor} />
          <circle cx="196" cy="56" r="4" fill="#FFFFFF" />

          {/* Outer Head Shell */}
          <rect x="125" y="95" width="150" height="150" rx="36" fill={primaryColor} />

          {/* Ears / Side bolts */}
          <rect x="114" y="152" width="14" height="34" rx="6" fill="#6A778B" />
          <rect x="272" y="152" width="14" height="34" rx="6" fill="#6A778B" />

          {/* Screen Face Bezel */}
          <rect x="137" y="107" width="126" height="126" rx="28" fill={faceColor} />

          {/* Screen Glass Reflection / Sheen */}
          <path
            d="M 148 116 L 235 116 C 248 116 253 122 250 135 L 142 185 C 140 183 140 126 148 116 Z"
            fill="#FFFFFF"
            opacity="0.06"
          />

          {/* Eyes */}
          {renderEyes()}

          {/* Mouth */}
          {renderMouth()}
        </g>
      </svg>
    </div>
  );
};
