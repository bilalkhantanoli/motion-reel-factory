import React from "react";
import { useCurrentFrame } from "remotion";
import { useBrand } from "../brand-context";
import { usePop } from "./pop";
import { Character, type CharacterExpression } from "./Character";

type Props = {
  at?: number;
  size?: number;
  shape?: "circle" | "box";
  expression?: CharacterExpression;
  open?: number;
  /** Your character goes here: <Img src={staticFile("me.png")} />, an SVG component, a video... */
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/** A dedicated spot for your presenter character. Defaults to the built-in SVG character. */
export const CharacterSlot: React.FC<Props> = ({
  at = 0,
  size = 320,
  shape = "circle",
  expression = "happy",
  open,
  children,
  style,
}) => {
  const b = useBrand();
  const pop = usePop(at);

  return (
    <div style={{ ...style, ...pop.style }}>
      {children ? (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: shape === "circle" ? "50%" : b.radius,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      ) : (
        <Character size={size} expression={expression} open={open} />
      )}
    </div>
  );
};
