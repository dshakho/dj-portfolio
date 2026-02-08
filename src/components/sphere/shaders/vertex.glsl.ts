import { simplexNoise3D } from '@/lib/noise'

export const vertexShader = /* glsl */ `
${simplexNoise3D}

uniform float uTime;
uniform float uNoiseScale;
uniform float uDisplacement;

varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);

  float noise = snoise(normal * uNoiseScale + uTime * 0.3);
  vDisplacement = noise;

  vec3 newPosition = position + normal * noise * uDisplacement;
  vPosition = newPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`
