/** Analytic filament curves: identical topology, continuously varying shape. */
const curves = /* glsl */ `
uniform float uTime;
uniform float uBundle;
uniform float uMorph;
uniform float uThinking;
uniform float uVerification;
uniform float uWarmth;
uniform float uOpacity;
uniform float uRadius;
uniform float uDpr;
uniform float uRotation;
varying float vDepth;
varying float vLight;
varying float vSignal;
varying float vStrand;
const float TAU = 6.28318530718;
mat3 turnY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c,0.,-s, 0.,1.,0., s,0.,c);
}
mat3 turnZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c,s,0., -s,c,0., 0.,0.,1.);
}
vec3 filament(float t, float strand) {
  float seed = strand * 1.61803398875 + uBundle * 0.731;
  float angle = t * TAU;
  float layer = fract(strand * .381966 + uBundle * .19);
  // Warped inclined loops with unequal inner shells; no meridians or parallels.
  float radius = .69 + .27 * pow(layer, .38);
  float warp = .075 * sin(angle * 3. + seed * 2.) + .035 * cos(angle * 5. - seed);
  vec3 shell = vec3(cos(angle) * (radius + warp), sin(angle) * (radius - warp),
    .16 * sin(angle * 2. + seed) + .07 * cos(angle * 3. - seed));
  shell = turnY(seed * 2.39996) * turnZ(.24 * sin(seed)) * shell;
  shell = turnZ(-.34) * shell;
  float compare = smoothstep(.24,.43,uVerification) * (1. - smoothstep(.61,.81,uVerification));
  float side = mod(strand + uBundle, 2.) * 2. - 1.;
  shell.x += uThinking * compare * side * (.13 + .13 * sin(angle));
  shell.y += uThinking * compare * .075 * sin(angle * 4. + uTime * .4);
  float entering = (1. - smoothstep(.02,.3,uVerification)) * uThinking;
  vec3 traces = vec3((t * 2. - 1.) * 1.2, side * .16 + .045 * sin(angle * 2. + seed), .28 * sin(seed));
  shell = mix(shell, traces, entering * (.3 + .3 * step(.68, layer)));
  vec3 form;
  if (uBundle < .5) {
    // Pollen: five braided signature clusters with strands spanning boundaries.
    float cluster = mod(strand, 5.);
    float nodeAngle = cluster * TAU / 5.;
    vec3 center = vec3(cos(nodeAngle)*.55, sin(nodeAngle)*.53, .22*sin(cluster*2.4));
    vec3 node = center + turnY(seed) * vec3(cos(angle)*.23, sin(angle)*.23, .1*sin(angle*2.));
    float bridge = step(.74, layer);
    vec3 other = vec3(cos(nodeAngle+TAU/5.)*.55,sin(nodeAngle+TAU/5.)*.53,-center.z);
    vec3 link = mix(center,other,t) + vec3(0.,0.,sin(t*3.14159)*.22);
    form = mix(node,link,bridge);
  } else if (uBundle < 1.5) {
    // HukamConnect: shared, interlaced concentric rings.
    float ring = .30 + .62 * layer;
    form = turnZ(-.3) * turnY(.56) * vec3(cos(angle)*ring,sin(angle)*ring,.16*sin(angle*2.+seed*.12));
  } else if (uBundle < 2.5) {
    // ArgusAI: an oscillating stack of voiced slices.
    float slice = (layer * 2. - 1.);
    float envelope = sqrt(max(.04,1.-slice*slice));
    form = vec3((t*2.-1.)*.85,slice*.77 + sin(angle*2.+slice*3.+uTime*.35)*.08,
      sin(angle)*envelope*.53);
    form = turnY(-.43) * turnZ(-.18) * form;
  } else {
    // Scoofy: ordered woven curved lattice, two continuous strand directions.
    float lane = (layer*2.-1.)*.82;
    float across = (t*2.-1.)*.88;
    form = vec3(across,lane,.33*cos(across*1.8)*cos(lane*1.7));
    if (mod(strand,2.) < 1.) form.xy = form.yx;
    form = turnY(-.42) * turnZ(.24) * form;
  }
  vec3 p = mix(shell, form, uMorph);
  return turnY(uRotation * (1. - uMorph * .88)) * p;
}
void lightFilament(vec3 p, vec3 tangent, float strand, float t) {
  vec3 n = normalize(p + vec3(.0001));
  vec3 key = normalize(vec3(-.65,.9,1.2));
  float diffuse = max(0.,dot(n,key));
  float anisotropy = pow(max(0.,1.-abs(dot(normalize(tangent),key))),10.);
  float rim = pow(1.-abs(n.z),3.);
  vDepth = smoothstep(-.95,.85,p.z);
  vLight = .20 + .62*diffuse + .47*anisotropy + .24*rim;
  vSignal = pow(max(0.,cos(t*TAU*2.-uTime*.65+strand*.33)),28.);
  vStrand = fract(strand*.381966 + uBundle*.17);
}
`;

