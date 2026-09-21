import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tanveer. Building LegacyLift.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"74px 82px",background:"#0b0d12",color:"#edeef2"}}>
      <div style={{display:"flex",flexDirection:"column",gap:22,maxWidth:700}}>
        <span style={{fontSize:28,color:"#b3b7c2"}}>Tanveer</span>
        <span style={{fontSize:90,fontWeight:600,letterSpacing:"-0.045em",lineHeight:.98}}>Building<br/>LegacyLift.</span>
        <span style={{fontSize:26,color:"#b3b7c2",lineHeight:1.4}}>AI migration with behavioural verification.</span>
      </div>
      <div style={{position:"relative",width:360,height:360,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {[0,1,2,3,4,5,6,7].map(index=><div key={index} style={{position:"absolute",width:330-index*20,height:330-index*20,border:"2px solid rgba(217,221,255,.34)",borderRadius:"50%",transform:`rotate(${index*17}deg) scaleX(${.72+index*.03})`}}/>)}
      </div>
    </div>,
    size,
  );
}
