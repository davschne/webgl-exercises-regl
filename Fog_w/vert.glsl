uniform mat4 u_MvpMatrix;

attribute vec3 a_Position;
attribute vec3 a_Color;

varying vec3 v_Color;
varying float v_Dist;

void main() {
  gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);
  v_Color = a_Color;
  // Use the negative z value of each vertex in the view coordinate system.
  v_Dist = gl_Position.w;
}
