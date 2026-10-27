// Loads brand configuration dynamically from brand.config.json.
// Edit brand.config.json at project root to re-skin the entire factory.
import brandConfig from "../brand.config.json";
import type { FontName } from "./fonts";

export type Brand = {
  colors: {
    bg: string;
    surface: string;
    text: string;
    accent: string;
    accent2: string;
    accent3?: string;
  };
  character: {
    primaryColor: string;
    faceColor: string;
    antennaColor: string;
    size: number;
  };
  font: FontName;
  radius: number;
  shadow: boolean;
  handle: string;
  name: string;
  headerTitle?: string;
};

export const brand: Brand = {
  colors: brandConfig.colors,
  character: brandConfig.character,
  font: (brandConfig.font as FontName) || "Inter",
  radius: brandConfig.radius ?? 28,
  shadow: brandConfig.shadow ?? true,
  handle: brandConfig.handle ?? "@techly",
  name: brandConfig.name ?? "Techly",
  headerTitle: brandConfig.headerTitle ?? "TECHLY | AI EXPLAINED",
};
