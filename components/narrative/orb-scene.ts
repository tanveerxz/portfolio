import * as THREE from "three";
import {
  filamentFragmentShader,
  filamentVertexShader,
  pointFragmentShader,
  pointVertexShader,
} from "./orb-shaders";

type Uniforms = {
  uTime: { value: number }; uBundle: { value: number }; uMorph: { value: number };
  uThinking: { value: number }; uVerification: { value: number }; uWarmth: { value: number };
  uOpacity: { value: number }; uRadius: { value: number }; uDpr: { value: number };
  uRotation: { value: number };
};

function uniforms(bundle: number, dpr: number): Uniforms {
  return {
    uTime:{value:0},uBundle:{value:bundle},uMorph:{value:0},uThinking:{value:0},
    uVerification:{value:0},uWarmth:{value:0},uOpacity:{value:0},uRadius:{value:1},
    uDpr:{value:dpr},uRotation:{value:0},
  };
}

function ribbonGeometry(strands = 28, segments = 70) {
  const values:number[]=[];
  for(let strand=0;strand<strands;strand++) for(let segment=0;segment<segments;segment++) {
    const a=segment/segments,b=(segment+1)/segments;
    values.push(a,strand,-1,a,strand,1,b,strand,1,a,strand,-1,b,strand,1,b,strand,-1);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(values.length/3*3,3));
  geometry.setAttribute("aCurve",new THREE.Float32BufferAttribute(values,3));
  return geometry;
}

function pointGeometry(strands = 28, segments = 46) {
  const values:number[]=[];
  for(let strand=0;strand<strands;strand++) for(let segment=0;segment<segments;segment++) values.push(segment/(segments-1),strand,0);
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(values.length,3));
  geometry.setAttribute("aCurve",new THREE.Float32BufferAttribute(values,3));
  return geometry;
}

export class OrbVisual {
  readonly group=new THREE.Group();
  readonly uniforms:Uniforms;
  private target=new THREE.Vector3();
  private targetRadius=1;
  private targetOpacity=0;
  private disposed=false;
  constructor(bundle:number,dpr:number,ribbon:THREE.BufferGeometry,points:THREE.BufferGeometry){
    this.uniforms=uniforms(bundle,dpr);
    const ribbonMaterial=new THREE.ShaderMaterial({vertexShader:filamentVertexShader,fragmentShader:filamentFragmentShader,uniforms:this.uniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
    const pointMaterial=new THREE.ShaderMaterial({vertexShader:pointVertexShader,fragmentShader:pointFragmentShader,uniforms:this.uniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});
    const ribbonMesh=new THREE.Mesh(ribbon,ribbonMaterial);
    const pointCloud=new THREE.Points(points,pointMaterial);
    // Shader deformation moves vertices far beyond their seed positions, so the
    // CPU-side bounding sphere cannot reliably describe what is on screen.
    ribbonMesh.frustumCulled=false;
    pointCloud.frustumCulled=false;
    this.group.visible=false;
    this.group.add(ribbonMesh,pointCloud);
  }
  setTarget(rect:DOMRect|null,width:number,height:number,opacity:number){
    if(rect){this.target.set(rect.left+rect.width/2-width/2,height/2-(rect.top+rect.height/2),0);this.targetRadius=Math.max(34,Math.min(rect.width,rect.height)*.44);this.targetOpacity=opacity;}else this.targetOpacity=0;
  }
  update(time:number,delta:number,thinking:number,verification:number,warmth:number,morph:number,rotationSpeed:number){
    const ease=1-Math.exp(-Math.max(.001,delta)*7);
    this.group.position.lerp(this.target,ease);
    const u=this.uniforms;
    u.uRadius.value=THREE.MathUtils.lerp(u.uRadius.value,this.targetRadius,ease);
    u.uOpacity.value=THREE.MathUtils.lerp(u.uOpacity.value,this.targetOpacity,ease);
    this.group.visible=u.uOpacity.value>.005||this.targetOpacity>0;
    u.uThinking.value=THREE.MathUtils.lerp(u.uThinking.value,thinking,ease);
    u.uVerification.value=THREE.MathUtils.lerp(u.uVerification.value,verification,ease);
    u.uWarmth.value=THREE.MathUtils.lerp(u.uWarmth.value,warmth,ease);
    u.uMorph.value=THREE.MathUtils.lerp(u.uMorph.value,morph,ease);
    u.uRotation.value+=delta*rotationSpeed;
    u.uTime.value=time;
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.group.children.forEach(child=>{const material=(child as THREE.Mesh).material as THREE.Material;material.dispose();});}
}

export function createVisuals(scene:THREE.Scene,dpr:number){
  const ribbon=ribbonGeometry(),points=pointGeometry();
  const central=new OrbVisual(0,dpr,ribbon,points);
  const projects=[0,1,2,3].map(bundle=>new OrbVisual(bundle,dpr,ribbon,points));
  scene.add(central.group,...projects.map(v=>v.group));
  return {central,projects,dispose(){central.dispose();projects.forEach(v=>v.dispose());ribbon.dispose();points.dispose();}};
}
