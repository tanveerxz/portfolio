import { ImageResponse } from "next/og";

import { FLAGSHIP, FLAGSHIP_STORY } from "@/config/flagship";

export const runtime = "edge";
export const alt = `${FLAGSHIP.name}. ${FLAGSHIP_STORY.headline} ${FLAGSHIP_STORY.headlineTurn}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px 82px", background: "#0b0d12", color: "#edeef2" }}>
      <span style={{ fontSize: 28, color: "#c2c8fa" }}>{FLAGSHIP.name}</span>
      <span style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1 }}>
        <span>{FLAGSHIP_STORY.headline}</span>
        <span style={{ color: "#b3b7c2" }}>{FLAGSHIP_STORY.headlineTurn}</span>
      </span>
      <span style={{ fontSize: 28, color: "#b3b7c2" }}>{FLAGSHIP.engine} proves behavioural equivalence before migrated code ships.</span>
    </div>,
    size,
  );
}