export const filamentVertexShader = /* glsl */ `
${curves}
attribute vec3 aCurve;
varying float vEdge;
void main() {
  float t = aCurve.x;
  vec3 p = filament(t,aCurve.y);
  vec3 next = filament(t+.001,aCurve.y);
  vec3 tangent = next-p;
  lightFilament(p,tangent,aCurve.y,t);
  vec4 view = modelViewMatrix * vec4(p*uRadius,1.);
  vec3 viewTangent = mat3(modelViewMatrix)*tangent;
  vec2 perpendicular = normalize(vec2(-viewTangent.y,viewTangent.x)+vec2(.00001));
  // Camera is pixel-space orthographic: width remains optical at every anchor size.
  float width = mix(.62,1.12,vStrand) * (.8 + .25*vDepth);
  view.xy += perpendicular * aCurve.z * width;
  gl_Position = projectionMatrix * view;
  vEdge = aCurve.z;
}
`;

export const filamentFragmentShader = /* glsl */ `
precision highp float;
uniform float uOpacity;
uniform float uThinking;
uniform float uVerification;
uniform float uWarmth;
varying float vEdge;
varying float vDepth;
varying float vLight;
varying float vSignal;
varying float vStrand;
void main() {
  float edge = 1.-smoothstep(.18,1.,abs(vEdge));
  vec3 silver = mix(vec3(.43,.48,.64),vec3(.91,.94,1.),clamp(vLight,0.,1.));
  silver += vec3(.13,.12,.23) * pow(1.-vDepth,2.);
  float discrepancy = smoothstep(.29,.42,uVerification)*(1.-smoothstep(.55,.69,uVerification));
  silver = mix(silver,vec3(.90,.77,.61),uThinking*discrepancy*step(.88,vStrand)*.75);
  silver = mix(silver,vec3(.77,.71,.65),uWarmth*.3);
  float alpha = edge * mix(.09,.73,vDepth) * (.62+.38*vLight);
  alpha *= uOpacity * (.88 + .12*vSignal);
  gl_FragColor = vec4(silver,alpha);
}
`;

export const pointVertexShader = /* glsl */ `
${curves}
attribute vec3 aCurve;
void main() {
  vec3 p = filament(aCurve.x,aCurve.y);
  lightFilament(p,filament(aCurve.x+.001,aCurve.y)-p,aCurve.y,aCurve.x);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p*uRadius,1.);
  gl_PointSize = (1.1+1.7*pow(vStrand,5.)+.55*vSignal)*uDpr;
}
`;

export const pointFragmentShader = /* glsl */ `
precision highp float;
uniform float uOpacity;
varying float vDepth;
varying float vLight;
varying float vSignal;
varying float vStrand;
void main() {
  float d = length(gl_PointCoord-.5)*2.;
  if(d>1.) discard;
  float alpha = pow(1.-d,1.6)*mix(.16,.9,vDepth)*uOpacity;
  vec3 silver = mix(vec3(.65,.69,.88),vec3(.96,.98,1.),min(1.,vLight));
  gl_FragColor = vec4(silver,alpha*(.75+.25*vSignal));
}
`;
