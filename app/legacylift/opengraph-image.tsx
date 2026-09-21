import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LegacyLift. Migration needs proof.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"76px 82px",background:"#0b0d12",color:"#edeef2"}}>
      <span style={{fontSize:28,color:"#c2c8fa"}}>LegacyLift</span>
      <span style={{fontSize:92,fontWeight:600,letterSpacing:"-0.045em",lineHeight:1}}>Migration<br/>needs proof.</span>
      <span style={{fontSize:28,color:"#b3b7c2"}}>Fidelity Replay verifies behavioural equivalence before migrated code ships.</span>
    </div>,
    size,
  );
}
