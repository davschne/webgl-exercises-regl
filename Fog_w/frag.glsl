#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_FogColor;
// Distance of fog: vec2(starting point, full occlusion)
uniform vec2 u_FogDist;

varying vec3 v_Color;
varying float v_Dist;

void main() {
  float fogFactor = (u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x);
  vec3 color = mix(u_FogColor, v_Color, clamp(fogFactor, 0.0, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
