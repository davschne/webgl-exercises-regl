attribute vec3 a_Position;
attribute vec3 a_Color; // surface base color
attribute vec3 a_Normal; // surface orientation

uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix; // tranformation matrix for normal

varying vec3 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position; // vertex position in world coordinates

void main() {
  vec4 position = vec4(a_Position, 1.0);
  gl_Position = u_MvpMatrix * position;
  // Calculate vertex position in world coordinates
  v_Position = vec3(u_ModelMatrix * position);
  // Calculate normal transformed with normal matrix and normalized.
  v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
  v_Color = a_Color;
}
