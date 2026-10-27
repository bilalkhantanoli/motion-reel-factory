import React from "react";
import { Composition, Folder } from "remotion";
import { brand } from "./brand";
import { FPS, HEIGHT, WIDTH } from "./layout";
import { TechlyAIReel } from "./TechlyAIReel";
import { DynamicReel, type ReelData } from "./DynamicReel";
import { CharacterPreview, AvatarStill } from "./CharacterPreview";
import defaultReelData from "../public/reel-data.json";

export const Root: React.FC = () => {
  const data = defaultReelData as ReelData;

  return (
    <>
      {/* The Active Techly AI Reel: 60 seconds (1800 frames @ 30 FPS) */}
      <Composition
        id="Reel"
        component={TechlyAIReel}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={1800}
        defaultProps={{ brand, debugSafeZones: false }}
      />

      {/* Dynamic Reel composition */}
      <Composition
        id="DynamicReel"
        component={DynamicReel}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={data.totalFrames || 1800}
        defaultProps={{ brand, data, debugSafeZones: false }}
      />

      {/* Assets / Tools */}
      <Folder name="Assets">
        <Composition
          id="Character-Preview"
          component={CharacterPreview}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={30}
        />
        <Composition
          id="Avatar"
          component={AvatarStill}
          width={1080}
          height={1080}
          fps={FPS}
          durationInFrames={1}
        />
      </Folder>
    </>
  );
};
