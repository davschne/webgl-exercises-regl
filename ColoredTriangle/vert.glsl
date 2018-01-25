attribute vec2 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

void main() {
  gl_Position = vec4(a_Position, 0, 1);
  v_Color = a_Color;
}
