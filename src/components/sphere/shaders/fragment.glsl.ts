import { simplexNoise3D } from '@/lib/noise'

export const fragmentShader = /* glsl */ `
${simplexNoise3D}

uniform float uTime;

varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // 4-color palette
  vec3 purple = vec3(0.545, 0.361, 0.965);  // #8b5cf6
  vec3 green = vec3(0.063, 0.725, 0.506);   // #10b981
  vec3 blue = vec3(0.231, 0.510, 0.965);    // #3b82f6
  vec3 pink = vec3(0.925, 0.286, 0.596);    // #ec4899

  // color mixing based on displacement + time
  float t = vDisplacement * 0.5 + 0.5;
  float cycle = sin(uTime * 0.2) * 0.5 + 0.5;

  vec3 color1 = mix(purple, green, t);
  vec3 color2 = mix(blue, pink, t);
  vec3 baseColor = mix(color1, color2, cycle);

  // fresnel edge glow
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
  baseColor += fresnel * vec3(0.4, 0.2, 0.6);

  // lightning lines via high-frequency noise threshold
  float lightning = snoise(vPosition * 8.0 + uTime * 2.0);
  float lines = smoothstep(0.75, 0.85, lightning);
  baseColor += lines * vec3(0.8, 0.9, 1.0) * 0.8;

  // alpha with fresnel contribution
  float alpha = 0.85 + fresnel * 0.15;

  gl_FragColor = vec4(baseColor, alpha);
}
`
