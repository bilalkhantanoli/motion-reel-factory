import type { Brand } from "./brand";

export const cleanLight: Brand = {
  colors: {
    bg: "#F5F5F2",
    surface: "#FFFFFF",
    text: "#14161A",
    accent: "#2B6CF6",
    accent2: "#12B886",
  },
  character: {
    primaryColor: "#FF8A3D",
    faceColor: "#1A2230",
    antennaColor: "#FFD13B",
    size: 290,
  },
  name: "Creator",
  font: "Inter",
  radius: 32,
  shadow: true,
  handle: "@yourhandle",
};

export const boldDark: Brand = {
  colors: {
    bg: "#0D0F14",
    surface: "#1B1F29",
    text: "#F4F5F7",
    accent: "#F5C518",
    accent2: "#38D6E8",
  },
  character: {
    primaryColor: "#F5C518",
    faceColor: "#0D0F14",
    antennaColor: "#38D6E8",
    size: 290,
  },
  name: "Creator",
  font: "SpaceGrotesk",
  radius: 12,
  shadow: false,
  handle: "@yourhandle",
};

export const PRESETS = { cleanLight, boldDark };
