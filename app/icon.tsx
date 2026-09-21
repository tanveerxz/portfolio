import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{width:64,height:64,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:16,background:"#0b0d12",color:"#c2c8fa",fontSize:30,fontWeight:700}}>T</div>,
    size,
  );
}
