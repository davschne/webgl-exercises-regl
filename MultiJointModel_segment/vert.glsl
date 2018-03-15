attribute vec3 a_Position;
attribute vec3 a_Normal;

uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
uniform vec3 u_Color;
uniform vec3 u_LightDirection;

varying vec3 v_Color;

void main() {
  gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);
  // Lighting calculation
  vec3 normal = normalize((u_NormalMatrix * vec4(a_Normal, 1.0)).xyz);
  float nDotL = max(dot(normal, u_LightDirection), 0.0);
  v_Color = u_Color * nDotL + vec3(0.1);
}
